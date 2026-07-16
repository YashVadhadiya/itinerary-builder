import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom'
import { ItineraryProvider } from './context/ItineraryContext'
import Layout from './components/layout/Layout'
import { StepOverview, StepHotels, StepTransport, StepPricing, StepInclusionsExclusions, StepItineraryDays, StepTerms, StepGallery, StepCompany, StepContact } from './pages/CreateItinerary'
import PreviewPage from './pages/PreviewPage'

function CreateFlow() {
  const navigate = useNavigate()
  const location = useLocation()

  const step = location.pathname

  if (step === '/create/preview') {
    return <PreviewPage />
  }

  return (
    <Layout>
      {step === '/create' && (
        <StepOverview onNext={() => navigate('/create/hotels')} />
      )}
      {step === '/create/hotels' && (
        <StepHotels
          onBack={() => navigate('/create')}
          onNext={() => navigate('/create/transport')}
        />
      )}
      {step === '/create/transport' && (
        <StepTransport
          onBack={() => navigate('/create/hotels')}
          onNext={() => navigate('/create/pricing')}
        />
      )}
      {step === '/create/pricing' && (
        <StepPricing
          onBack={() => navigate('/create/transport')}
          onNext={() => navigate('/create/inclusions-exclusions')}
        />
      )}
      {step === '/create/inclusions-exclusions' && (
        <StepInclusionsExclusions
          onBack={() => navigate('/create/pricing')}
          onNext={() => navigate('/create/itinerary-days')}
        />
      )}
      {step === '/create/itinerary-days' && (
        <StepItineraryDays
          onBack={() => navigate('/create/inclusions-exclusions')}
          onNext={() => navigate('/create/terms')}
        />
      )}
      {step === '/create/terms' && (
        <StepTerms
          onBack={() => navigate('/create/itinerary-days')}
          onNext={() => navigate('/create/gallery')}
        />
      )}
      {step === '/create/gallery' && (
        <StepGallery
          onBack={() => navigate('/create/terms')}
          onNext={() => navigate('/create/company')}
        />
      )}
      {step === '/create/company' && (
        <StepCompany
          onBack={() => navigate('/create/gallery')}
          onNext={() => navigate('/create/contact')}
        />
      )}
      {step === '/create/contact' && (
        <StepContact
          onBack={() => navigate('/create/company')}
          onNext={() => navigate('/create/preview')}
        />
      )}
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/itinerary-creator">
      <ItineraryProvider>
        <CreateFlow />
      </ItineraryProvider>
    </BrowserRouter>
  )
}
