import { BrowserRouter, useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import { ItineraryProvider } from './context/ItineraryContext'
import Layout from './components/layout/Layout'
import { StepOverview, StepHotels, StepTransport, StepPricing, StepInclusionsExclusions, StepItineraryDays, StepTerms, StepGallery, StepCompany, StepContact } from './pages/CreateItinerary'
import PreviewPage from './pages/PreviewPage'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-sm w-full text-center space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Itinerary Builder</h1>
          <p className="mt-2 text-sm text-gray-500">Create and manage travel itineraries</p>
        </div>

        <div className="space-y-4">
          <button onClick={() => navigate('/create')}
            className="w-full py-4 bg-blue-600 text-white font-semibold text-base rounded-2xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-200">
            + Create New Itinerary
          </button>
          <button onClick={() => navigate('/list')}
            className="w-full py-4 bg-white text-blue-700 font-semibold text-base rounded-2xl border-2 border-blue-200 hover:bg-blue-50 active:bg-blue-100 transition-colors">
            Edit Existing Itinerary
          </button>
        </div>

        <p className="text-xs text-gray-400">Manage all your travel packages in one place</p>
      </div>
    </div>
  )
}

function EmptyList() {
  const navigate = useNavigate()

  return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-sm">No saved itineraries yet.</p>
      <button onClick={() => navigate('/create')}
        className="mt-4 px-6 py-3 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition-colors">
        Create One
      </button>
    </div>
  )
}

function CreateFlow() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Layout>
      {location.pathname === '/create/preview' ? (
        <PreviewPage />
      ) : (
        <>
          {location.pathname === '/create' && <StepOverview onNext={() => navigate('/create/hotels')} />}
          {location.pathname === '/create/hotels' && <StepHotels onBack={() => navigate('/create')} onNext={() => navigate('/create/transport')} />}
          {location.pathname === '/create/transport' && <StepTransport onBack={() => navigate('/create/hotels')} onNext={() => navigate('/create/pricing')} />}
          {location.pathname === '/create/pricing' && <StepPricing onBack={() => navigate('/create/transport')} onNext={() => navigate('/create/inclusions-exclusions')} />}
          {location.pathname === '/create/inclusions-exclusions' && <StepInclusionsExclusions onBack={() => navigate('/create/pricing')} onNext={() => navigate('/create/itinerary-days')} />}
          {location.pathname === '/create/itinerary-days' && <StepItineraryDays onBack={() => navigate('/create/inclusions-exclusions')} onNext={() => navigate('/create/terms')} />}
          {location.pathname === '/create/terms' && <StepTerms onBack={() => navigate('/create/itinerary-days')} onNext={() => navigate('/create/gallery')} />}
          {location.pathname === '/create/gallery' && <StepGallery onBack={() => navigate('/create/terms')} onNext={() => navigate('/create/company')} />}
          {location.pathname === '/create/company' && <StepCompany onBack={() => navigate('/create/gallery')} onNext={() => navigate('/create/contact')} />}
          {location.pathname === '/create/contact' && <StepContact onBack={() => navigate('/create/company')} onNext={() => navigate('/create/preview')} />}
        </>
      )}
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ItineraryProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/list" element={<EmptyList />} />
          <Route path="/create/*" element={<CreateFlow />} />

        </Routes>
      </ItineraryProvider>
    </BrowserRouter>
  )
}
