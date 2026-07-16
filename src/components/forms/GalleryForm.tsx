import { useState, useRef } from 'react'
import type { GalleryImage } from '../../types'
import { useItinerary } from '../../context/ItineraryContext'

interface Props {
  initialData: GalleryImage[]
  onBack: () => void
  onNext: () => void
}

const PHOTOS_PER_PAGE = 6

export default function GalleryForm({ initialData, onBack, onNext }: Props) {
  const { dispatch } = useItinerary()
  const [images, setImages] = useState<GalleryImage[]>(initialData)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files) return
    setImages((prev) => [...prev, ...Array.from(files).map((file, i) => ({ id: `img_${Date.now()}_${i}`, url: URL.createObjectURL(file), file }))])
  }

  function addUrl() {
    const url = prompt('Paste image URL:')
    if (url) setImages((prev) => [...prev, { id: `img_${Date.now()}`, url }])
  }

  function loadPreset(count: number) {
    setImages(Array.from({ length: count }, (_, i) => ({ id: `preset_${i}_${Date.now()}`, url: `https://picsum.photos/seed/itinerary${i}/400/300` })))
  }

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); dispatch({ type: 'SET_GALLERY', payload: images }); onNext() }
  const pages = Math.ceil(images.length / PHOTOS_PER_PAGE) || 1

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gallery</h2>
            <p className="text-sm text-gray-500">{images.length} photo{images.length !== 1 ? 's' : ''} · {pages} page{pages > 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-2">
            {[6, 12, 18].map((n) => (
              <button key={n} type="button" onClick={() => loadPreset(n)}
                className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors ${images.length === n ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{n}</button>
            ))}
            <button type="button" onClick={() => fileRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors">Upload</button>
            <button type="button" onClick={addUrl}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors">+ URL</button>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
          </div>
        </div>

        {images.length ? (
          <div className="space-y-4">
            {Array.from({ length: pages }).map((_, pageIdx) => (
              <div key={pageIdx}>
                <div className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Page {pageIdx + 1}</div>
                <div className="grid grid-cols-3 gap-2">
                  {images.slice(pageIdx * PHOTOS_PER_PAGE, (pageIdx + 1) * PHOTOS_PER_PAGE).map((img) => (
                    <div key={img.id} className="relative group aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      <img src={img.url} alt="" className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>' }} />
                      <button type="button" onClick={() => setImages((prev) => prev.filter((im) => im.id !== img.id))}
                        className="absolute top-1 right-1 w-7 h-7 bg-red-500/90 text-white rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-base">No photos yet</p>
            <p className="text-sm mt-1">Upload images or add URLs</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onBack}
          className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors">Back</button>
        <button type="submit"
          className="flex-1 px-6 py-3.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200">Next</button>
      </div>
    </form>
  )
}
