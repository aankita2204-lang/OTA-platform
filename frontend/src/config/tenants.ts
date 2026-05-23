export type NavTab = 'flight' | 'hotel' | 'holidays' | 'deals';

export interface BlockConfig {
  variant: number;
  colorOverride?: string;
  enabled: boolean;
}

export interface SiteConfig {
  tenantId: string;
  name: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    borderRadius: number;
    fontFamily: string;
    darkTheme: boolean;
  };
  navigation: {
    id: NavTab;
    label: string;
    enabled: boolean;
  }[];
  layout: string[];
  blockConfigs: Record<string, BlockConfig>;
  featureFlags: {
    showPromoApp: boolean;
    enableSearchAnalytics: boolean;
  };
  content: Record<string, any> & { resultsLabels: { flight: string; hotel: string; deals: string }; resultsFoundText: string };
  navbar: {
    ctaLabel: string;
    loginTitle: string;
    loginButtonText: string;
    loginDemoText: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
  };
  search: {
    defaultFrom: string;
    defaultTo: string;
    tripTypes: string[];
    searchButtonText: string;
    searchingText: string;
    travelers: string[];
    classes: string[];
    fieldLabels: {
      from: string;
      to: string;
      departure: string;
      returnDate: string;
      travelers: string;
      class: string;
    };
    mockData: {
      flights: { id: string; code: string; airline: string; dep: string; arr: string; duration: string; stops: string; price: string; tag?: string }[];
      hotels: { id: string; name: string; stars: number; rating: string; location: string; price: string; tag: string }[];
      packages: { id: string; title: string; nights: number; includes: string; price: string; image: string }[];
    };
  };
  popular: {
    title: string;
    subtitle: string;
    bookNowText: string;
    items: { id: number; title: string; sub: string; icon: string; type: 'flight' | 'hotel' | 'deals' }[];
    dealDetails: Record<string, { description: string; highlights: string[] }>;
  };
  footer: {
    copyrightText: string;
    policies: Record<string, string>;
  };
  editor: {
    editSiteText: string;
    exitEditorText: string;
    saveButtonText: string;
    savingText: string;
    resetButtonText: string;
    resetConfirmText: string;
    sectionLabels: Record<string, string>;
    colorOverrides: string[];
    formLabels: {
      siteEditor: string;
      buildingFor: string;
      selectBlock: string;
      blockProperties: string;
      clickBlockHint: string;
      customize: string;
      layoutVariant: string;
      colorOverride: string;
      clear: string;
      visibility: string;
      enableBlock: string;
      navigationTabs: string;
      ctaButton: string;
      heroContent: string;
      headline: string;
      subHeadline: string;
      ctaButtonText: string;
      searchConfig: string;
      defaultFrom: string;
      defaultTo: string;
      searchButtonText: string;
      searchingText: string;
      footerContent: string;
      brandName: string;
      policyLinks: string;
      popularDeals: string;
      sectionTitle: string;
      subtitle: string;
    };
  };
}

export const TENANTS: Record<string, SiteConfig> = {
  mmt: {
    tenantId: 'mmt',
    name: 'MakeMyTrip',
    theme: {
      primaryColor: '#e040fb',
      secondaryColor: '#3d5afe',
      borderRadius: 12,
      fontFamily: "'Inter', sans-serif",
      darkTheme: true,
    },
    navigation: [
      { id: 'flight', label: '✈ Flights', enabled: true },
      { id: 'hotel', label: '🏨 Hotels', enabled: true },
      { id: 'holidays', label: '🌴 Holidays', enabled: true },
      { id: 'deals', label: '🏷 Deals', enabled: true },
    ],
    layout: ['navbar', 'hero', 'search', 'popular', 'footer'],
    blockConfigs: {
      navbar: { variant: 1, enabled: true },
      hero: { variant: 1, enabled: true },
      search: { variant: 1, enabled: true },
      popular: { variant: 1, enabled: true },
      footer: { variant: 1, enabled: true },
    },
    featureFlags: {
      showPromoApp: true,
      enableSearchAnalytics: true,
    },
    content: {
      hero: {
        headline: 'Fly with Confidence',
        subHeadline: 'Booking made simple and fast.',
        cta: 'Book Now',
      },
      resultsLabels: {
        flight: 'Flight Results',
        hotel: 'Hotel Results',
        deals: 'Package Results',
      },
      resultsFoundText: 'found',
    },
    navbar: {
      ctaLabel: 'Sign In',
      loginTitle: 'Sign In',
      loginButtonText: 'Sign In',
      loginDemoText: 'Demo mode — any input works',
      emailPlaceholder: 'Email or Phone',
      passwordPlaceholder: 'Password',
    },
    search: {
      defaultFrom: 'New Delhi (DEL)',
      defaultTo: 'Mumbai (BOM)',
      tripTypes: ['One Way', 'Round Trip'],
      searchButtonText: 'Search Flights',
      searchingText: 'Searching...',
      travelers: ['1 Traveler', '2 Travelers', '3 Travelers', '4 Travelers', '5+ Travelers'],
      classes: ['Economy', 'Premium Economy', 'Business', 'First Class'],
      fieldLabels: {
        from: 'From',
        to: 'To',
        departure: 'Departure',
        returnDate: 'Return',
        travelers: 'Travelers',
        class: 'Class',
      },
      mockData: {
        flights: [
          { id: '1', code: 'AI-101', airline: 'Air India', dep: '06:00', arr: '08:30', duration: '2h 30m', stops: 'Non-stop', price: '₹4,500', tag: 'cheapest' },
          { id: '2', code: '6E-203', airline: 'IndiGo', dep: '09:15', arr: '11:45', duration: '2h 30m', stops: 'Non-stop', price: '₹5,200', tag: 'fast' },
          { id: '3', code: 'UK-811', airline: 'Vistara', dep: '14:00', arr: '16:45', duration: '2h 45m', stops: 'Non-stop', price: '₹6,800', tag: 'best' },
        ],
        hotels: [
          { id: '1', name: 'Grand Hyatt', stars: 5, rating: '4.5', location: 'BKC, Mumbai', price: '₹12,000/night', tag: 'Luxury' },
          { id: '2', name: 'Taj Palace', stars: 5, rating: '4.7', location: 'Colaba, Mumbai', price: '₹15,000/night', tag: 'Top Rated' },
          { id: '3', name: 'Novotel', stars: 4, rating: '4.2', location: 'Juhu, Mumbai', price: '₹6,500/night', tag: 'Value' },
        ],
        packages: [
          { id: '1', title: 'Goa Beach Getaway', nights: 3, includes: 'Flights + Hotel', price: '₹18,500', image: '' },
          { id: '2', title: 'Kerala Backwaters', nights: 4, includes: 'Hotel + Meals', price: '₹22,000', image: '' },
          { id: '3', title: 'Rajasthan Heritage Tour', nights: 5, includes: 'Flights + Hotel + Safari', price: '₹35,000', image: '' },
        ],
      },
    },
    popular: {
      title: 'Discover curated trips for {name}',
      subtitle: 'Hand-picked for your next adventure.',
      bookNowText: 'Book Now',
      items: [
        { id: 1, title: 'Mumbai to Goa', sub: 'Starts from ₹2,500', icon: '✈️', type: 'flight' },
        { id: 2, title: 'Delhi to London', sub: 'Starts from ₹45,000', icon: '✈️', type: 'flight' },
        { id: 3, title: 'The Taj Residency', sub: 'Luxury Stay', icon: '🏨', type: 'hotel' },
        { id: 4, title: 'Goa Beach Resort', sub: 'Sun & Sand', icon: '🌴', type: 'deals' },
      ],
      dealDetails: {
        'Mumbai to Goa': { description: 'Fly from Mumbai to the sunny beaches of Goa. Multiple daily flights available with IndiGo, Air India, and SpiceJet.', highlights: ['3+ daily flights', '1h 15m duration', 'Baggage included', 'Free cancellation'] },
        'Delhi to London': { description: 'Direct flights from Delhi to London Heathrow with Air India and Vistara. Experience world-class service.', highlights: ['Direct flights available', '8h 30m duration', 'Meals included', '2 bags check-in'] },
        'The Taj Residency': { description: 'Experience luxury at The Taj Residency. 5-star amenities including spa, pool, and fine dining.', highlights: ['5-star rating', 'Free breakfast', 'Spa & pool access', 'WiFi included'] },
        'Goa Beach Resort': { description: 'Beachfront resort with private beach access, water sports, and sunset views.', highlights: ['Beachfront location', 'Water sports', 'Sunset bar', 'Family friendly'] },
      },
    },
    footer: {
      copyrightText: 'White-Label Travel. All rights reserved.',
      policies: {
        'Privacy Policy': 'We collect minimal data to improve your booking experience. Your personal information is encrypted and never shared with third parties without consent. You can request data deletion at any time via support.',
        'Terms of Service': 'By using this platform, you agree to our booking terms and cancellation policies. All prices are subject to availability. Refunds are processed within 7-10 business days as per our cancellation policy.',
        'Cookie Policy': 'We use cookies to personalize your experience, remember your preferences, and analyze traffic. You can manage cookie preferences in your browser settings. Essential cookies cannot be disabled.',
      },
    },
    editor: {
      editSiteText: 'Edit Site',
      exitEditorText: 'Exit Editor',
      saveButtonText: 'Save & Publish',
      savingText: 'Saving...',
      resetButtonText: 'Reset to Defaults',
      resetConfirmText: 'Reset this tenant to original defaults?',
      sectionLabels: { navbar: 'Navigation Bar', hero: 'Hero Promo', search: 'Search Widget', popular: 'Popular Deals', footer: 'Footer Area' },
      colorOverrides: ['#e040fb', '#00c896', '#6c7ae0', '#ffb300', '#f44336'],
      formLabels: {
        siteEditor: 'Site Editor',
        buildingFor: 'Building for',
        selectBlock: 'Select Block to Customize',
        blockProperties: 'Block Properties',
        clickBlockHint: 'Click a block on the left to start customizing.',
        customize: 'Customize',
        layoutVariant: 'Layout Variant',
        colorOverride: 'Color Override',
        clear: 'Clear',
        visibility: 'Visibility',
        enableBlock: 'Enable this block',
        navigationTabs: 'Navigation Tabs',
        ctaButton: 'CTA Button',
        heroContent: 'Hero Content',
        headline: 'Headline',
        subHeadline: 'Sub-headline',
        ctaButtonText: 'CTA Button Text',
        searchConfig: 'Search Config',
        defaultFrom: 'Default From',
        defaultTo: 'Default To',
        searchButtonText: 'Search Button Text',
        searchingText: 'Searching Text',
        footerContent: 'Footer Content',
        brandName: 'Brand Name',
        policyLinks: 'Policy Links',
        popularDeals: 'Popular Deals',
        sectionTitle: 'Section Title',
        subtitle: 'Subtitle',
      },
    },
  },
  ixigo: {
    tenantId: 'ixigo',
    name: 'ixigo',
    theme: {
      primaryColor: '#e84c3d',
      secondaryColor: '#f39c12',
      borderRadius: 4,
      fontFamily: "'Roboto', sans-serif",
      darkTheme: false,
    },
    navigation: [
      { id: 'flight', label: '✈ Flights', enabled: true },
      { id: 'hotel', label: '🏨 Hotels', enabled: true },
      { id: 'holidays', label: '🌴 Holidays', enabled: false },
      { id: 'deals', label: '🏷 Offers', enabled: true },
    ],
    layout: ['navbar', 'hero', 'search', 'popular', 'footer'],
    blockConfigs: {
      navbar: { variant: 2, enabled: true },
      hero: { variant: 2, enabled: true },
      search: { variant: 2, enabled: true },
      popular: { variant: 1, enabled: true },
      footer: { variant: 1, enabled: true },
    },
    featureFlags: {
      showPromoApp: false,
      enableSearchAnalytics: true,
    },
    content: {
      hero: {
        headline: 'Compare & Save',
        subHeadline: 'Never overpay for your travel again.',
        cta: 'Find Trains/Flights',
      },
      resultsLabels: {
        flight: 'Flight Results',
        hotel: 'Hotel Results',
        deals: 'Package Results',
      },
      resultsFoundText: 'found',
    },
    navbar: {
      ctaLabel: 'Login',
      loginTitle: 'Login',
      loginButtonText: 'Login',
      loginDemoText: 'Demo mode — any input works',
      emailPlaceholder: 'Email or Phone',
      passwordPlaceholder: 'Password',
    },
    search: {
      defaultFrom: 'Mumbai (BOM)',
      defaultTo: 'Bangalore (BLR)',
      tripTypes: ['One Way', 'Round Trip'],
      searchButtonText: 'Search',
      searchingText: 'Finding...',
      travelers: ['1 Traveller', '2 Travellers', '3 Travellers', '4 Travellers', '5+ Travellers'],
      classes: ['Economy', 'Premium Economy', 'Business', 'First Class'],
      fieldLabels: {
        from: 'From',
        to: 'To',
        departure: 'Departure',
        returnDate: 'Return',
        travelers: 'Travelers',
        class: 'Class',
      },
      mockData: {
        flights: [
          { id: '1', code: 'AI-101', airline: 'Air India', dep: '06:00', arr: '08:30', duration: '2h 30m', stops: 'Non-stop', price: '₹4,500', tag: 'cheapest' },
          { id: '2', code: '6E-203', airline: 'IndiGo', dep: '09:15', arr: '11:45', duration: '2h 30m', stops: 'Non-stop', price: '₹5,200', tag: 'fast' },
          { id: '3', code: 'UK-811', airline: 'Vistara', dep: '14:00', arr: '16:45', duration: '2h 45m', stops: 'Non-stop', price: '₹6,800', tag: 'best' },
        ],
        hotels: [
          { id: '1', name: 'Grand Hyatt', stars: 5, rating: '4.5', location: 'BKC, Mumbai', price: '₹12,000/night', tag: 'Luxury' },
          { id: '2', name: 'Taj Palace', stars: 5, rating: '4.7', location: 'Colaba, Mumbai', price: '₹15,000/night', tag: 'Top Rated' },
          { id: '3', name: 'Novotel', stars: 4, rating: '4.2', location: 'Juhu, Mumbai', price: '₹6,500/night', tag: 'Value' },
        ],
        packages: [
          { id: '1', title: 'Goa Beach Getaway', nights: 3, includes: 'Flights + Hotel', price: '₹18,500', image: '' },
          { id: '2', title: 'Kerala Backwaters', nights: 4, includes: 'Hotel + Meals', price: '₹22,000', image: '' },
          { id: '3', title: 'Rajasthan Heritage Tour', nights: 5, includes: 'Flights + Hotel + Safari', price: '₹35,000', image: '' },
        ],
      },
    },
    popular: {
      title: 'Popular Routes',
      subtitle: 'Best deals curated for you.',
      bookNowText: 'Book Now',
      items: [
        { id: 1, title: 'Mumbai to Delhi', sub: 'From ₹3,200', icon: '✈️', type: 'flight' },
        { id: 2, title: 'Bangalore to Chennai', sub: 'From ₹1,800', icon: '✈️', type: 'flight' },
        { id: 3, title: 'Club Mahindra', sub: 'Holiday Packages', icon: '🏨', type: 'hotel' },
        { id: 4, title: 'Kerala Backwaters', sub: '3 Nights', icon: '🌴', type: 'deals' },
      ],
      dealDetails: {
        'Mumbai to Delhi': { description: 'Multiple daily flights between Mumbai and Delhi with convenient timings.', highlights: ['10+ daily flights', '2h duration', 'Flexible rebooking', 'Meal options'] },
        'Bangalore to Chennai': { description: 'Quick hop between Bangalore and Chennai. Perfect for business or weekend trips.', highlights: ['1h flight', 'Hourly departures', 'Budget options', 'Train also available'] },
        'Club Mahindra': { description: 'All-inclusive holiday packages at Club Mahindra resorts across India.', highlights: ['All-inclusive', 'Kids activities', 'Multiple locations', 'Member discounts'] },
        'Kerala Backwaters': { description: 'Cruise through the serene backwaters of Kerala on a traditional houseboat.', highlights: ['Houseboat stay', 'Kerala cuisine', 'Ayurveda spa', 'Village tours'] },
      },
    },
    footer: {
      copyrightText: 'White-Label Travel. All rights reserved.',
      policies: {
        'Privacy Policy': 'ixigo values your privacy. We collect only essential data to provide travel comparison services. Your data is never sold to third parties.',
        'Terms of Service': 'By using ixigo, you agree to our fare comparison terms. Prices shown are indicative and subject to change at the time of booking.',
        'Cookie Policy': 'We use cookies and similar technologies to track fare trends and personalize your experience. Manage preferences in your browser settings.',
      },
    },
    editor: {
      editSiteText: 'Edit Site',
      exitEditorText: 'Exit Editor',
      saveButtonText: 'Save & Publish',
      savingText: 'Saving...',
      resetButtonText: 'Reset to Defaults',
      resetConfirmText: 'Reset this tenant to original defaults?',
      sectionLabels: { navbar: 'Navigation Bar', hero: 'Hero Promo', search: 'Search Widget', popular: 'Popular Deals', footer: 'Footer Area' },
      colorOverrides: ['#e040fb', '#00c896', '#6c7ae0', '#ffb300', '#f44336'],
      formLabels: {
        siteEditor: 'Site Editor',
        buildingFor: 'Building for',
        selectBlock: 'Select Block to Customize',
        blockProperties: 'Block Properties',
        clickBlockHint: 'Click a block on the left to start customizing.',
        customize: 'Customize',
        layoutVariant: 'Layout Variant',
        colorOverride: 'Color Override',
        clear: 'Clear',
        visibility: 'Visibility',
        enableBlock: 'Enable this block',
        navigationTabs: 'Navigation Tabs',
        ctaButton: 'CTA Button',
        heroContent: 'Hero Content',
        headline: 'Headline',
        subHeadline: 'Sub-headline',
        ctaButtonText: 'CTA Button Text',
        searchConfig: 'Search Config',
        defaultFrom: 'Default From',
        defaultTo: 'Default To',
        searchButtonText: 'Search Button Text',
        searchingText: 'Searching Text',
        footerContent: 'Footer Content',
        brandName: 'Brand Name',
        policyLinks: 'Policy Links',
        popularDeals: 'Popular Deals',
        sectionTitle: 'Section Title',
        subtitle: 'Subtitle',
      },
    },
  },
  skyscanner: {
    tenantId: 'skyscanner',
    name: 'Skyscanner',
    theme: {
      primaryColor: '#0770e3',
      secondaryColor: '#00d69b',
      borderRadius: 24,
      fontFamily: "'Outfit', sans-serif",
      darkTheme: true,
    },
    navigation: [
      { id: 'flight', label: '✈ Search Everywhere', enabled: true },
      { id: 'hotel', label: '🏨 Stays', enabled: true },
      { id: 'holidays', label: '🌴 Car Hire', enabled: false },
      { id: 'deals', label: '🏷 Rewards', enabled: false },
    ],
    layout: ['navbar', 'hero', 'search', 'popular', 'footer'],
    blockConfigs: {
      navbar: { variant: 3, enabled: true },
      hero: { variant: 3, enabled: true },
      search: { variant: 1, enabled: true },
      popular: { variant: 2, enabled: true },
      footer: { variant: 1, enabled: true },
    },
    featureFlags: {
      showPromoApp: true,
      enableSearchAnalytics: false,
    },
    content: {
      hero: {
        headline: 'The world is yours',
        subHeadline: 'Explore millions of flights and hotels.',
        cta: 'Explore All',
      },
      resultsLabels: {
        flight: 'Flight Results',
        hotel: 'Hotel Results',
        deals: 'Package Results',
      },
      resultsFoundText: 'found',
    },
    navbar: {
      ctaLabel: 'Sign in',
      loginTitle: 'Sign in',
      loginButtonText: 'Sign in',
      loginDemoText: 'Demo mode — any input works',
      emailPlaceholder: 'Email or Phone',
      passwordPlaceholder: 'Password',
    },
    search: {
      defaultFrom: 'London (LHR)',
      defaultTo: 'Paris (CDG)',
      tripTypes: ['One Way', 'Return'],
      searchButtonText: 'Find Flights',
      searchingText: 'Searching...',
      travelers: ['1 Adult', '2 Adults', '3 Adults', '4 Adults', '5+ Adults'],
      classes: ['Economy', 'Premium Economy', 'Business', 'First'],
      fieldLabels: { from: 'From', to: 'To', departure: 'Departure', returnDate: 'Return', travelers: 'Travelers', class: 'Class' },
      mockData: {
        flights: [
          { id: '1', code: 'BA-117', airline: 'British Airways', dep: '08:00', arr: '10:30', duration: '2h 30m', stops: 'Non-stop', price: '$320', tag: 'cheapest' },
          { id: '2', code: 'AF-1083', airline: 'Air France', dep: '11:15', arr: '13:40', duration: '2h 25m', stops: 'Non-stop', price: '$410', tag: 'fast' },
          { id: '3', code: 'EZY-2541', airline: 'easyJet', dep: '16:00', arr: '18:35', duration: '2h 35m', stops: 'Non-stop', price: '$280', tag: 'best' },
        ],
        hotels: [
          { id: '1', name: 'Hilton Paris', stars: 5, rating: '4.6', location: 'Champs-Élysées, Paris', price: '$280/night', tag: 'Luxury' },
          { id: '2', name: 'Marriott Rive Gauche', stars: 4, rating: '4.3', location: 'Latin Quarter, Paris', price: '$195/night', tag: 'Top Rated' },
          { id: '3', name: 'Ibis Styles', stars: 3, rating: '4.0', location: 'Gare du Nord, Paris', price: '$95/night', tag: 'Value' },
        ],
        packages: [
          { id: '1', title: 'Paris Romance Package', nights: 4, includes: 'Flights + Hotel', price: '$1,200', image: '' },
          { id: '2', title: 'London-Paris Combo', nights: 5, includes: 'Flights + Hotel + Rail', price: '$1,580', image: '' },
          { id: '3', title: 'European City Break', nights: 3, includes: 'Hotel + Breakfast', price: '$650', image: '' },
        ],
      },
    },
    popular: {
      title: 'Trending destinations',
      subtitle: 'Discover amazing places.',
      bookNowText: 'Book Now',
      items: [
        { id: 1, title: 'New York to Tokyo', sub: 'From $450', icon: '✈️', type: 'flight' },
        { id: 2, title: 'Dubai Stay', sub: 'Luxury Hotels', icon: '🏨', type: 'hotel' },
        { id: 3, title: 'Bali Packages', sub: '5 Nights', icon: '🌴', type: 'deals' },
        { id: 4, title: 'Europe Tour', sub: '10 Days', icon: '🎯', type: 'deals' },
      ],
      dealDetails: {
        'New York to Tokyo': { description: 'Fly from NYC to Tokyo with multiple airlines. Experience the best of Japan.', highlights: ['14h direct flight', 'ANA & JAL available', 'Japanese meals', 'Entertainment'] },
        'Dubai Stay': { description: 'Stay at the finest hotels in Dubai with views of Burj Khalifa and the Palm.', highlights: ['5-star hotels', 'Pool & beach', 'City views', 'Shopping nearby'] },
        'Bali Packages': { description: 'All-inclusive Bali packages with flights, hotel, and activities.', highlights: ['Flights included', 'Beach villa', 'Temple tours', 'Surfing lessons'] },
        'Europe Tour': { description: 'Multi-city Europe tour covering Paris, Rome, Barcelona, and Amsterdam.', highlights: ['4 countries', 'Guided tours', '4-star hotels', 'Rail passes'] },
      },
    },
    footer: {
      copyrightText: 'White-Label Travel. All rights reserved.',
      policies: {
        'Privacy Policy': 'Skyscanner is committed to protecting your privacy. We only collect data necessary to provide our comparison service and never share it without your explicit consent.',
        'Terms of Service': 'By using Skyscanner, you agree to our travel comparison terms. We are a search engine and do not sell tickets directly. All bookings are with the provider.',
        'Cookie Policy': 'We use cookies to remember your preferences, track price changes, and improve your experience. You can disable non-essential cookies in your browser settings.',
      },
    },
    editor: {
      editSiteText: 'Edit Site',
      exitEditorText: 'Exit Editor',
      saveButtonText: 'Save & Publish',
      savingText: 'Saving...',
      resetButtonText: 'Reset to Defaults',
      resetConfirmText: 'Reset this tenant to original defaults?',
      sectionLabels: { navbar: 'Navigation Bar', hero: 'Hero Promo', search: 'Search Widget', popular: 'Popular Deals', footer: 'Footer Area' },
      colorOverrides: ['#e040fb', '#00c896', '#6c7ae0', '#ffb300', '#f44336'],
      formLabels: {
        siteEditor: 'Site Editor',
        buildingFor: 'Building for',
        selectBlock: 'Select Block to Customize',
        blockProperties: 'Block Properties',
        clickBlockHint: 'Click a block on the left to start customizing.',
        customize: 'Customize',
        layoutVariant: 'Layout Variant',
        colorOverride: 'Color Override',
        clear: 'Clear',
        visibility: 'Visibility',
        enableBlock: 'Enable this block',
        navigationTabs: 'Navigation Tabs',
        ctaButton: 'CTA Button',
        heroContent: 'Hero Content',
        headline: 'Headline',
        subHeadline: 'Sub-headline',
        ctaButtonText: 'CTA Button Text',
        searchConfig: 'Search Config',
        defaultFrom: 'Default From',
        defaultTo: 'Default To',
        searchButtonText: 'Search Button Text',
        searchingText: 'Searching Text',
        footerContent: 'Footer Content',
        brandName: 'Brand Name',
        policyLinks: 'Policy Links',
        popularDeals: 'Popular Deals',
        sectionTitle: 'Section Title',
        subtitle: 'Subtitle',
      },
    },
  },
};
