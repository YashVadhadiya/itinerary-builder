import type {
  PackageOverview, HotelOption, Transportation,
  PricingEntry, InclusionsExclusions, ItineraryDay,
  TermsSection, CompanyDetails, ContactInfo,
} from '../types'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'

export interface ItinerarySnapshot {
  packageOverview: PackageOverview
  hotelOptions: HotelOption[]
  transportation: Transportation
  pricing: PricingEntry[]
  inclusionsExclusions: InclusionsExclusions
  itineraryDays: ItineraryDay[]
  terms: TermsSection[]
  companyDetails: CompanyDetails
  contactInfo: ContactInfo
}

function normalizePrivateKey(key: string): string {
  return key.replace(/\\n/g, '\n').trim()
}

function pemToBinary(pem: string): ArrayBufferLike {
  const b64 = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '')
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

function base64UrlEncode(buffer: ArrayBufferLike): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const cleaned = normalizePrivateKey(pem)
  const der = pemToBinary(cleaned)
  return crypto.subtle.importKey(
    'pkcs8', der,
    { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
    false, ['sign'],
  )
}

async function createJWT(clientEmail: string, privateKey: string): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: clientEmail,
    scope: SCOPES.join(' '),
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  }
  const encoder = new TextEncoder()
  const headerB64 = base64UrlEncode(encoder.encode(JSON.stringify(header)))
  const payloadB64 = base64UrlEncode(encoder.encode(JSON.stringify(payload)))
  const message = `${headerB64}.${payloadB64}`
  const key = await importPrivateKey(privateKey)
  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' }, key, encoder.encode(message),
  )
  return `${message}.${base64UrlEncode(signature)}`
}

class GoogleSheetsApi {
  private accessToken: string | null = null
  private tokenExpiry = 0
  private clientEmail: string
  private privateKey: string
  private spreadsheetId: string

  constructor(clientEmail: string, privateKey: string, spreadsheetId: string) {
    this.clientEmail = clientEmail
    this.privateKey = privateKey
    this.spreadsheetId = spreadsheetId
  }

  private async ensureToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) return this.accessToken
    const jwt = await createJWT(this.clientEmail, this.privateKey)
    const resp = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })
    if (!resp.ok) throw new Error(`Token exchange failed (${resp.status}): ${await resp.text()}`)
    const data = await resp.json()
    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
    return this.accessToken!
  }

  private async request(method: string, path: string, body?: unknown, params?: Record<string, string>): Promise<any> {
    const token = await this.ensureToken()
    let url = `${SHEETS_BASE}/${this.spreadsheetId}${path}`
    if (params) url += '?' + new URLSearchParams(params).toString()
    const resp = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!resp.ok) throw new Error(`Sheets API error (${resp.status}): ${await resp.text()}`)
    return resp.json()
  }

  async ensureSheets(titles: string[]): Promise<void> {
    const spreadsheet = await this.request('GET', '')
    const existing = new Set(spreadsheet.sheets.map((s: any) => s.properties.title))
    const toCreate = titles.filter((t) => !existing.has(t))
    if (!toCreate.length) return
    await this.request('POST', ':batchUpdate', {
      requests: toCreate.map((title) => ({ addSheet: { properties: { title } } })),
    })
  }

  async appendRows(sheetName: string, values: unknown[][]): Promise<void> {
    const range = encodeURIComponent(`${sheetName}!A1`)
    await this.request('POST', `/values/${range}:append`, { values }, { valueInputOption: 'USER_ENTERED' })
  }

  async clearSheet(sheetName: string): Promise<void> {
    const range = encodeURIComponent(`${sheetName}!A:Z`)
    await this.request('POST', `/values/${range}:clear`)
  }

  async readSheet(sheetName: string): Promise<string[][]> {
    const range = encodeURIComponent(`${sheetName}!A:Z`)
    const result = await this.request('GET', `/values/${range}`)
    return result.values || []
  }

  private async ensureHeaders(sheetName: string, headers: string[]): Promise<void> {
    const existing = await this.readSheet(sheetName)
    if (existing.length === 0 || existing[0].length === 0) {
      await this.appendRows(sheetName, [headers])
    }
  }

  async seed(): Promise<void> {
    const sheets = [
      'Hotels', 'Transportation', 'Inclusions', 'Exclusions',
      'Itinerary Days', 'Terms', 'Company Details', 'Contact Info',
    ]
    await this.ensureSheets(sheets)

    await this.ensureHeaders('Hotels', ['State', 'Hotel Name', 'City', 'Meal Plan', 'Accommodation'])
    await this.ensureHeaders('Transportation', ['Vehicle', 'Day', 'Service'])
    await this.ensureHeaders('Inclusions', ['Category', 'Item'])
    await this.ensureHeaders('Exclusions', ['Category', 'Item'])
    await this.ensureHeaders('Itinerary Days', ['State', 'Day', 'Title', 'Distance', 'Travel Time', 'Description', 'Points'])
    await this.ensureHeaders('Terms', ['State', 'Title', 'Content'])
    await this.ensureHeaders('Company Details', ['Company Name', 'Legal Info', 'Badges'])
    await this.ensureHeaders('Contact Info', ['Owner Name', 'Mobile', 'Email', 'Instagram', 'Address'])
  }

  async fetchRef<T>(sheetName: string, mapper: (row: string[]) => T | null): Promise<T[]> {
    const rows = await this.readSheet(sheetName)
    if (rows.length <= 1) return []
    const items: T[] = []
    for (let i = 1; i < rows.length; i++) {
      const item = mapper(rows[i])
      if (item) items.push(item)
    }
    return items
  }

  async addRefRow(sheetName: string, values: string[]): Promise<void> {
    await this.appendRows(sheetName, [values])
  }

  async save(data: ItinerarySnapshot): Promise<string> {
    const sheetNames = [
      'Itineraries', 'Hotels', 'Transportation', 'Pricing',
      'Inclusions', 'Exclusions', 'Itinerary Days', 'Terms',
      'Company Details', 'Contact Info',
    ]
    await this.ensureSheets(sheetNames)

    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const rows: Record<string, unknown[][]> = {
      Itineraries: [], Hotels: [], Transportation: [], Pricing: [],
      Inclusions: [], Exclusions: [], 'Itinerary Days': [], Terms: [],
      'Company Details': [], 'Contact Info': [],
    }

    rows.Itineraries.push([id, now, data.packageOverview.destination, data.packageOverview.stayBreakdown, data.packageOverview.startDate, data.packageOverview.tripDuration, data.packageOverview.pax])

    for (const opt of data.hotelOptions)
      for (const stay of opt.stays)
        rows.Hotels.push([id, opt.title, stay.nights, stay.city, stay.hotelName, stay.mealPlan.join(', '), stay.accommodation])

    rows.Transportation.push([id, data.transportation.vehicle])
    for (const day of data.transportation.days)
      rows.Transportation.push([id, '', day.day, day.service])

    for (const entry of data.pricing)
      rows.Pricing.push([id, entry.optionTitle, entry.amount, entry.includesGST ? 'Yes' : 'No'])

    for (const inc of data.inclusionsExclusions.inclusions.filter(Boolean))
      rows.Inclusions.push([id, inc])
    for (const exc of data.inclusionsExclusions.exclusions.filter(Boolean))
      rows.Exclusions.push([id, exc])

    for (const day of data.itineraryDays)
      rows['Itinerary Days'].push([id, day.day, day.title, day.distance || '', day.travelTime || '', day.description || '', day.points.filter(Boolean).join('\n')])

    for (const section of data.terms)
      rows.Terms.push([id, section.title, section.content])

    rows['Company Details'].push([id, data.companyDetails.companyName, data.companyDetails.legalInfo, data.companyDetails.badges.filter(Boolean).join(', ')])
    rows['Contact Info'].push([id, data.contactInfo.ownerName, data.contactInfo.mobile, data.contactInfo.email, data.contactInfo.instagram, data.contactInfo.officeAddress])

    for (const [sheetName, sheetRows] of Object.entries(rows))
      if (sheetRows.length > 0) await this.appendRows(sheetName, sheetRows)

    return id
  }
}

let instance: GoogleSheetsApi | null = null

function getApi(): GoogleSheetsApi {
  if (instance) return instance
  const clientEmail = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = import.meta.env.VITE_GOOGLE_PRIVATE_KEY
  const spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID
  if (!clientEmail || !privateKey || !spreadsheetId)
    throw new Error('Google Sheets credentials not configured. Set VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL, VITE_GOOGLE_PRIVATE_KEY, and VITE_GOOGLE_SPREADSHEET_ID in .env')
  instance = new GoogleSheetsApi(clientEmail, privateKey, spreadsheetId)
  return instance
}

export function isSheetsConfigured(): boolean {
  return !!(
    import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    import.meta.env.VITE_GOOGLE_PRIVATE_KEY &&
    import.meta.env.VITE_GOOGLE_SPREADSHEET_ID
  )
}

export async function saveItineraryToSheets(data: ItinerarySnapshot): Promise<string> {
  return getApi().save(data)
}

export async function seedReferenceData(): Promise<void> {
  await getApi().seed()
}

export async function fetchRefData<T>(sheetName: string, mapper: (row: string[]) => T | null): Promise<T[]> {
  return getApi().fetchRef(sheetName, mapper)
}

export async function addRefRow(sheetName: string, values: string[]): Promise<void> {
  await getApi().addRefRow(sheetName, values)
}
