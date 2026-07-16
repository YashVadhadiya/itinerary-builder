import type { PackageOverview, HotelOption, Transportation, PricingEntry, ItineraryDay, TermsSection, GalleryImage, CompanyDetails, ContactInfo } from '../types'

export const sampleOverview: PackageOverview = {
  destination: 'Sikkim-Darjeeling',
  stayBreakdown: 'Gangtok 3 Nights / Pelling 1 Night / Darjeeling 2 Nights',
  startDate: '23 August, 2026',
  tripDuration: '6 Nights / 7 Days',
  pax: 4,
}

export const sampleHotelOptions: HotelOption[] = [
  {
    id: 'opt_1',
    title: '3 Star Premium',
    stays: [
      {
        id: 'stay_1',
        nights: '1st (23 Aug) 2nd (24 Aug) 3rd (25 Aug)',
        city: 'Gangtok',
        hotelName: 'Click Collection Hotel 3 Star',
        mealPlan: ['CP'],
        accommodation: '2 Standard Room 4 Pax',
      },
      {
        id: 'stay_2',
        nights: '4th (26 Aug)',
        city: 'Pelling',
        hotelName: 'Magpie Pachhu Village Resort',
        mealPlan: ['CP'],
        accommodation: '2 Classic Room 4 Pax',
      },
      {
        id: 'stay_3',
        nights: '5th (27 Aug) 6th (28 Aug)',
        city: 'Darjeeling',
        hotelName: "Queen's Yard 3 Star",
        mealPlan: ['CP'],
        accommodation: '2 Deluxe 4 Pax',
      },
    ],
  },
  {
    id: 'opt_2',
    title: '4 Star Standard',
    stays: [
      {
        id: 'stay_4',
        nights: '1st (23 Aug) 2nd (24 Aug) 3rd (25 Aug)',
        city: 'Gangtok',
        hotelName: 'Magpie Libing Grand',
        mealPlan: ['CP'],
        accommodation: '2 Classic Room without Balcony 4 Pax',
      },
      {
        id: 'stay_5',
        nights: '4th (26 Aug)',
        city: 'Pelling',
        hotelName: 'Magpie the chestnut retreat',
        mealPlan: ['CP'],
        accommodation: '2 Delux 4 Pax',
      },
      {
        id: 'stay_6',
        nights: '5th (27 Aug) 6th (28 Aug)',
        city: 'Darjeeling',
        hotelName: 'Udaan Himalayan Suites & Spa 4 Star',
        mealPlan: ['CP'],
        accommodation: '2 Premium Kanchenjunga View Room 4 Pax',
      },
    ],
  },
]

export const sampleTransportation: Transportation = {
  vehicle: 'MVP',
  days: [
    { id: 'day_1', day: '1st Day (Sun, 23 Aug)', service: 'Bagdogra Airport to Gangtok - Arrival and Transfer' },
    { id: 'day_2', day: '2nd Day (Mon, 24 Aug)', service: 'Gangtok - Fullday Sightseeing' },
    { id: 'day_3', day: '3rd Day (Tue, 25 Aug)', service: 'Gangtok to Tsomgo Lake & New Baba Mandir - Excursion' },
    { id: 'day_4', day: '4th Day (Wed, 26 Aug)', service: 'Gangtok to Pelling - Transfer Via Namchi & Ravangla' },
    { id: 'day_5', day: '5th Day (Thu, 27 Aug)', service: 'Pelling to Darjeeling - Halfday Sightseeing and Transfer' },
    { id: 'day_6', day: '6th Day (Fri, 28 Aug)', service: 'Darjeeling - Fullday Sightseeing' },
    { id: 'day_7', day: '7th Day (Sat, 29 Aug)', service: 'Darjeeling to Bagdogra Airport - Drop' },
  ],
}

export const samplePricing: PricingEntry[] = [
  { optionId: 'opt_1', optionTitle: '3 Star Premium', amount: '92,500', includesGST: true },
  { optionId: 'opt_2', optionTitle: '4 Star Standard', amount: '99,500', includesGST: true },
]

export const sampleInclusionsExclusions = {
  inclusions: [
    'All sightseeing and transfers Toll Tax Fuel and driver\'s expense.',
    'Vehicles are on Point to Point Basis',
    'All necessary permits / ILP (Foreign citizen) for Tsomgo lake and baba Mandir. / North Sikkim',
    'Guides / entrance fees / Spot Parking',
  ],
  exclusions: [
    'Any cost arising due to natural / man-made calamities like landslides, road blockages, political disturbance, route diversion cost during transfers etc. has to be borne by the client which is payable directly to the driver during the course of the tour',
    'Air fare / Train fare / Joy Ride Tickets',
    'Any meals other than those specified in \'Cost Includes\'.',
    'Expense of personal nature such as tips, telephone calls, laundry, liquor, etc.',
    'Room Heater.',
    'Nathula Pass Gangtok: 5000/- per cab',
    'Sky Walk Pelling: 1500/- per cab',
    'Singshore Bridge Pelling: 2500/- per Cab',
    'Rock Garden : 1500 - 2500 per cab',
    'Vehicle Halting charges for Joy Ride (Directly payable to driver)',
    'Vehicles on disposal basis',
    'NOTE: Anything not mentioned in the inclusions is excluded.',
  ],
}

export const sampleItineraryDays: ItineraryDay[] = [
  {
    id: 'it_day_1',
    day: '1st Day (Sun 23rd August)',
    title: 'Bagdogra Airport to Gangtok - Arrival and Transfer',
    distance: '125 Km',
    travelTime: '5 hrs',
    description: 'Meet and greet on arrival at Bagdogra International Airport and transfer to Gangtok (5,500 Ft.). On arrival check-in to the hotel and rest of the day at leisure. Overnight stay at Gangtok.',
    points: [''],
  },
  {
    id: 'it_day_2',
    day: '2nd Day (Mon 24th August)',
    title: 'Gangtok - Fullday Sightseeing',
    distance: '',
    travelTime: '6 hrs',
    description: 'This morning we will embark on our Journey to see in an around of Gangtok Local Sightseeing.',
    points: [
      'Tashi View Point - Enjoy a panoramic view of the Kanchenjunga range, take photographs, and admire the scenic landscape. You may also see the nearby temples and some local stalls.',
      'Plant Conservatory - Explore the well-maintained gardens showcasing a variety of plants native to the region. Enjoy walking around, taking photos, and learning about the flora of the area.',
      'Institute of Tibetology - Explore the museum and library with exhibits related to Tibetan culture, history, and religion. The institute also offers stunning views of the surrounding area.',
      'Ropeway (Cable Car) - Enjoy a 10-15 minute ride, offering a bird\'s-eye view of Gangtok and the surrounding landscape.',
      'Ganesh Tok - Visit the small temple and enjoy a beautiful panoramic view of Gangtok from this elevated point.',
      'Gonjang Monastery - Visit the monastery, explore the tranquil surroundings, and admire the architecture and Tibetan Buddhist culture.',
      'Banjhakri Falls - Take a walk to the waterfall and enjoy the scenic beauty. The park also features statues of traditional Sikkimese culture.',
      'Directorate of Handloom & Handicrafts - The place showcases Sikkim\'s rich traditional arts and crafts.',
    ],
  },
  {
    id: 'it_day_3',
    day: '3rd Day (Tue 25th August)',
    title: 'Gangtok to Tsomgo Lake & New Baba Mandir - Excursion',
    distance: '120 Km',
    travelTime: '8 hrs',
    description: 'After breakfast, proceed for a full-day excursion to Tsomgo Lake, located about 40 km from Gangtok. Enjoy the scenic beauty of the lake along with optional activities like yak rides and a ride on the Tsomgo Ropeway. Later, continue to New Baba Mandir, a sacred temple dedicated to Baba Harbhajan Singh.',
    points: [
      'Nathula Pass can also be covered (permit subject to availability). The permit charges are to be paid directly to our team, and prior intimation is required at least one day before the excursion.',
      'Small cabs (Swift / Dzire / WagonR) are not permitted for Nathula Pass. Only SUVs (Innova / Xylo / Scorpio) are allowed.',
    ],
  },
  {
    id: 'it_day_4',
    day: '4th Day (Wed 26th August)',
    title: 'Gangtok to Pelling - Transfer Via Namchi & Ravangla',
    distance: '200 Km',
    travelTime: '8 hrs',
    description: 'After breakfast, start for Pelling via Namchi to visit Siddheshwar Dham (Chardham) and Sai Temple, Ravangla Buddha Park. On arrival check-in to your hotel. Overnight stay at Pelling.',
    points: [''],
  },
  {
    id: 'it_day_5',
    day: '5th Day (Thu 27th August)',
    title: 'Pelling to Darjeeling - Halfday Sightseeing and Transfer',
    distance: '100 Km',
    travelTime: '7 hrs 30 mins',
    description: 'After breakfast, we will start our half day tour visiting Sky Walk, Pemayangtshe Monastery, Rabdentshe Ruins, & Later start for Darjeeling. Evening free to stroll around the market on your own. Overnight stay at Darjeeling.',
    points: [''],
  },
  {
    id: 'it_day_6',
    day: '6th Day (Fri 28th August)',
    title: 'Darjeeling - Fullday Sightseeing',
    distance: '',
    travelTime: '8 hrs',
    description: 'Early rising at 4:00 am and we head towards Tiger Hill, a place famous for sunrise over Mt. Kanchendzonga. On our way back we will visit the Ghoom Monastery and Batasia Loop. From here we head back to our hotel where breakfast will be served. After breakfast we head out for 7 points sightseeing.',
    points: [
      'Himalayan Mountaineering Institute',
      'PNZ Zoological Park (closed on Thursday)',
      'Tenzing Rock',
      'Tibetan Refugee Centre (closed on Sunday)',
      'Tea Garden (outer view)',
      'Ropeway (Subject to availability)',
      'Japanese Temple and Peace Pagoda',
    ],
  },
  {
    id: 'it_day_7',
    day: '7th Day (Sat 29th August)',
    title: 'Darjeeling to Bagdogra Airport - Drop',
    distance: '70 Km',
    travelTime: '3 hrs',
    description: 'After early morning breakfast, depart for (IXB) Bagdogra Airport for the onward connection.',
    points: [''],
  },
]

export const sampleTerms: TermsSection[] = [
  {
    id: 'terms_1',
    title: 'Guidelines with respect to transportation',
    content: `We provide exclusive vehicles in our packages. As there is shortage of space for car parking in the entire Sikkim & Darjeeling region - guests will have to wait at the Lobby in time for the vehicle to start their sightseeing / transfers. Also, the lack of enough parking space is the primary reason why we offer only point to point service.\n\nDue to the services being on point-to-point basis and some local unwritten rules, we might be required to change vehicles based on the route. For example, a vehicle doing the sightseeing tour will not necessarily transfer you to the Airport. Because vehicles are likely to change during the course of the tour, guests are advised not leave behind any belongings.\n\nGuests are requested to maintain the transfer / sightseeing timings, especially in Gangtok. Due to local traffic laws, vehicles are not allowed to remain parked in front of the hotels for long (also most of the hotels do not have dedicated parking lots). If there is a delay in boarding the vehicle after it has arrived to receive the guests, the vehicle will be forced to leave and head to the nearest taxi stand.\n\nWe would appreciate it if the guests do not lend their ears to the drivers. In our experience, a lot of times drivers have tried to misguide guests to suit themselves. It's best if the guests discuss the issue with us first.\n\nShould the guests feel the need to change the sightseeing schedule, we request to be informed about it a day in advance by 16:00 hrs. After the said time it becomes difficult for us as we would have already planned the next day.\n\nPlease note any additional cost arising due to the reschedule will be charged additionally.\n\nAt times, due to rush at the tourism office in Gangtok, permits are issued late for restricted areas (Tsomgo Lake, New Baba Mandir, Nathu La, North Sikkim). Guests, patience is highly appreciated during such situations.\n\nTsomgo Lake / Nathula Pass / North permits are subject to availability and requires valid documents.\n\nDocuments required for permits and passes: Voter ID (Front and Back) or Passport (Front and Last Page) or Driving License (Front and Back) or Birth Certificate (for children). Passport-size photos.\nNote: Aadhar Card and PAN Card are not applicable.\n\nOperator reserves the right to re-arrange itinerary to suit hotel availability without changing the total number of days in each destination and without compromising any services.\n\nThe service includes transporting luggage according to the vehicle's capacity. Please inform us in advance about the amount of luggage you are carrying, as vehicles have limited storage space.\n\nThe travel package includes payment for transportation. However, if there are extra charges due to changes in the itinerary, such as additional stops or extra hours, these must be paid directly to the driver.\n\nAll activities and travel must be completed on the same day as planned. The itinerary cannot be extended to the next day or another day.\n\nThe transportation provider is not liable for cancellations or delays caused by events beyond their control, such as natural disasters, strikes, or other emergencies.\n\nIf the day's itinerary is canceled due to natural calamities like landslides, heavy rainfall, or other natural causes, it will not be rescheduled, and the amount paid will not be refunded.`,
  },
  {
    id: 'terms_2',
    title: 'Guidelines with respect to hotels',
    content: `Check-in 13:00 hrs. / Check-out time is 11:00 hrs. Early check-in or late check-out may be available upon request and subject to availability, but may incur additional charges.\n\nOnce hotels and rooms are booked, they cannot be changed upon arrival. Upgrading rooms and meal plans will be an additional cost to be paid by the guest.\n\nPlease check the room category and meal plan before confirming the package.\n\nMost hotels in the region do not have lift. In case if guests have trouble in climbing the stairs due to old age or medical conditions, we request to be informed in advance so that we can ask the hotels to book rooms at the lower levels of the hotels.\n\nThe tourism infrastructure in Sikkim & Darjeeling is not very developed and one should not expect or compare it with the standards of cities or other developed destinations.\n\nThere is always scarcity of water and power in the region; hence guests may come across situations like hot-water being supplied on a timely basis - morning & evening.\n\nRoom heaters are available at additional cost. (Except in Luxury and Premium category hotels)\n\nHotels in North Sikkim serve mostly vegetarian fare with very limited options for non-Vegetarian. This is primarily because of the location, which makes it difficult to source good quality meat.\n\nA valid photo ID proof for all guests staying at the hotel is mandatory.\n\nNote: As per the Government of Sikkim new tourism regulation, a one-time Sustainable Development Fee of Rs 50 per tourist will be collected at the hotel during check-in. This fee is applicable for all tourists above 5 years of age and is not included in the package cost.\n\nNote for Foreign Nationals: Foreign nationals are not permitted to visit Nathula Pass, Zuluk (Old Silk Route), and North Sikkim (Gurudongmar Lake and adjacent regions) as these are restricted border areas. Foreign guests can visit only permitted places in Gangtok and other open tourist destinations in Sikkim with the required permits.`,
  },
  {
    id: 'terms_3',
    title: 'Child Policy',
    content: `Child Below 5 years complimentary.\nChild 5-10 years without extra bed as mention in cost column (CNB = Child no Bed)\nChild 5-10 years with extra bed as mention in cost column (CWB = Child with Bed)\nAbove 10 years / Extra adult with an extra bed sharing room are same.\n\nHotels are very strict with the child policy. Please carry the age proof so that it can be produced if asked by hotel.`,
  },
  {
    id: 'terms_4',
    title: 'Booking / Payment Policy',
    content: `Journey date within 60 days - 20% of package cost.\nJourney date within 30 days - 50% of package cost.\nJourney Date within 30-20 days - 75% of package cost.\nJourney Date within 19-10 days - 100% of package cost / balance full package cost.`,
  },
  {
    id: 'terms_5',
    title: 'Cancellation Policy',
    content: `More than 60 days - Full refund (after deducting minimum charges per person as service fee)\n30-60 days - 35% of Package Cost, charge is applicable as per cancellation policy.\n15-29 days - 50% of Package Cost, charge is applicable as per cancellation policy.\n7-14 days - 70% of Package Cost, charge is applicable as per cancellation policy.\nLess than 7 days of your travel date if you cancel your trip then 100% of the package cost, charge is applicable as per cancellation policy. (There is no refund even if no show)`,
  },
]

export const sampleCompanyDetails: CompanyDetails = {
  companyName: 'Himalayan Travel Solutions',
  legalInfo: 'GSTIN: 19ABCDE1234F1Z5 | Registered under Govt. of India | Ministry of Tourism Approved',
  badges: [
    'ISO 9001:2025 Certified',
    'IATA Accredited Travel Agent',
    'Govt. of Sikkim Tourism Partner',
    'TripAdvisor Certificate of Excellence',
  ],
}

export const sampleGallery: GalleryImage[] = [
  { id: 'g_1', url: 'https://picsum.photos/seed/gangtok1/400/300' },
  { id: 'g_2', url: 'https://picsum.photos/seed/gangtok2/400/300' },
  { id: 'g_3', url: 'https://picsum.photos/seed/pelling1/400/300' },
  { id: 'g_4', url: 'https://picsum.photos/seed/pelling2/400/300' },
  { id: 'g_5', url: 'https://picsum.photos/seed/darjeeling1/400/300' },
  { id: 'g_6', url: 'https://picsum.photos/seed/darjeeling2/400/300' },
]

export const sampleContactInfo: ContactInfo = {
  ownerName: 'Rajesh Sharma',
  mobile: '+91 98765 43210',
  email: 'info@himalayantravels.com',
  instagram: '@himalayan_travels',
  officeAddress: 'MG Marg, Gangtok, Sikkim - 737101, India',
}
