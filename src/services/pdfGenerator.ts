import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function generatePdf() {
  const pageEls = document.querySelectorAll<HTMLElement>('[data-page-id]')
  if (!pageEls.length) {
    console.error('[PDF] No pages found')
    return
  }

  console.log(`[PDF] Generating PDF with ${pageEls.length} pages`)

  const dest = pageEls[0]
    ?.textContent?.match(/Destination\s+(.+)/)?.[1]?.trim() || 'itinerary'

  const pdf = new jsPDF('p', 'mm', 'a4')

  pdf.setProperties({
    title: `Travel Itinerary - ${dest}`,
    author: 'Itinerary Creator',
    subject: `Travel Itinerary for ${dest}`,
    keywords: 'itinerary, travel, trip, ' + dest,
    creator: 'Itinerary Creator',
  })

  for (let i = 0; i < pageEls.length; i++) {
    const el = pageEls[i]

    try {
      console.log(`[PDF] Capturing page ${i + 1}...`)

      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (doc) => {
          const cloned = doc.querySelector('[data-page-id]') as HTMLElement
          if (cloned) {
            cloned.style.border = 'none'
            cloned.style.boxShadow = 'none'
          }
        },
      })

      const dataUrl = canvas.toDataURL('image/jpeg', 0.98)

      if (i > 0) pdf.addPage()
      pdf.addImage(dataUrl, 'JPEG', 0, 0, 210, 297)
      console.log(`[PDF] Page ${i + 1} added`)
    } catch (err) {
      console.error(`[PDF] Failed to capture page ${i + 1}:`, err)
    }
  }

  const filename = `Itinerary_${dest.replace(/\s+/g, '_')}.pdf`
  console.log(`[PDF] Saving as ${filename}`)
  pdf.save(filename)
}
