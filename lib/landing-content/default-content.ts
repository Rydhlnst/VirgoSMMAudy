import type { LandingPageContent } from "./types";

export const DEFAULT_LANDING_PAGE_CONTENT: LandingPageContent = {
  navbar: {
    brandName: "Virgo Social Services",
    menu: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Contact", href: "/contact" },
    ],
    ctaText: "Let's Talk",
    ctaLink: "/contact",
  },

  hero: {
    badge: "VIRTUAL ASSISTANT & DIGITAL SUPPORT",
    title: "Virtual Assistance, Social Media, and Creative Support",
    description:
      "Virgo Social Services helps businesses stay organized, consistent, and supported through administrative assistance, creative support, social media help, and flexible digital services.",
    imageUrl:
      "https://images.unsplash.com/photo-1520975958225-7cc45f0f53d5?auto=format&fit=crop&w=1400&q=80",
    ctaText: "Book a Call",
    ctaLink: "/contact",
    tags: [
      "Social Media",
      "Creative Support",
      "Virtual Assistance",
    ],
  },

  brandStrip: {
    items: [
      { name: "Small Businesses", link: "" },
      { name: "Founder-Led Brands", link: "" },
      { name: "Creators & Personal Brands", link: "" },
      { name: "E-Commerce Brands", link: "" },
      { name: "Wellness Businesses", link: "" },
    ],
  },

  introduction: {
    title: "INTRODUCTION",
    description:
      "Virgo Social Services provides reliable virtual assistance for business owners who need support with daily operations, content tasks, customer communication, and digital organization.",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80",
    badgeText: "Available for support",
  },

  about: {
    title: "ABOUT",
    label: "What we do",
    description:
      "We help businesses save time and stay consistent by handling administrative tasks, inbox and calendar management, social media support, Canva designs, customer service, content planning, and workflow organization.",
    images: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1520975869018-84f4c535d2d3?auto=format&fit=crop&w=900&q=80",
        alt: "Administrative support",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1520975744055-1f7e1f39a3d2?auto=format&fit=crop&w=900&q=80",
        alt: "Content planning",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1520975682035-9f2d9965e5a2?auto=format&fit=crop&w=900&q=80",
        alt: "Creative support",
      },
    ],
  },

  portfolio: {
    title: "PORTFOLIO",
    items: [
      {
        type: "photo",
        title: "Administrative Workflow Support",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1520975868797-07dd1a3b2a6b?auto=format&fit=crop&w=1200&q=80",
        link: "",
        caption:
          "Inbox, calendar, files, and task organization for smoother business operations.",
      },
      {
        type: "photo",
        title: "Social Media Content Support",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1520975779488-2b0b8b0e1c4a?auto=format&fit=crop&w=1200&q=80",
        link: "",
        caption:
          "Content scheduling, captions, Canva graphics, and platform support.",
      },
      {
        type: "photo",
        title: "Creative Business Assets",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=80",
        link: "",
        caption:
          "Branded templates, marketing materials, and digital design support.",
      },
    ],
  },

  portfolioDetails: {
    projects: [
      {
        title: "Administrative Workflow Support",
        client: "Small Business Owner",
        brief:
          "The client needed help managing daily admin tasks, emails, scheduling, and file organization.",
        approach: [
          "Organized inbox and calendar flow",
          "Created a simple file management structure",
          "Supported customer communication and daily admin tasks",
        ],
        deliverables: [
          "Inbox management",
          "Calendar organization",
          "File organization",
          "Customer support assistance",
        ],
        result:
          "More organized daily operations, faster response time, and less administrative overload.",
      },
      {
        title: "Social Media Content Support",
        client: "Growing Brand",
        brief:
          "The client needed consistent social media help without hiring a full-time team.",
        approach: [
          "Planned a weekly content calendar",
          "Prepared Canva graphics and basic captions",
          "Scheduled posts and supported platform management",
        ],
        deliverables: [
          "Content calendar",
          "Canva graphics",
          "Caption support",
          "Scheduling assistance",
        ],
        result:
          "More consistent posting, clearer brand presence, and better content organization.",
      },
      {
        title: "Creative Business Assets",
        client: "Creator / Service Business",
        brief:
          "The client needed flexible creative support for marketing materials, digital products, and social media visuals.",
        approach: [
          "Built reusable brand templates",
          "Prepared marketing design assets",
          "Supported content and creative production tasks",
        ],
        deliverables: [
          "Brand templates",
          "Marketing materials",
          "Digital product design support",
          "Creative task assistance",
        ],
        result:
          "Faster content production, more consistent visuals, and reusable creative assets.",
      },
    ],
  },

  services: {
    title: "SERVICES & PACKAGES",
    subtitle: "FLEXIBLE SUPPORT FOR YOUR BUSINESS",
    viewAllText: "View all services",
    viewAllLink: "/services",
    items: [
      {
        title: "Starter Support",
        name: "10 Hours per Week",
        description:
          "Perfect for businesses needing light ongoing support with admin tasks, communication, scheduling, and basic social media assistance.",
        price: "Custom pricing",
        hoursPerWeek: "10 hrs/week",
        includes: [
          "Administrative tasks",
          "Email management",
          "Scheduling",
          "Basic social media assistance",
          "Canva support",
          "Customer communication",
        ],
        idealFor: "Small businesses, solo entrepreneurs, and creators.",
        imageUrl: "",
        buttonText: "Book a Call",
        buttonLink: "/contact",
        isHighlighted: false,
      },
      {
        title: "Growth Support",
        name: "20 Hours per Week",
        description:
          "For businesses needing more consistent digital and operational support across admin, content, customer service, and reporting.",
        price: "Custom pricing",
        hoursPerWeek: "20 hrs/week",
        includes: [
          "Administrative support",
          "Content scheduling",
          "Social media assistance",
          "Graphic design support",
          "Customer support",
          "Organization systems",
          "Research & reporting",
        ],
        idealFor: "Growing brands and busy business owners.",
        imageUrl: "",
        buttonText: "Book a Call",
        buttonLink: "/contact",
        isHighlighted: true,
      },
      {
        title: "Full Support",
        name: "40 Hours per Week",
        description:
          "Comprehensive virtual assistance and digital support for businesses that need regular, hands-on help.",
        price: "Custom pricing",
        hoursPerWeek: "40 hrs/week",
        includes: [
          "Priority support",
          "Ongoing admin management",
          "Social media support",
          "Creative assistance",
          "Business organization",
          "Workflow support",
          "Flexible task management",
        ],
        idealFor: "Businesses needing regular, hands-on support.",
        imageUrl: "",
        buttonText: "Book a Call",
        buttonLink: "/contact",
        isHighlighted: false,
      },
      {
        title: "Custom Support",
        name: "Tailored Business Support",
        description:
          "Flexible support based on your business needs, project scope, preferred hours, and specialized task requests.",
        price: "Let's talk",
        hoursPerWeek: "Flexible hours",
        includes: [
          "Project-based work",
          "Flexible hours",
          "Specialized support",
          "Mixed service requests",
        ],
        idealFor: "Businesses with unique or changing support needs.",
        imageUrl: "",
        buttonText: "Book a Call",
        buttonLink: "/contact",
        isHighlighted: false,
      },
    ],
  },

  servicesDetails: {
    name: "Virgo Social Services",
    intro:
      "Choose the support category your business needs most, or combine multiple services into a flexible custom plan.",
    categories: [
      {
        slug: "administrative-support",
        title: "Administrative Support",
        description:
          "Daily business support to help you stay organized, responsive, and focused on higher-value work.",
        heroImageUrl: "",
        bullets: [
          "Email & inbox management",
          "Calendar management & appointment scheduling",
          "Data entry & database management",
          "Customer service support",
          "Document preparation & formatting",
          "Travel planning & bookings",
          "File organization & cloud management",
          "CRM updates & organization",
          "General business assistance",
        ],
      },
      {
        slug: "creative-support",
        title: "Creative Support",
        description:
          "Creative assistance for visual content, branded materials, digital products, and production tasks.",
        heroImageUrl: "",
        bullets: [
          "Canva graphic design",
          "Brand template creation",
          "Marketing materials",
          "Digital product design",
          "Video editing",
          "Content planning",
          "Photography/Videography",
        ],
      },
      {
        slug: "social-media-support",
        title: "Social Media Support",
        description:
          "Platform support to help your business stay consistent, visible, and organized across social media.",
        heroImageUrl: "",
        bullets: [
          "Social media management",
          "Content scheduling",
          "Caption writing",
          "Hashtag research",
          "Community engagement",
          "Content calendar planning",
          "Meta Ads",
          "Instagram support",
          "TikTok support",
          "Facebook page management",
          "LinkedIn content support",
        ],
      },
    ],
    industries: [
      {
        slug: "real-estate",
        title: "Real Estate Support",
        description:
          "Administrative, content, and communication support for real estate professionals, agencies, and property-related businesses.",
        heroImageUrl: "",
        bullets: [
          "Listing support",
          "Client communication",
          "Calendar coordination",
          "Social media content assistance",
        ],
      },
      {
        slug: "spiritual-wellness",
        title: "Spiritual & Wellness Business Support",
        description:
          "Gentle, organized, and brand-aligned support for wellness practitioners, coaches, and holistic businesses.",
        heroImageUrl: "",
        bullets: [
          "Appointment scheduling",
          "Client communication",
          "Content planning",
          "Canva design support",
        ],
      },
      {
        slug: "creator-influencer",
        title: "Creator & Influencer Support",
        description:
          "Flexible digital support for creators who need help staying consistent, organized, and visible.",
        heroImageUrl: "",
        bullets: [
          "Content calendar planning",
          "Caption support",
          "Brand collaboration organization",
          "Community engagement support",
        ],
      },
      {
        slug: "small-business",
        title: "Small Business Support",
        description:
          "Reliable operational and digital assistance for small businesses managing many tasks with limited time.",
        heroImageUrl: "",
        bullets: [
          "Inbox and calendar support",
          "Customer service assistance",
          "Admin organization",
          "Basic social media support",
        ],
      },
      {
        slug: "ecommerce",
        title: "E-Commerce Support",
        description:
          "Operational and creative support for online stores that need help with customers, content, and organization.",
        heroImageUrl: "",
        bullets: [
          "Customer support",
          "Product content assistance",
          "Social media support",
          "Order and admin organization",
        ],
      },
    ],
  },

  testimonials: {
    title: "TESTIMONIALS",
    description:
      "Reliable support, smoother systems, and more time back for business owners.",
    items: [
      {
        name: "Nadya",
        role: "Founder, Wellness Brand",
        quote:
          "Virgo Social Services helped us stay organized and consistent. Our admin, content, and customer communication became much easier to manage.",
        workTitle: "Wellness Business Support",
        description:
          "Inbox support, scheduling, Canva graphics, and content calendar assistance.",
        workImageUrl:
          "https://images.unsplash.com/photo-1520975594141-1b1b4c8f3f12?auto=format&fit=crop&w=1200&q=80",
        imageUrl:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Rama",
        role: "Small Business Owner",
        quote:
          "The support was flexible, clear, and easy to work with. It helped me focus on running the business instead of getting stuck in daily tasks.",
        workTitle: "Administrative & Social Media Support",
        description:
          "Email management, customer communication, content scheduling, and business organization.",
        workImageUrl:
          "https://images.unsplash.com/photo-1520975797658-19d4b8d7fcb2?auto=format&fit=crop&w=1200&q=80",
        imageUrl:
          "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  branding: {
    title: "ORGANIZED SUPPORT FOR GROWING BUSINESSES",
    description:
      "From scattered tasks to a cleaner workflow: organized admin, consistent content, and smoother customer communication.",
    beforeImageUrl:
      "https://images.unsplash.com/photo-1520975594141-1b1b4c8f3f12?auto=format&fit=crop&w=1200&q=80",
    afterImageUrl:
      "https://images.unsplash.com/photo-1520975594141-1b1b4c8f3f12?auto=format&fit=crop&w=1200&q=80",
    beforeLabel: "Before support",
    afterLabel: "After support",
  },

  workProcess: {
    title: "HOW WE WORK",
    steps: [
      {
        number: "01",
        title: "Discovery & Needs Review",
        description:
          "We review your current tasks, business needs, support gaps, and preferred way of working.",
        icon: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      },
      {
        number: "02",
        title: "Support Plan Setup",
        description:
          "We define your weekly hours, priority tasks, communication flow, and systems to manage the work clearly.",
        icon: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80",
      },
      {
        number: "03",
        title: "Execution & Coordination",
        description:
          "We help with admin, content, customer communication, creative tasks, and business organization based on your plan.",
        icon: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
      },
      {
        number: "04",
        title: "Review & Improve",
        description:
          "We review what is working, improve the process, and adjust support based on your business priorities.",
        icon: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },

  contact: {
    title: "LET'S SIMPLIFY YOUR BUSINESS SUPPORT",
    description:
      "Tell us what tasks are taking too much of your time. We’ll help you choose the right support plan for your business.",
    whatsappText: "Chat on WhatsApp",
    whatsappLink: "https://wa.me/",
    email: "",
    socialLinks: [
      { platform: "Instagram", url: "" },
      { platform: "TikTok", url: "" },
      { platform: "LinkedIn", url: "" },
    ],
  },

  footer: {
    brandName: "Virgo Social Services",
    description:
      "Virtual assistance, creative support, and social media help for growing businesses.",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Contact", href: "/contact" },
    ],
    socialLinks: [
      { platform: "Instagram", url: "" },
      { platform: "TikTok", url: "" },
      { platform: "LinkedIn", url: "" },
    ],
    copyrightText: "© {year} Virgo Social Services. All rights reserved.",
  },

pages: {
  about: {
    badge: "ABOUT",
    profileLabel: "PROFILE",
    storyLabel: "STORY",
    notesLabel: "NOTES",
    notesText:
      "Virgo Social Services provides virtual assistance, administrative support, creative help, and social media support for businesses that need smoother daily operations.",
    processLabel: "PROCESS",
    processTitle: "How we support your business",
    focusLabel: "FOCUS",
    focusText:
      "Administrative organization, customer communication, content support, Canva design, social media assistance, and flexible task management.",
    availabilityLabel: "AVAILABILITY",
    availabilityText:
      "Available for weekly support packages, project-based work, and custom business support plans.",
    contactCtaText: "Contact",
    servicesCtaText: "Services",
  },

  contact: {
    badge: "CONTACT",
    fastestLabel: "FASTEST",
    fastestText:
      "Chat via WhatsApp. Share what kind of support you need, your weekly workload, and your preferred timeline.",
    contactOptionsLabel: "CONTACT OPTIONS",
    emailLabel: "EMAIL",
    emailCtaText: "Send email",
    socialLabel: "SOCIAL",
    noSocialText: "No social links yet.",
    requiredInfoLabel: "WHAT WE NEED",
    requiredInfoItems: [
      "Your business type and current support needs",
      "The tasks you want help with",
      "Preferred weekly hours or package",
      "Timeline and priority level",
      "Any tools or platforms you already use",
    ],
    previewLabel: "PREVIEW",
    previewText:
      "Tell us what is taking too much of your time. We will help you choose the right support plan.",
  },

  portfolio: {
    badge: "PORTFOLIO",
    introText:
      "Selected examples of administrative support, social media assistance, creative business assets, and workflow organization for growing businesses.",
    statsProjectsLabel: "Projects",
    statsVideosLabel: "Videos",
    statsPhotosLabel: "Photos",
    gridLabel: "GRID",
    gridTitle: "Selected work",
    workTogetherCtaText: "Work together",
    openLinkText: "Open",
    noLinkText: "No link",
    detailLabel: "DETAILS",
    detailTitle: "Client need → support provided → outcome",
    cmsHintText: "Editable via CMS",
    clientFallbackLabel: "Client",
    briefPillText: "Brief",
    resultPillText: "Result",
    approachLabel: "Approach",
    deliverablesLabel: "Deliverables",
    resultLabel: "Result",
  },

  services: {
    badge: "SERVICES",
    howToChooseLabel: "HOW TO CHOOSE",
    howToChooseText:
      "Start by choosing the weekly support package that matches your workload, then add specific services based on your business needs.",
    checkAvailabilityCtaText: "Check availability",
    coreServicesLabel: "CORE SERVICES",
    coreServicesTitle: "Choose your support level",
    coreServicesText:
      "From light weekly support to full hands-on virtual assistance, choose the level that fits your business operations.",
    industriesLabel: "INDUSTRIES",
    industriesTitle: "Industry-specific support",
    industriesText:
      "Flexible support tailored for real estate, wellness, creators, small businesses, and e-commerce brands.",
    cardPointsText: "{count} points",
    cardDetailText: "Details",
    detailBackText: "Back to services",
    detailMediaLabel: "MEDIA",
    detailMediaText:
      "Placeholder media for now. Replace this with real brand assets, client work, or service visuals later.",
    detailIncludesLabel: "INCLUDES",
    detailCtaText: "Check availability",
    groupCoreLabel: "Core services",
    groupIndustryLabel: "Industries",
  },
},
};