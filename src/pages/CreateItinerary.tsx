import { useItinerary } from '../context/ItineraryContext'
import PackageOverviewForm from '../components/forms/PackageOverviewForm'
import HotelsForm from '../components/forms/HotelsForm'
import TransportationForm from '../components/forms/TransportationForm'
import PricingForm from '../components/forms/PricingForm'
import InclusionsExclusionsForm from '../components/forms/InclusionsExclusionsForm'
import DayWiseItineraryForm from '../components/forms/DayWiseItineraryForm'
import TermsForm from '../components/forms/TermsForm'
import GalleryForm from '../components/forms/GalleryForm'
import CompanyDetailsForm from '../components/forms/CompanyDetailsForm'
import ContactForm from '../components/forms/ContactForm'

interface Props {
  onNext: () => void
  onBack?: () => void
}

export function StepOverview({ onNext }: Props) {
  const { state } = useItinerary()
  return (
    <div className="max-w-2xl mx-auto">
      <StepHeader step={1} label="Package Overview" />
      <PackageOverviewForm initialData={state.packageOverview} onNext={onNext} />
    </div>
  )
}

export function StepHotels({ onNext, onBack }: Props) {
  const { state } = useItinerary()
  return (
    <div className="max-w-3xl mx-auto">
      <StepHeader step={2} label="Hotels" />
      <HotelsForm
        initialData={state.hotelOptions}
        onBack={onBack!}
        onNext={onNext}
      />
    </div>
  )
}

export function StepTransport({ onNext, onBack }: Props) {
  const { state } = useItinerary()
  return (
    <div className="max-w-3xl mx-auto">
      <StepHeader step={3} label="Transportation" />
      <TransportationForm
        initialData={state.transportation}
        onBack={onBack!}
        onNext={onNext}
      />
    </div>
  )
}

export function StepPricing({ onNext, onBack }: Props) {
  const { state } = useItinerary()
  return (
    <div className="max-w-3xl mx-auto">
      <StepHeader step={4} label="Pricing" />
      <PricingForm
        initialData={state.pricing}
        hotelOptions={state.hotelOptions}
        onBack={onBack!}
        onNext={onNext}
      />
    </div>
  )
}

export function StepInclusionsExclusions({ onNext, onBack }: Props) {
  const { state } = useItinerary()
  return (
    <div className="max-w-3xl mx-auto">
      <StepHeader step={5} label="Inclusions & Exclusions" />
      <InclusionsExclusionsForm
        initialData={state.inclusionsExclusions}
        onBack={onBack!}
        onNext={onNext}
      />
    </div>
  )
}

export function StepItineraryDays({ onNext, onBack }: Props) {
  const { state } = useItinerary()
  return (
    <div className="max-w-3xl mx-auto">
      <StepHeader step={6} label="Day Wise Itinerary" />
      <DayWiseItineraryForm
        initialData={state.itineraryDays}
        onBack={onBack!}
        onNext={onNext}
      />
    </div>
  )
}

export function StepTerms({ onNext, onBack }: Props) {
  const { state } = useItinerary()
  return (
    <div className="max-w-3xl mx-auto">
      <StepHeader step={7} label="Terms & Conditions" />
      <TermsForm
        initialData={state.terms}
        onBack={onBack!}
        onNext={onNext}
      />
    </div>
  )
}

export function StepGallery({ onNext, onBack }: Props) {
  const { state } = useItinerary()
  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader step={8} label="Photo Gallery" />
      <GalleryForm
        initialData={state.gallery}
        onBack={onBack!}
        onNext={onNext}
      />
    </div>
  )
}

export function StepCompany({ onNext, onBack }: Props) {
  const { state } = useItinerary()
  return (
    <div className="max-w-2xl mx-auto">
      <StepHeader step={9} label="Company Details" />
      <CompanyDetailsForm
        initialData={state.companyDetails}
        onBack={onBack!}
        onNext={onNext}
      />
    </div>
  )
}

export function StepContact({ onNext, onBack }: Props) {
  const { state } = useItinerary()
  return (
    <div className="max-w-2xl mx-auto">
      <StepHeader step={10} label="Contact Information" />
      <ContactForm
        initialData={state.contactInfo}
        onBack={onBack!}
        onNext={onNext}
      />
    </div>
  )
}

const TOTAL_STEPS = 10

function StepHeader({ step, label }: { step: number; label: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Itinerary</h1>
      <p className="mt-1 text-sm text-gray-500">
        Step {step} of {TOTAL_STEPS} — {label}
      </p>
    </div>
  )
}
