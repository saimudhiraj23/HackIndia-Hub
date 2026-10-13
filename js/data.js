/**
 * HACKINDIA HUB - DATA STORE & INITIAL DATABASE
 * Rich, realistic hackathons data across India with verified sources,
 * tracks, timelines, prize distributions, and problem statements.
 */

let HACKATHONS_DATA = [
  {
    id: "hack-01",
    slug: "ai-innovation-challenge-hyderabad-2026",
    title: "AI Innovation Challenge 2026",
    organizer: "IIT Hyderabad & T-Hub Telangana",
    organizerType: "University & Government Incubator",
    organizerInitials: "IITH",
    bannerImg: "assets/ai_banner.jpg",
    mode: "Hybrid",
    city: "Hyderabad",
    state: "Telangana",
    venueAddress: "IIT Hyderabad Campus, Kandi, Sangareddy & T-Hub Phase 2, Raidurg, Hyderabad",
    startDate: "2026-10-24",
    endDate: "2026-10-26",
    registrationDeadline: "2026-10-18T23:59:59+05:30",
    prizePool: 500000,
    prizePoolDisplay: "₹5,00,000",
    teamSizeMin: 2,
    teamSizeMax: 4,
    teamSizeDisplay: "2–4 Members",
    eligibility: "College Students (B.Tech, MCA, BCA & M.Tech)",
    difficulty: "Intermediate",
    technologies: ["AI/ML", "Generative AI", "Python", "PyTorch", "Cloud"],
    themes: ["Artificial Intelligence", "Healthcare AI", "Smart Agriculture"],
    participantCount: 3840,
    verified: true,
    verificationSource: "Official IIT Hyderabad Academic Portal (iith.ac.in)",
    sourceUrl: "https://iith.ac.in/events/ai-innovation-2026",
    registrationUrl: "https://t-hub.co/events/hackindia-ai-challenge",
    shortDescription: "Build transformative Generative AI and Machine Learning solutions addressing national challenges in agriculture, healthcare, and vernacular languages.",
    fullDescription: "AI Innovation Challenge 2026 is co-hosted by the Department of Artificial Intelligence at IIT Hyderabad and T-Hub. Over 48 intense hours, participants will work closely with research scientists, AWS cloud architects, and venture capital mentors to develop functional prototypes using advanced foundation models, computer vision, and neural reasoning.",
    tracks: [
      { name: "Vernacular AI for Bharat", description: "Build LLM applications and voice agents for rural Indian languages and dialects." },
      { name: "Predictive Agritech", description: "Satellite imagery, weather telemetry, and crop disease detection for Indian farmers." },
      { name: "Diagnostic Healthcare AI", description: "Early detection models for diabetic retinopathy and tuberculosis from medical scans." },
      { name: "Open Innovation", description: "Novel breakthroughs leveraging open-source foundation models and edge devices." }
    ],
    prizeBreakdown: [
      { rank: "Grand Champion (1st Place)", amount: "₹2,50,000", perks: "T-Hub Incubation Support + $10k Cloud Credits" },
      { rank: "1st Runner Up (2nd Place)", amount: "₹1,50,000", perks: "Fast-track Summer Internship Interviews" },
      { rank: "2nd Runner Up (3rd Place)", amount: "₹75,000", perks: "Hardware developer kits" },
      { rank: "Best All-Women Team", amount: "₹25,000", perks: "Special Innovation Trophy & Mentorship" }
    ],
    timeline: [
      { date: "Oct 18, 2026", phase: "Registration Closes", desc: "Team registrations & preliminary PPT/abstract submission deadline" },
      { date: "Oct 20, 2026", phase: "Shortlist Announcement", desc: "Top 60 teams invited for the hybrid hackathon" },
      { date: "Oct 24, 2026", phase: "Hackathon Kickoff (Online/Offline)", desc: "Problem statement unveiling & mentorship rounds" },
      { date: "Oct 26, 2026", phase: "Grand Finale & Demo Day", desc: "Live jury presentations at IIT Hyderabad auditorium" }
    ],
    judgingCriteria: [
      { criterion: "Technical Depth & Architecture", weight: "30%" },
      { criterion: "Innovation & Originality", weight: "30%" },
      { criterion: "Real-world Practical Impact", weight: "25%" },
      { criterion: "UI/UX & Pitch Quality", weight: "15%" }
    ],
    faqs: [
      { q: "Is travel and accommodation provided?", a: "Shortlisted finalists attending the offline round at IIT Hyderabad will be provided dormitory accommodation and food coupons." },
      { q: "Can 1st year engineering students join?", a: "Yes! There is a special beginner-friendly track with dedicated student mentors." },
      { q: "What should we submit in round 1?", a: "A 3-slide pitch deck or 2-page PDF explaining problem statement, proposed architecture, and tech stack." }
    ]
  },

  {
    id: "hack-02",
    slug: "ethindia-bengaluru-web3-hackathon-2026",
    title: "ETHIndia Bengaluru 2026",
    organizer: "Devfolio & Ethereum India Foundation",
    organizerType: "Developer Ecosystem & Global Protocol",
    organizerInitials: "ETH",
    bannerImg: "assets/hero_banner.jpg",
    mode: "Offline",
    city: "Bengaluru",
    state: "Karnataka",
    venueAddress: "KTPO Convention Centre, Whitefield, Bengaluru, Karnataka",
    startDate: "2026-11-06",
    endDate: "2026-11-08",
    registrationDeadline: "2026-10-25T23:59:59+05:30",
    prizePool: 2500000,
    prizePoolDisplay: "₹25,00,000+",
    teamSizeMin: 1,
    teamSizeMax: 4,
    teamSizeDisplay: "1–4 Members",
    eligibility: "Open to Everyone (College & Professionals)",
    difficulty: "Advanced",
    technologies: ["Blockchain", "Web3", "Solidity", "Zero-Knowledge", "Ethereum", "Rust"],
    themes: ["Web3 & Decentralization", "DeFi", "Public Goods", "Zero Knowledge Proofs"],
    participantCount: 5200,
    verified: true,
    verificationSource: "Devfolio Verified Official Hackathon",
    sourceUrl: "https://ethindia.co",
    registrationUrl: "https://ethindia2026.devfolio.co",
    shortDescription: "Asia's premier Ethereum hackathon bringing together over 2,000 builders, core researchers, and founders for a 36-hour weekend sprint in Bengaluru.",
    fullDescription: "ETHIndia returns to Bengaluru for its biggest chapter yet. Build next-generation decentralized applications, account abstraction tooling, zero-knowledge proofs, and public goods. Features over 50 bounty sponsors including Polygon, Arbitrum, Base, and ENS with massive dedicated track rewards.",
    tracks: [
      { name: "Scalability & Layer-2 Tooling", description: "Infrastructure, rollups, and interoperability tools for mass crypto adoption." },
      { name: "Privacy & Zero Knowledge", description: "ZK-SNARK proofs, anonymous identity, and privacy-preserving verifications." },
      { name: "Decentralized Finance (DeFi)", description: "Lending protocols, automated liquidity, and next-gen stablecoins." },
      { name: "Public Goods & DAOs", description: "Open governance, quadratic funding, and student community builder tooling." }
    ],
    prizeBreakdown: [
      { rank: "ETHIndia Grand Pool", amount: "₹10,00,000", perks: "Main hackathon top 3 placements" },
      { rank: "Protocol Bounties (Polygon / Arbitrum / Base)", amount: "₹12,00,000", perks: "Individual sponsor bounties up to $2,000 each" },
      { rank: "Best Student Project", amount: "₹3,00,000", perks: "Fellowship grants and accelerator fast-track" }
    ],
    timeline: [
      { date: "Oct 25, 2026", phase: "Application Deadline", desc: "Submit builder profile, GitHub, and previous projects" },
      { date: "Nov 01, 2026", phase: "Acceptance Waves", desc: "Invites & RSVP confirmation sent" },
      { date: "Nov 06, 2026", phase: "Check-in & Opening Ceremony", desc: "Doors open at KTPO Whitefield at 4:00 PM" },
      { date: "Nov 08, 2026", phase: "Project Demos & Closing Ceremony", desc: "Live onstage demos and winners announcement" }
    ],
    judgingCriteria: [
      { criterion: "Smart Contract Security & Elegance", weight: "35%" },
      { criterion: "Novelty & Ecosystem Impact", weight: "30%" },
      { criterion: "Working Prototype Completeness", weight: "25%" },
      { criterion: "User Experience & Frontend", weight: "10%" }
    ],
    faqs: [
      { q: "Is participation free?", a: "Yes, 100% free! Devfolio provides free meals, snacks, swag, and 24/7 hacking space." },
      { q: "Can I participate alone?", a: "Yes, solo builders are welcome, but teams of 2 to 4 are encouraged." }
    ]
  },

  {
    id: "hack-03",
    slug: "smart-india-hackathon-2026-software",
    title: "Smart India Hackathon (SIH) 2026",
    organizer: "Ministry of Education's Innovation Cell & AICTE",
    organizerType: "Government of India",
    organizerInitials: "GOI",
    bannerImg: "assets/hero_banner.jpg",
    mode: "Offline",
    city: "New Delhi",
    state: "Delhi",
    venueAddress: "Multiple Nodal Centers Across India (Finale Nodal Centers: Delhi, Pune, Chennai, Jaipur)",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
    registrationDeadline: "2026-10-15T23:59:59+05:30",
    prizePool: 10000000,
    prizePoolDisplay: "₹1,00,00,000",
    teamSizeMin: 6,
    teamSizeMax: 6,
    teamSizeDisplay: "Strictly 6 Members (Min 1 Female Member)",
    eligibility: "College Students (All AICTE / UGC Approved Colleges)",
    difficulty: "Intermediate",
    technologies: ["Web Development", "AI/ML", "Cloud", "Cybersecurity", "IoT", "Mobile Apps"],
    themes: ["Smart Governance", "Clean Energy", "Heritage & Culture", "Disaster Management", "Smart Education"],
    participantCount: 75000,
    verified: true,
    verificationSource: "Official Government Portal (sih.gov.in)",
    sourceUrl: "https://sih.gov.in",
    registrationUrl: "https://sih.gov.in/college-spoc-login",
    shortDescription: "The world's biggest open innovation hackathon organized by AICTE and Ministry of Education to solve problems posed by 50+ Central Ministries and State Departments.",
    fullDescription: "Smart India Hackathon 2026 brings nationwide college teams together to solve real governance, surveillance, logistics, and healthcare bottlenecks. Selected teams travel to designated Nodal Centers across India for a non-stop 36-hour physical hackathon evaluated directly by Ministry Joint Secretaries.",
    tracks: [
      { name: "Smart Automation & Governance", description: "Automating citizen service workflows for Ministry of Electronics and IT." },
      { name: "Disaster Preparedness & Relief", description: "Real-time flood mapping and relief coordination for NDMA." },
      { name: "Cyber Crime Detection", description: "Phishing prevention and darknet monitoring for Indian Cyber Crime Coordination Centre (I4C)." },
      { name: "Agriculture & Rural Tech", description: "Direct-to-farmer mandi price intelligence and soil health AI." }
    ],
    prizeBreakdown: [
      { rank: "First Prize per Problem Statement", amount: "₹1,00,000", perks: "Over 100 problem statements = ₹1 Crore cumulative awards" },
      { rank: "Startup Incubation Grant", amount: "₹10,00,000", perks: "Seed grant from Ministry for top 10 implementable solutions" }
    ],
    timeline: [
      { date: "Oct 15, 2026", phase: "Internal College Hackathon", desc: "Colleges shortlist top 5 teams via internal SPOC" },
      { date: "Oct 28, 2026", phase: "National Idea Shortlist", desc: "Central Ministry evaluation of submitted PPTs" },
      { date: "Nov 14, 2026", phase: "Grand Finale (36 Hours)", desc: "Physical coding at allotted nodal engineering colleges" }
    ],
    judgingCriteria: [
      { criterion: "Feasibility of Ministry Implementation", weight: "40%" },
      { criterion: "Software Architecture & Scalability", weight: "30%" },
      { criterion: "Cost-effectiveness & Security", weight: "20%" },
      { criterion: "Presentation to Ministry Officials", weight: "10%" }
    ],
    faqs: [
      { q: "What is the team requirement?", a: "Each team must comprise exactly 6 members, including at least one female candidate." },
      { q: "Is travel allowance reimbursed?", a: "Yes, Indian Railways sleeper-class fare is reimbursed for all finalists by AICTE." }
    ]
  },

  {
    id: "hack-04",
    slug: "microsoft-future-ready-hackathon-2026",
    title: "Microsoft Future Ready Student Hackathon",
    organizer: "Microsoft India & GitHub Education",
    organizerType: "Global Tech Enterprise",
    organizerInitials: "MSFT",
    bannerImg: "assets/ai_banner.jpg",
    mode: "Online",
    city: "All India",
    state: "All India",
    venueAddress: "Virtual (Microsoft Teams & GitHub Classroom)",
    startDate: "2026-10-28",
    endDate: "2026-10-30",
    registrationDeadline: "2026-10-22T23:59:59+05:30",
    prizePool: 800000,
    prizePoolDisplay: "₹8,00,000",
    teamSizeMin: 1,
    teamSizeMax: 4,
    teamSizeDisplay: "1–4 Members",
    eligibility: "All Enrolled College Students (Any Year, Any Stream)",
    difficulty: "Beginner",
    technologies: ["Web Development", "Azure", "GitHub Copilot", "Generative AI", "Python", "JavaScript"],
    themes: ["Education", "Accessibility", "Sustainability", "Generative AI"],
    participantCount: 9200,
    verified: true,
    verificationSource: "Microsoft Learn Official Student Portal",
    sourceUrl: "https://studentambassadors.windows.com",
    registrationUrl: "https://microsoft.com/en-in/futureready-hackathon-2026",
    shortDescription: "A beginner-friendly national online hackathon designed to empower student builders using GitHub Copilot, Azure OpenAI, and cloud services.",
    fullDescription: "Microsoft India welcomes student innovators of all years to build impactful digital solutions. Beginners receive guided starter templates, free Azure credits ($200 per student), and direct mentorship from Microsoft engineers and MVPs.",
    tracks: [
      { name: "Accessibility Tech", description: "Software making learning accessible for neurodivergent and visually impaired students." },
      { name: "Sustainable Planet", description: "Tracking carbon footprints, energy saving, and e-waste management." },
      { name: "GenAI Assistants for Education", description: "Automated tutoring, notes summarizers, and interactive visual learning." }
    ],
    prizeBreakdown: [
      { rank: "First Place Winner", amount: "₹3,50,000", perks: "Surface Pro Devices + Direct Microsoft Interview" },
      { rank: "Second Place Winner", amount: "₹2,50,000", perks: "Xbox Series X + Mentorship Vouchers" },
      { rank: "Third Place Winner", amount: "₹1,50,000", perks: "Surface Go Tablet + Certification Vouchers" },
      { rank: "Top Beginner Team (1st Year)", amount: "₹50,000", perks: "Special Rising Star Award" }
    ],
    timeline: [
      { date: "Oct 22, 2026", phase: "Registration & Free Azure Credit Claims", desc: "Claim student benefits and register your team" },
      { date: "Oct 28, 2026", phase: "Virtual Hacking Starts", desc: "Build on GitHub Classroom with automated CI checks" },
      { date: "Oct 30, 2026", phase: "Video Demo & Code Submission", desc: "Submit 3-minute video walk-through and repo URL" }
    ],
    judgingCriteria: [
      { criterion: "Use of Azure & GitHub Copilot", weight: "25%" },
      { criterion: "Social Impact & Problem Significance", weight: "35%" },
      { criterion: "Clean Code & Documentation", weight: "25%" },
      { criterion: "Demo Video & Usability", weight: "15%" }
    ],
    faqs: [
      { q: "Is this suitable for 1st year beginners?", a: "Absolutely! We provide starter repositories with boilerplate code and free workshops." }
    ]
  },

  {
    id: "hack-05",
    slug: "cyber-shield-hackathon-kochi-2026",
    title: "CyberShield Kerala: National Cyber Defense Conclave",
    organizer: "Kerala Police Cyberdome & KSUM Kochi",
    organizerType: "State Police & Startup Mission",
    organizerInitials: "CYBER",
    bannerImg: "assets/ai_banner.jpg",
    mode: "Offline",
    city: "Kochi",
    state: "Kerala",
    venueAddress: "Integrated Startup Complex, Kalamassery, Kochi, Kerala",
    startDate: "2026-11-20",
    endDate: "2026-11-22",
    registrationDeadline: "2026-10-31T23:59:59+05:30",
    prizePool: 400000,
    prizePoolDisplay: "₹4,00,000",
    teamSizeMin: 2,
    teamSizeMax: 4,
    teamSizeDisplay: "2–4 Members",
    eligibility: "Engineering, BCA & Ethical Hacking Enthusiasts",
    difficulty: "Advanced",
    technologies: ["Cybersecurity", "Network Forensics", "Cryptography", "Reverse Engineering", "Linux"],
    themes: ["Cybersecurity", "Malware Analysis", "Critical Infrastructure Protection", "FinTech Fraud Prevention"],
    participantCount: 1650,
    verified: true,
    verificationSource: "Kerala Police Cyberdome Official Gazette (cyberdome.kerala.gov.in)",
    sourceUrl: "https://cyberdome.kerala.gov.in",
    registrationUrl: "https://startupmission.kerala.gov.in/cybershield2026",
    shortDescription: "An intensive offensive & defensive cybersecurity hackathon and CTF challenge tackling real-world cyber warfare scenarios in banking and state infrastructure.",
    fullDescription: "CyberShield Kerala gathers elite ethical hackers, reverse engineers, and forensics students. Tracks feature simulated ICS/SCADA attacks, darknet cryptocurrency tracing, and AI-driven deepfake defense mechanisms under the guidance of cyber investigators.",
    tracks: [
      { name: "Digital Forensics & Incident Response", description: "Triage simulated ransomware breaches in state power grids." },
      { name: "Banking Trojan Detection", description: "Real-time telemetry algorithms to catch UPI skimming and unauthorized APKs." },
      { name: "Deepfake & Audio Spoofing Countermeasures", description: "Biometric voice fraud prevention for bank customer calls." }
    ],
    prizeBreakdown: [
      { rank: "Grand Cyber Sentinel (1st)", amount: "₹2,00,000", perks: "Kerala Cyberdome Research Fellowship" },
      { rank: "Runner Up (2nd)", amount: "₹1,20,000", perks: "Bug bounty certification vouchers" },
      { rank: "Special CTF Winner", amount: "₹80,000", perks: "Hardware hacking toolkit & SDR badges" }
    ],
    timeline: [
      { date: "Oct 31, 2026", phase: "Online Preliminary CTF Qualification", desc: "Top 40 scoring teams qualify for physical finals" },
      { date: "Nov 05, 2026", phase: "Finalist Confirmation", desc: "Travel details confirmed" },
      { date: "Nov 20, 2026", phase: "Physical War Room Finale in Kochi", desc: "48-hour live target network engagement" }
    ],
    judgingCriteria: [
      { criterion: "Security Exploit & Defense Rigor", weight: "40%" },
      { criterion: "Forensic Report Clarity", weight: "30%" },
      { criterion: "Automation Script Quality", weight: "20%" },
      { criterion: "Speed of Incident Response", weight: "10%" }
    ],
    faqs: [
      { q: "Is prior CTF experience required?", a: "Intermediate familiarity with Wireshark, Ghidra, and Linux terminal is recommended." }
    ]
  },

  {
    id: "hack-06",
    slug: "pune-robotics-iot-innovators-sprint-2026",
    title: "Pune Robotics & Smart IoT League 2026",
    organizer: "COEP Technological University & DRDO DIAT",
    organizerType: "Premier Engineering University",
    organizerInitials: "COEP",
    bannerImg: "assets/hero_banner.jpg",
    mode: "Offline",
    city: "Pune",
    state: "Maharashtra",
    venueAddress: "COEP Tech Campus, Shivajinagar, Pune, Maharashtra 411005",
    startDate: "2026-11-28",
    endDate: "2026-11-30",
    registrationDeadline: "2026-11-08T23:59:59+05:30",
    prizePool: 650000,
    prizePoolDisplay: "₹6,50,000",
    teamSizeMin: 2,
    teamSizeMax: 5,
    teamSizeDisplay: "2–5 Members",
    eligibility: "B.Tech / Diploma (Mechanical, ECE, CSE, Mechatronics)",
    difficulty: "Intermediate",
    technologies: ["IoT", "Robotics", "Embedded C", "Raspberry Pi", "ROS", "Edge AI"],
    themes: ["Robotics & Hardware", "Autonomous Mobility", "Smart Manufacturing", "Defense Electronics"],
    participantCount: 2100,
    verified: true,
    verificationSource: "COEP Technological University Official Notice (coep.org.in)",
    sourceUrl: "https://coep.org.in/robotics-hackathon-2026",
    registrationUrl: "https://unstop.com/hackathons/pune-robotics-league-2026",
    shortDescription: "Build real hardware prototypes, autonomous rovers, and sensor-driven edge IoT systems at Maharashtra's oldest engineering institution.",
    fullDescription: "Teams get access to state-of-the-art COEP FabLabs, 3D printers, laser cutters, and oscilloscope workstations. Develop autonomous navigation rovers, industrial IoT vibration diagnostics, or smart wearable health monitors.",
    tracks: [
      { name: "Autonomous Warehouse Rovers", description: "ROS2-based obstacle avoidance and pallet transport in scaled mock warehouses." },
      { name: "Defense Border Surveillance Drone", description: "Thermal imaging payload and GPS-denied navigation systems." },
      { name: "Smart City Water Telemetry", description: "LoRaWAN sensor nodes monitoring municipal water contamination." }
    ],
    prizeBreakdown: [
      { rank: "Overall Hardware Champion", amount: "₹3,00,000", perks: "T-Incubator Prototype Grant of ₹2 Lakhs" },
      { rank: "Runner Up", amount: "₹2,00,000", perks: "Industrial component sponsorship" },
      { rank: "Best Mechatronics Design", amount: "₹1,50,000", perks: "3D printer kit for college lab" }
    ],
    timeline: [
      { date: "Nov 08, 2026", phase: "CAD/Circuit Design Submission", desc: "Submit circuit schematic, BOM, and simulation files" },
      { date: "Nov 15, 2026", phase: "Hardware Kit Dispatch", desc: "Component kits dispatched to selected teams" },
      { date: "Nov 28, 2026", phase: "48-Hour On-Campus Assembly & Testing", desc: "Live physical obstacle arena demo" }
    ],
    judgingCriteria: [
      { criterion: "Working Hardware Demonstration", weight: "45%" },
      { criterion: "Power Efficiency & Circuit Safety", weight: "25%" },
      { criterion: "Manufacturing Viability", weight: "20%" },
      { criterion: "Telemetry Dashboard & Code", weight: "10%" }
    ],
    faqs: [
      { q: "Are components provided on-site?", a: "Basic sensors, microcontrollers (ESP32, Arduino), and soldering irons are provided." }
    ]
  },

  {
    id: "hack-07",
    slug: "vit-hack-vellore-2026",
    title: "VITHack 2026: 36-Hour National Student Marathon",
    organizer: "VIT Vellore & ACM Student Chapter",
    organizerType: "Deemed University & Student Community",
    organizerInitials: "VIT",
    bannerImg: "assets/hero_banner.jpg",
    mode: "Hybrid",
    city: "Vellore",
    state: "Tamil Nadu",
    venueAddress: "Anna Auditorium & Technology Tower, VIT Vellore Campus, Tamil Nadu",
    startDate: "2026-10-30",
    endDate: "2026-11-01",
    registrationDeadline: "2026-10-16T23:59:59+05:30",
    prizePool: 450000,
    prizePoolDisplay: "₹4,50,000",
    teamSizeMin: 2,
    teamSizeMax: 4,
    teamSizeDisplay: "2–4 Members",
    eligibility: "All Undergrad & Postgrad College Students",
    difficulty: "Beginner",
    technologies: ["Web Development", "App Development", "AI/ML", "React", "Node.js", "Flutter"],
    themes: ["EdTech", "FinTech", "Social Good", "Open Innovation"],
    participantCount: 4600,
    verified: true,
    verificationSource: "VIT Official Student Affairs (vit.ac.in/vithack)",
    sourceUrl: "https://vit.ac.in/events/vithack-2026",
    registrationUrl: "https://vithack2026.devpost.com",
    shortDescription: "One of South India's most vibrant college hackathons celebrating student creativity across web, mobile apps, and developer productivity tooling.",
    fullDescription: "VITHack brings together collegiate programmers across India for 36 hours of relentless creation. Whether you are building your first React app or fine-tuning transformer weights, mentors from top startups will guide you through code reviews, pitch coaching, and design critiques.",
    tracks: [
      { name: "Student Life & Campus Automation", description: "Timetable synchronization, mess feedback, and collaborative peer learning." },
      { name: "FinTech for Tier-2/3 India", description: "Micro-savings, regional language expense trackers, and digital ledger tools." },
      { name: "Sustainable Habits", description: "Gamified recycling and electricity conservation apps." }
    ],
    prizeBreakdown: [
      { rank: "Gold Trophy Winner", amount: "₹2,00,000", perks: "Internship opportunities & trophies" },
      { rank: "Silver Trophy Winner", amount: "₹1,25,000", perks: "Tech goodies & branded gear" },
      { rank: "Bronze Trophy Winner", amount: "₹75,000", perks: "Cloud credits & vouchers" },
      { rank: "Freshers Spotlight Award", amount: "₹50,000", perks: "Exclusive for first-year undergraduate teams" }
    ],
    timeline: [
      { date: "Oct 16, 2026", phase: "Early Bird & Standard Registrations Close", desc: "Final day to register on Devpost" },
      { date: "Oct 30, 2026", phase: "Hackathon Commencement", desc: "Online check-in & physical check-in at VIT Anna Auditorium" },
      { date: "Nov 01, 2026", phase: "Grand Showcase & Valedictory", desc: "Top 10 pitch off before industry jury" }
    ],
    judgingCriteria: [
      { criterion: "Product Completeness", weight: "30%" },
      { criterion: "User Interface & Experience", weight: "30%" },
      { criterion: "Originality of Concept", weight: "25%" },
      { criterion: "Live Demonstration", weight: "15%" }
    ],
    faqs: [
      { q: "Can we participate remotely?", a: "Yes, hybrid participation is fully supported via Discord channels and video pitches." }
    ]
  },

  {
    id: "hack-08",
    slug: "delhi-devcon-cloud-fintech-hack-2026",
    title: "Delhi DevCon: FinTech & Cloud Architecture Sprint",
    organizer: "Google Developer Groups (GDG) New Delhi & NPCI",
    organizerType: "Developer Community & National Payments Corp",
    organizerInitials: "GDG",
    bannerImg: "assets/ai_banner.jpg",
    mode: "Hybrid",
    city: "New Delhi",
    state: "Delhi",
    venueAddress: "India Habitat Centre, Lodhi Road, New Delhi 110003",
    startDate: "2026-11-07",
    endDate: "2026-11-09",
    registrationDeadline: "2026-10-26T23:59:59+05:30",
    prizePool: 750000,
    prizePoolDisplay: "₹7,50,000",
    teamSizeMin: 2,
    teamSizeMax: 4,
    teamSizeDisplay: "2–4 Members",
    eligibility: "Engineering Students & Early Stage Developers",
    difficulty: "Intermediate",
    technologies: ["Cloud", "GCP", "Kubernetes", "Web Development", "Golang", "FinTech"],
    themes: ["FinTech", "High-Throughput Cloud", "UPI Innovations", "Financial Inclusion"],
    participantCount: 3100,
    verified: true,
    verificationSource: "Google Developer Groups Official Community (gdg.community.dev)",
    sourceUrl: "https://gdg.community.dev/events/delhi-devcon-2026",
    registrationUrl: "https://unstop.com/hackathons/delhi-devcon-fintech-2026",
    shortDescription: "Build ultra-reliable payment gateways, micro-lending algorithms, and resilient cloud architectures supporting India's booming digital economy.",
    fullDescription: "Hosted in the heart of the national capital alongside engineers from National Payments Corporation of India (NPCI) and Google Cloud. Solve high-concurrency payment processing, credit score assessment without traditional bank records, and instant fraud telemetry.",
    tracks: [
      { name: "Next-Gen UPI Workflows", description: "Offline sound-box protocols and recurring micro-mandates for rural merchants." },
      { name: "Scalable Microservices on GCP", description: "Zero-downtime distributed ledger services handling 50k requests per second." },
      { name: "AI Financial Health Advisory", description: "WhatsApp bot offering vernacular financial literacy and SIP planning." }
    ],
    prizeBreakdown: [
      { rank: "FinTech Titan (1st)", amount: "₹3,50,000", perks: "NPCI Sandbox Fast-track API access" },
      { rank: "Cloud Innovator (2nd)", amount: "₹2,50,000", perks: "$5,000 Google Cloud Credits" },
      { rank: "Rising Star Team", amount: "₹1,50,000", perks: "Mentorship by Principal GDG Architects" }
    ],
    timeline: [
      { date: "Oct 26, 2026", phase: "Registration Cutoff", desc: "Portal closes at midnight" },
      { date: "Nov 02, 2026", phase: "Virtual Architecture Review", desc: "System diagram vetting by mentors" },
      { date: "Nov 07, 2026", phase: "Sprint Kickoff", desc: "48 hours non-stop cloud building" }
    ],
    judgingCriteria: [
      { criterion: "System Resiliency & Concurrency", weight: "35%" },
      { criterion: "Financial Inclusion Impact", weight: "30%" },
      { criterion: "Clean API Design", weight: "20%" },
      { criterion: "Clarity of Documentation", weight: "15%" }
    ],
    faqs: [
      { q: "Is dummy payment API provided?", a: "Yes! Mock UPI and banking sandbox APIs are provided with realistic transaction feeds." }
    ]
  },

  {
    id: "hack-09",
    slug: "iit-bombay-techfest-hackathon-2026",
    title: "IIT Bombay Techfest: Open Innovation Hack",
    organizer: "Techfest, IIT Bombay",
    organizerType: "Asia's Largest Science & Tech Festival",
    organizerInitials: "IITB",
    bannerImg: "assets/hero_banner.jpg",
    mode: "Offline",
    city: "Mumbai",
    state: "Maharashtra",
    venueAddress: "IIT Bombay Campus, Powai, Mumbai, Maharashtra 400076",
    startDate: "2026-12-18",
    endDate: "2026-12-20",
    registrationDeadline: "2026-11-25T23:59:59+05:30",
    prizePool: 1200000,
    prizePoolDisplay: "₹12,00,000",
    teamSizeMin: 2,
    teamSizeMax: 4,
    teamSizeDisplay: "2–4 Members",
    eligibility: "Open to All College & University Students Nationwide",
    difficulty: "Advanced",
    technologies: ["AI/ML", "Web Development", "Robotics", "AR/VR", "Cloud", "Data Science"],
    themes: ["Open Innovation", "Space Tech", "Smart Cities", "Quantum Computing", "Clean Tech"],
    participantCount: 8900,
    verified: true,
    verificationSource: "Techfest IIT Bombay Official Portal (techfest.org)",
    sourceUrl: "https://techfest.org/competitions/open-innovation",
    registrationUrl: "https://techfest.org/register/hack2026",
    shortDescription: "The flagship hackathon of Techfest, IIT Bombay. Compete against top minds across India and pitch before global venture capitalists and scientists.",
    fullDescription: "Taking place amidst the bustling excitement of Techfest, this hackathon attracts elite student developers, hardware tinkerers, and AI researchers. The open innovation format gives full freedom to tackle unsolved challenges in space telemetry, climate tech, and quantum simulators.",
    tracks: [
      { name: "Space Exploration & Satellite Telemetry", description: "Orbital path optimization and cubesat downlink processing." },
      { name: "Urban Infrastructure & Clean Cities", description: "Automated municipal pothole detection using phone dashcam footage." },
      { name: "AR/VR Immersive Spatial Computing", description: "Virtual science laboratories for rural government schools." }
    ],
    prizeBreakdown: [
      { rank: "Techfest Grand Winner", amount: "₹5,00,000", perks: "IIT Bombay SINE Incubation Consideration" },
      { rank: "First Runner Up", amount: "₹3,50,000", perks: "Direct VC Pitch Session" },
      { rank: "Second Runner Up", amount: "₹2,00,000", perks: "Hardware developer workstations" },
      { rank: "Best Hardware-Software Integration", amount: "₹1,50,000", perks: "Lab equipment vouchers" }
    ],
    timeline: [
      { date: "Nov 25, 2026", phase: "Round 1 Abstract Submission", desc: "Submit 5-page PDF concept paper" },
      { date: "Dec 05, 2026", phase: "Finalist Announcement", desc: "Top 50 teams invited to IIT Bombay campus" },
      { date: "Dec 18, 2026", phase: "Campus Check-in & Hack Begins", desc: "Live physical hacking in Victor Menezes Convention Centre" }
    ],
    judgingCriteria: [
      { criterion: "Scientific Novelty & Engineering", weight: "40%" },
      { criterion: "Prototype Demonstration", weight: "30%" },
      { criterion: "Market Commercial Viability", weight: "20%" },
      { criterion: "Presentation Quality", weight: "10%" }
    ],
    faqs: [
      { q: "Is accommodation provided at Powai campus?", a: "Yes, campus hostel accommodation is arranged for verified outstation teams." }
    ]
  },

  {
    id: "hack-10",
    slug: "bengaluru-healthtech-hackathon-2026",
    title: "Bengaluru HealthTech Sprint: AI for Medicine",
    organizer: "Narayana Health & Indian Institute of Science (IISc)",
    organizerType: "Healthcare Provider & Premier Research Institute",
    organizerInitials: "IISC",
    bannerImg: "assets/ai_banner.jpg",
    mode: "Hybrid",
    city: "Bengaluru",
    state: "Karnataka",
    venueAddress: "IISc Campus, CV Raman Rd, Bengaluru & Narayana Institute of Cardiac Sciences",
    startDate: "2026-11-13",
    endDate: "2026-11-15",
    registrationDeadline: "2026-10-27T23:59:59+05:30",
    prizePool: 600000,
    prizePoolDisplay: "₹6,00,000",
    teamSizeMin: 2,
    teamSizeMax: 4,
    teamSizeDisplay: "2–4 Members",
    eligibility: "Engineering, Bio-medical, MCA & MBBS/Health Informatics Students",
    difficulty: "Intermediate",
    technologies: ["AI/ML", "Data Science", "Python", "Computer Vision", "FastAPI"],
    themes: ["Healthcare AI", "Bio-Informatics", "Affordable Diagnostics", "ICU Telemetry"],
    participantCount: 2400,
    verified: true,
    verificationSource: "IISc Computational and Data Sciences Dept (cds.iisc.ac.in)",
    sourceUrl: "https://cds.iisc.ac.in/healthtech-hack2026",
    registrationUrl: "https://unstop.com/hackathons/bengaluru-healthtech-2026",
    shortDescription: "Tackle clinical diagnostics bottlenecks with real anonymized medical datasets, guided by senior surgeons and IISc computer vision scientists.",
    fullDescription: "Access sanctioned, anonymized ECG strips, chest X-rays, and ICU vitals streams to build diagnostic alerting systems. Teams will validate models against clinician gold standards to build real-time clinical decision support tools.",
    tracks: [
      { name: "Automated ECG Arrhythmia Flagging", description: "Edge neural network detecting rare ventricular fibrillations on wearable bands." },
      { name: "Chest Radiograph Pathology AI", description: "Bilingual triage assistance for primary healthcare centers in Karnataka." },
      { name: "Surgical Tool Tracking & Safety", description: "Computer vision verification of surgical swabs and instruments." }
    ],
    prizeBreakdown: [
      { rank: "Clinical Breakthrough Award", amount: "₹3,00,000", perks: "Clinical trial pilot at Narayana Health" },
      { rank: "Runner Up", amount: "₹2,00,000", perks: "IISc Research Internship Offer" },
      { rank: "Best Student Innovation", amount: "₹1,00,000", perks: "Cloud compute credits" }
    ],
    timeline: [
      { date: "Oct 27, 2026", phase: "Registration & Data Agreement", desc: "Sign digital ethics agreement and access sandbox dataset" },
      { date: "Nov 13, 2026", phase: "Hackathon Start", desc: "48-hour sprint with clinician office hours" },
      { date: "Nov 15, 2026", phase: "Medical Jury Review", desc: "Evaluation by panel of MDs and AI professors" }
    ],
    judgingCriteria: [
      { criterion: "Clinical Accuracy & F1-Score", weight: "35%" },
      { criterion: "Safety & Hallucination Mitigation", weight: "30%" },
      { criterion: "Ease of Clinical Adoption", weight: "20%" },
      { criterion: "Code Reproducibility", weight: "15%" }
    ],
    faqs: [
      { q: "Is medical training required?", a: "No, engineering teams can participate freely; clinical mentors provide medical domain knowledge." }
    ]
  },

  {
    id: "hack-11",
    slug: "andhra-pradesh-open-gov-hack-2026",
    title: "Andhra Pradesh Citizen Tech Hackathon",
    organizer: "AP Innovation Society (APIS) & Andhra University",
    organizerType: "State Government Society",
    organizerInitials: "APIS",
    bannerImg: "assets/hero_banner.jpg",
    mode: "Online",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    venueAddress: "Online (Virtual Broadcast from Millennium Tower, Vizag)",
    startDate: "2026-11-02",
    endDate: "2026-11-04",
    registrationDeadline: "2026-10-24T23:59:59+05:30",
    prizePool: 350000,
    prizePoolDisplay: "₹3,50,000",
    teamSizeMin: 2,
    teamSizeMax: 4,
    teamSizeDisplay: "2–4 Members",
    eligibility: "Students from all Indian colleges & universities",
    difficulty: "Beginner",
    technologies: ["Web Development", "App Development", "Python", "React", "PostgreSQL"],
    themes: ["Civic Tech", "Smart Governance", "Public Utilities", "Citizen Grievances"],
    participantCount: 2800,
    verified: true,
    verificationSource: "Andhra Pradesh Innovation Society (apis.ap.gov.in)",
    sourceUrl: "https://apis.ap.gov.in/hackathon-2026",
    registrationUrl: "https://apis.ap.gov.in/register",
    shortDescription: "A statewide virtual hackathon solving public grievance redressal, smart water management, and rural ration distribution monitoring.",
    fullDescription: "AP Innovation Society invites college innovators to craft digital solutions for citizen services. Winning solutions will be piloted across municipal wards in Visakhapatnam and Vijayawada.",
    tracks: [
      { name: "Gram Ward Sachivalayam Automation", description: "Streamlining offline certificates through WhatsApp chatbots." },
      { name: "Urban Drainage & Mosquito Mapping", description: "Geotagged citizen reports with automated municipal ticketing." },
      { name: "Coastal Weather Alerts for Fishermen", description: "Audio broadcast alerts in vernacular Telugu based on INCOIS data." }
    ],
    prizeBreakdown: [
      { rank: "First Prize", amount: "₹1,75,000", perks: "Govt Pilot MoU Opportunity" },
      { rank: "Second Prize", amount: "₹1,00,000", perks: "APIS Incubation Membership" },
      { rank: "Third Prize", amount: "₹75,000", perks: "Cash citation & certificates" }
    ],
    timeline: [
      { date: "Oct 24, 2026", phase: "Online Application Cutoff", desc: "Submit team and project synopsis" },
      { date: "Nov 02, 2026", phase: "Virtual Hackathon Opening", desc: "Virtual coding sessions and mentor check-ins" },
      { date: "Nov 04, 2026", phase: "Jury Demo Stream", desc: "Live stream of top 12 team presentations" }
    ],
    judgingCriteria: [
      { criterion: "Relevance to Citizen Services", weight: "35%" },
      { criterion: "Simplicity of User Interface", weight: "30%" },
      { criterion: "System Reliability & Security", weight: "20%" },
      { criterion: "Live Working Prototype", weight: "15%" }
    ],
    faqs: [
      { q: "Is participation strictly online?", a: "Yes, this entire hackathon is held online to enable students from remote towns to participate." }
    ]
  },

  {
    id: "hack-12",
    slug: "kolkata-ai-vision-hackathon-2026",
    title: "Bengal AI Vision Summit: Next-Gen Image & Video",
    organizer: "Jadavpur University & NASSCOM East",
    organizerType: "State University & Industry Body",
    organizerInitials: "JU",
    bannerImg: "assets/ai_banner.jpg",
    mode: "Hybrid",
    city: "Kolkata",
    state: "West Bengal",
    venueAddress: "Jadavpur University Salt Lake Campus, Kolkata, West Bengal 700098",
    startDate: "2026-11-21",
    endDate: "2026-11-23",
    registrationDeadline: "2026-11-05T23:59:59+05:30",
    prizePool: 400000,
    prizePoolDisplay: "₹4,00,000",
    teamSizeMin: 2,
    teamSizeMax: 4,
    teamSizeDisplay: "2–4 Members",
    eligibility: "Engineering & Science Students (B.Tech, BCA, MCA, M.Sc)",
    difficulty: "Intermediate",
    technologies: ["AI/ML", "Computer Vision", "Python", "OpenCV", "PyTorch", "Data Science"],
    themes: ["Computer Vision", "Video Analytics", "Heritage Preservation", "Smart Traffic"],
    participantCount: 1950,
    verified: true,
    verificationSource: "Jadavpur University Computer Science Dept (jaduniv.edu.in)",
    sourceUrl: "https://jaduniv.edu.in/events/bengal-ai-vision-2026",
    registrationUrl: "https://devfolio.co/bengal-ai-vision-2026",
    shortDescription: "Build cutting-edge computer vision pipelines for heritage preservation, drone surveillance, and traffic flow optimization in historic urban zones.",
    fullDescription: "Join eastern India's flagship computer vision competition. Train models to digitally restore damaged historical manuscripts, detect municipal encroachments from satellite imagery, or track pedestrian density.",
    tracks: [
      { name: "Historical Document Restoration", description: "OCR and diffusion models restoring degraded Bengali & Sanskrit manuscripts." },
      { name: "Urban Congestion Analysis", description: "Lightweight video analytics on low-resolution CCTV camera streams." },
      { name: "Industrial Defect Classification", description: "Catching sub-millimeter manufacturing defects in steel manufacturing." }
    ],
    prizeBreakdown: [
      { rank: "First Place", amount: "₹2,00,000", perks: "NASSCOM Startup Hub Fast-Track" },
      { rank: "Second Place", amount: "₹1,25,000", perks: "NVIDIA Jetson Nano Developer Kits" },
      { rank: "Third Place", amount: "₹75,000", perks: "Cloud GPU Vouchers" }
    ],
    timeline: [
      { date: "Nov 05, 2026", phase: "Registration Closes", desc: "Team registrations & preliminary proposal" },
      { date: "Nov 21, 2026", phase: "Development Kickoff", desc: "Access compute cluster and begin coding" },
      { date: "Nov 23, 2026", phase: "Final Review & Demos", desc: "Live leaderboard results and award ceremony" }
    ],
    judgingCriteria: [
      { criterion: "Model Inference Speed & Accuracy", weight: "35%" },
      { criterion: "Practical Industrial Utility", weight: "30%" },
      { criterion: "Data Pipeline Quality", weight: "20%" },
      { criterion: "Pitch & Presentation", weight: "15%" }
    ],
    faqs: [
      { q: "Do we get free GPU credits?", a: "Yes, shortlisted teams receive access to university GPU server clusters." }
    ]
  }
];

// Initial Teammate Request Posts (Team Formation Hub)
const INITIAL_TEAM_POSTS = [
  {
    id: "team-post-1",
    hackathonId: "hack-01",
    hackathonTitle: "AI Innovation Challenge 2026 (Hyderabad)",
    creatorName: "Aarav Sharma",
    creatorCollege: "IIT Hyderabad • 3rd Year CSE",
    creatorAvatar: "AS",
    lookingForRole: "Frontend Developer & UI Designer",
    description: "Building an offline Vernacular Voice AI for farmers in Telangana. We have our Whisper fine-tune model ready; need an awesome developer to build a slick Next.js/React PWA interface.",
    skillsNeeded: ["React", "JavaScript", "UI/UX", "Tailwind/CSS", "Web Audio API"],
    location: "Hyderabad, Telangana",
    experienceLevel: "Intermediate",
    currentMembers: 3,
    maxMembers: 4,
    contactDiscord: "aarav_iith#4421",
    contactEmail: "aarav.sharma@iith.ac.in",
    createdAt: "2026-10-08"
  },
  {
    id: "team-post-2",
    hackathonId: "hack-02",
    hackathonTitle: "ETHIndia Bengaluru 2026",
    creatorName: "Sneha Reddy",
    creatorCollege: "BMS College of Engineering, Bengaluru • 4th Year ISE",
    creatorAvatar: "SR",
    lookingForRole: "Smart Contract / Solidity Developer",
    description: "Building an Account Abstraction (ERC-4337) social recovery wallet with zero-knowledge proof identity checks. We have the frontend and bundler ready; need a Solidity ninja for smart contract logic.",
    skillsNeeded: ["Solidity", "Hardhat/Foundry", "Web3", "Ethereum", "ZK Proofs"],
    location: "Bengaluru, Karnataka",
    experienceLevel: "Advanced",
    currentMembers: 2,
    maxMembers: 4,
    contactDiscord: "sneha_crypto#1089",
    contactEmail: "sneha.reddy@bmsce.ac.in",
    createdAt: "2026-10-07"
  },
  {
    id: "team-post-3",
    hackathonId: "hack-04",
    hackathonTitle: "Microsoft Future Ready Student Hackathon",
    creatorName: "Rohan Varma",
    creatorCollege: "VIT Vellore • 1st Year B.Tech CSE",
    creatorAvatar: "RV",
    lookingForRole: "Beginner Python / Flask Developer",
    description: "We are first-year students participating in our very first national hackathon! Building a simple student notes visualizer using Azure OpenAI. Looking for an enthusiastic teammate who wants to learn and build together.",
    skillsNeeded: ["Python", "HTML/CSS", "Git", "Eagerness to Learn"],
    location: "Online / Any City in India",
    experienceLevel: "Beginner",
    currentMembers: 2,
    maxMembers: 4,
    contactDiscord: "rohan_freshman#7712",
    contactEmail: "rohan.v@vitstudent.ac.in",
    createdAt: "2026-10-09"
  },
  {
    id: "team-post-4",
    hackathonId: "hack-06",
    hackathonTitle: "Pune Robotics & Smart IoT League 2026",
    creatorName: "Aditya Patil",
    creatorCollege: "COEP Technological University • 3rd Year Mechatronics",
    creatorAvatar: "AP",
    lookingForRole: "Embedded C & ESP32 Firmware Coder",
    description: "Developing a low-power LoRa sensor node for real-time vibration analytics in CNC machines. Mechanical chassis & CAD is finished; need someone proficient with ESP-IDF or FreeRTOS.",
    skillsNeeded: ["Embedded C", "ESP32", "IoT", "FreeRTOS", "MQTT"],
    location: "Pune, Maharashtra",
    experienceLevel: "Intermediate",
    currentMembers: 3,
    maxMembers: 5,
    contactDiscord: "aditya_coep#9021",
    contactEmail: "aditya.p@coep.ac.in",
    createdAt: "2026-10-06"
  }
];

// Initial Live System Notifications
const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "hot",
    title: "🔥 New Hackathon Found!",
    body: "AI Innovation Challenge 2026 (IIT Hyderabad) is now open for registration. Prize Pool: ₹5,00,000. Closes in 9 days.",
    timestamp: "10 mins ago",
    read: false,
    hackathonId: "hack-01"
  },
  {
    id: "notif-2",
    type: "urgent",
    title: "⏰ Deadline Approaching Fast!",
    body: "Smart India Hackathon (SIH) 2026 registration closing in 6 days. Confirm your 6-member team SPOC authorization.",
    timestamp: "1 hour ago",
    read: false,
    hackathonId: "hack-03"
  },
  {
    id: "notif-3",
    type: "match",
    title: "⭐ Personalized Skill Match",
    body: "Based on your interest in Web3 and Blockchain, ETHIndia 2026 in Bengaluru is accepting applications with ₹25 Lakhs+ in prizes.",
    timestamp: "4 hours ago",
    read: true,
    hackathonId: "hack-02"
  },
  {
    id: "notif-4",
    type: "hot",
    title: "💰 High Prize Pool Alert",
    body: "IIT Bombay Techfest launched their Open Innovation Hack with ₹12 Lakh prize pool. Open to students nationwide.",
    timestamp: "1 day ago",
    read: true,
    hackathonId: "hack-09"
  }
];

// Default Demo User Profile (1st-2nd Year Indian College Student)
const DEFAULT_USER_PROFILE = {
  name: "Sai Krishna",
  college: "Chaitanya Bharathi Institute of Technology (CBIT)",
  course: "B.Tech",
  branch: "Computer Science & Engineering",
  year: "2nd Year",
  city: "Hyderabad",
  state: "Telangana",
  skills: ["Python", "Web Development", "AI/ML", "React", "JavaScript"],
  interests: ["Artificial Intelligence", "Generative AI", "Civic Tech", "Open Innovation"],
  preferredMode: "Hybrid",
  experienceLevel: "Beginner",
  savedHackathons: ["hack-01", "hack-04"]
};
