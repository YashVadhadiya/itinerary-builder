import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useItinerary } from '../../context/ItineraryContext'
import {
  sampleOverview, sampleHotelOptions, sampleTransportation,
  samplePricing, sampleInclusionsExclusions, sampleItineraryDays,
  sampleTerms, sampleCompanyDetails, sampleContactInfo,
} from '../../utils/sampleData'
import { isSheetsConfigured, seedReferenceData } from '../../services/googleSheets'

const STEPS = [
  { path: '/create', label: 'Overview' },
  { path: '/create/hotels', label: 'Hotels' },
  { path: '/create/transport', label: 'Transport' },
  { path: '/create/pricing', label: 'Pricing' },
  { path: '/create/inclusions-exclusions', label: 'Inc/Exc' },
  { path: '/create/itinerary-days', label: 'Days' },
  { path: '/create/terms', label: 'Terms' },
  { path: '/create/gallery', label: 'Gallery' },
  { path: '/create/company', label: 'Company' },
  { path: '/create/contact', label: 'Contact' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { dispatch } = useItinerary()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  const currentStep = STEPS.findIndex((s) => s.path === location.pathname)
  const isPreview = location.pathname === '/create/preview'
  const showSteps = currentStep >= 0 && !isPreview

  function loadSampleData() {
    dispatch({ type: 'SET_PACKAGE_OVERVIEW', payload: sampleOverview })
    dispatch({ type: 'SET_HOTEL_OPTIONS', payload: sampleHotelOptions })
    dispatch({ type: 'SET_TRANSPORTATION', payload: sampleTransportation })
    dispatch({ type: 'SET_PRICING', payload: samplePricing })
    dispatch({ type: 'SET_INCLUSIONS_EXCLUSIONS', payload: sampleInclusionsExclusions })
    dispatch({ type: 'SET_ITINERARY_DAYS', payload: sampleItineraryDays })
    dispatch({ type: 'SET_TERMS', payload: sampleTerms })
    dispatch({ type: 'SET_COMPANY_DETAILS', payload: sampleCompanyDetails })
    dispatch({ type: 'SET_CONTACT_INFO', payload: sampleContactInfo })
  }

  async function handleSeed() {
    setSeedMsg('')
    try {
      await seedReferenceData()
      setSeedMsg('Ready!')
      setTimeout(() => setSeedMsg(''), 2000)
    } catch (err: any) {
      setSeedMsg(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-base font-bold text-gray-900 tracking-tight">
            ✦ Itinerary
          </Link>

          <div className="flex items-center gap-2">
            {isSheetsConfigured() && (
              <button
                type="button"
                onClick={handleSeed}
                className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 active:bg-emerald-200 transition-colors"
              >
                {seedMsg || 'Seed'}
              </button>
            )}
            <button
              type="button"
              onClick={loadSampleData}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 active:bg-blue-200 transition-colors"
            >
              Sample
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-1 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Menu"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 bg-white">
            <div className="max-w-3xl mx-auto px-4 py-3 space-y-1">
              <Link to="/create" onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 active:bg-gray-100">
                New Itinerary
              </Link>
              <Link to="/create/preview" onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 active:bg-gray-100">
                Preview
              </Link>
            </div>
          </div>
        )}

        {showSteps && (
          <div className="border-t border-gray-100 bg-white px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 py-2.5 min-w-max max-w-3xl mx-auto">
              {STEPS.map((step, idx) => {
                const isActive = idx === currentStep
                const isDone = idx < currentStep
                return (
                  <div key={step.path} className="flex items-center gap-1">
                    {idx > 0 && (
                      <div className={`w-4 h-px ${isDone ? 'bg-blue-500' : 'bg-gray-200'}`} />
                    )}
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                        isActive ? 'bg-blue-600 text-white shadow-sm' :
                        isDone ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </header>

      <main className="pb-20">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
