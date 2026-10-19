/**
 * Realistic Electronic Gadget Seed Dataset for Reviewly AI
 * Includes real Indian Rupee (INR / ₹) prices, technical specifications,
 * authentic customer reviews with aspect tagging, and AI syntheses.
 */

export const INITIAL_PRODUCTS = [
  {
    id: "sony-wh1000xm5",
    name: "Sony WH-1000XM5 Wireless ANC Headphones",
    brand: "Sony",
    category: "Headphones",
    priceINR: 29990,
    rating: 4.6,
    reviewCount: 3840,
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    description: "Industry-leading noise canceling with two processors, 8 microphones, Auto NC Optimizer, and up to 30 hours battery life with quick charging.",
    badge: "Consensus Best ANC",
    specs: {
      "Form Factor": "Over-Ear Closed Back",
      "Driver Unit": "30mm Carbon Fiber",
      "Battery Life": "30 hours (ANC On) / 40 hours (ANC Off)",
      "Charging": "USB-C Quick Charge (3 min = 3 hrs playback)",
      "Weight": "250g Lightweight Design",
      "Bluetooth": "v5.2, LDAC, AAC, SBC, Multipoint",
      "Microphones": "8 Microphones with AI Beamforming",
      "Voice Assistant": "Google Assistant, Alexa Built-in"
    },
    sentimentStats: {
      positiveCount: 3187,
      neutralCount: 422,
      negativeCount: 231,
      positivePct: 83,
      neutralPct: 11,
      negativePct: 6,
      consensusScore: 89
    },
    aspects: [
      { name: "Noise Cancellation", sentiment: "positive", score: 96, mentions: 2480, summary: "Class-leading low-frequency and speech attenuation with dual processors." },
      { name: "Battery Life", sentiment: "positive", score: 92, mentions: 1890, summary: "Easily hits 30 hours of continuous active playback." },
      { name: "Comfort & Fit", sentiment: "neutral", score: 76, mentions: 1450, summary: "Narrower headband causes top-of-head pressure during 4+ hour flights." },
      { name: "Sound Quality", sentiment: "positive", score: 88, mentions: 2120, summary: "Detailed soundstage with punchy sub-bass via LDAC codec." },
      { name: "Build & Portability", sentiment: "negative", score: 64, mentions: 980, summary: "Non-folding design requires a significantly larger travel case than XM4." },
      { name: "Microphone Clarity", sentiment: "positive", score: 85, mentions: 1140, summary: "AI beamforming isolates voice superbly even in busy cafes." }
    ],
    summary: {
      verdict: "Strong Pick",
      executiveSummary: "The Sony WH-1000XM5 remains the benchmark for consumer active noise cancellation and call quality. While the updated fixed-hinge headband divides users who frequently commute with compact bags, the 8-mic array, LDAC clarity, and 30-hour battery stamina make it unmatched for focus and travel.",
      pros: [
        "Unrivaled active noise cancellation across trains, flights, and office chatter",
        "Reliable 30+ hour battery life with rapid 3-minute emergency charging",
        "Seamless multipoint Bluetooth switching between laptop and phone",
        "Clear voice isolation for calls in noisy outdoor environments",
        "Intuitive touch gestures and Speak-to-Chat auto-pausing"
      ],
      cons: [
        "Earcups do not fold inwards, requiring a noticeably bulkier carry case",
        "Thinner headband cushioning creates a crown hotspot after extended listening",
        "Touch controls can occasionally misfire in high humidity or drizzle"
      ],
      keyConcerns: "Long-term headband pressure for users with larger head shapes, and lack of folding hinges for frequent backpack travelers.",
      consensus: "89% Positive Consensus across 3,840 verified consumer and audiophile reviews.",
      recommendedFor: "Remote knowledge workers, frequent flyers, and commuters seeking the quietest possible listening bubble."
    },
    reviews: [
      {
        id: "rev-xm5-1",
        author: "Vikram Malhotra",
        rating: 5,
        date: "2026-03-12",
        verified: true,
        sentiment: "positive",
        title: "Absolute silence on Mumbai local train commutes",
        text: "The ANC on the XM5 is practically sorcery. It cuts out engine rumble, screeching rails, and high-pitch cabin conversations effortlessly. Battery easily lasts an entire work week.",
        aspects: ["Noise Cancellation", "Battery Life"]
      },
      {
        id: "rev-xm5-2",
        author: "Pooja Sundaram",
        rating: 4,
        date: "2026-02-28",
        verified: true,
        sentiment: "neutral",
        title: "Phenomenal sound, but the case is huge",
        text: "Sound balance is fantastic with custom EQ in the Sony app. My only gripe is that it doesn't fold like my old XM3. It takes up too much room in my work briefcase.",
        aspects: ["Sound Quality", "Build & Portability"]
      },
      {
        id: "rev-xm5-3",
        author: "Rahul Deshmukh",
        rating: 3,
        date: "2026-01-19",
        verified: true,
        sentiment: "negative",
        title: "Headband pain after 3 hours of Zoom calls",
        text: "ANC and mic are 10/10, but the narrow headband padding creates a noticeable sore spot on top of my head after several back-to-back meetings. Wish they kept the XM4 band.",
        aspects: ["Comfort & Fit"]
      }
    ]
  },
  {
    id: "bose-qc-ultra",
    name: "Bose QuietComfort Ultra Wireless Headphones",
    brand: "Bose",
    category: "Headphones",
    priceINR: 37900,
    rating: 4.5,
    reviewCount: 2910,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Spatial audio with Bose Immersive Audio, world-class noise cancellation, CustomTune sound calibration, and ultra-plush luxury synthetic leather ear cushions.",
    badge: "Best Ergonomic Comfort",
    specs: {
      "Form Factor": "Over-Ear Folding Design",
      "Technology": "Bose Immersive Spatial Audio",
      "Battery Life": "24 hours (Standard) / 18 hours (Immersive)",
      "Charging": "USB-C (15 min = 2.5 hrs playback)",
      "Weight": "252g with folding cast-aluminum yokes",
      "Bluetooth": "v5.3, Snapdragon Sound, aptX Adaptive",
      "Microphones": "Beamforming array with WindBlock",
      "Controls": "Capacitive volume strip + tactile physical buttons"
    },
    sentimentStats: {
      positiveCount: 2357,
      neutralCount: 378,
      negativeCount: 175,
      positivePct: 81,
      neutralPct: 13,
      negativePct: 6,
      consensusScore: 86
    },
    aspects: [
      { name: "Comfort & Fit", sentiment: "positive", score: 98, mentions: 2210, summary: "The gold standard for clamp force and cloud-like ear cushion distribution." },
      { name: "Noise Cancellation", sentiment: "positive", score: 94, mentions: 2040, summary: "Virtually indistinguishable from Sony XM5 in eliminating aircraft rumble." },
      { name: "Spatial Audio", sentiment: "positive", score: 82, mentions: 1320, summary: "Immersive mode expands live acoustic tracks convincingly." },
      { name: "Battery Life", sentiment: "neutral", score: 72, mentions: 1110, summary: "24-hour runtime lags behind Sony's 30-hour standard." },
      { name: "Build & Portability", sentiment: "positive", score: 90, mentions: 1450, summary: "Folds compactly into an included flat hardshell case." },
      { name: "Price / Value", sentiment: "negative", score: 62, mentions: 920, summary: "At ₹37,900, commands a heavy premium over competitors." }
    ],
    summary: {
      verdict: "Top Comfort Pick",
      executiveSummary: "Bose QuietComfort Ultra pairs legendary ergonomic comfort with upgraded spatial audio capabilities. It folds into a compact footprint and eliminates cabin pressure better than rivals, though battery stamina falls behind Sony and the price sits at the luxury tier.",
      pros: [
        "Unsurpassed cloud-like comfort with zero crown fatigue on 10+ hour flights",
        "Folds compactly with solid metal hinges for space-saving packing",
        "Top-tier active noise cancellation with natural ambient Aware mode",
        "CustomTune technology calibrates acoustic frequency to individual ear canals"
      ],
      cons: [
        "Battery life drops to 18 hours when Immersive Audio is active",
        "Higher price tag than the Sony WH-1000XM5 in India",
        "Mobile companion app occasionally experiences Bluetooth handshake delays"
      ],
      keyConcerns: "Premium pricing and lower battery life compared to direct rivals.",
      consensus: "86% Positive Consensus across 2,910 verified buyer reviews.",
      recommendedFor: "Travelers prioritizing all-day physical comfort and folding portability above all else."
    },
    reviews: [
      {
        id: "rev-bose-1",
        author: "Ananya Iyer",
        rating: 5,
        date: "2026-03-15",
        verified: true,
        sentiment: "positive",
        title: "I can wear these for 8 hours without feeling them",
        text: "The clamp force is perfection. Soft ear cushions don't make my ears sweat, and the ANC on long-haul flights from Bengaluru to London was a lifesaver.",
        aspects: ["Comfort & Fit", "Noise Cancellation"]
      },
      {
        id: "rev-bose-2",
        author: "Devendra Patel",
        rating: 4,
        date: "2026-02-14",
        verified: true,
        sentiment: "neutral",
        title: "Great spatial audio, but battery drains faster in immersive mode",
        text: "Music sounds open and wide with Immersive Audio turned on, but you sacrifice battery life pretty fast. Still the most comfortable headphones I've ever owned.",
        aspects: ["Spatial Audio", "Battery Life"]
      }
    ]
  },
  {
    id: "apple-macbook-pro-m3",
    name: "Apple MacBook Pro 14″ (M3 Pro, 18GB, 512GB SSD)",
    brand: "Apple",
    category: "Laptops",
    priceINR: 199900,
    rating: 4.8,
    reviewCount: 1820,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    description: "Liquid Retina XDR display with ProMotion 120Hz, M3 Pro silicon chip with 11-core CPU and 14-core GPU, up to 18 hours battery life, and Space Black finish.",
    badge: "Editor's Choice",
    specs: {
      "Display": "14.2″ Liquid Retina XDR (3024 × 1964), 120Hz ProMotion, 1600 nits peak",
      "Processor": "Apple M3 Pro (11-core CPU, 14-core GPU, 16-core Neural Engine)",
      "Memory": "18GB Unified Memory (150GB/s bandwidth)",
      "Storage": "512GB High-Speed NVMe SSD",
      "Battery": "70Wh Lithium-Polymer, up to 18 hours video playback",
      "Ports": "3x Thunderbolt 4 / USB4, HDMI 2.1, SDXC Card slot, MagSafe 3",
      "Weight": "1.61 kg Space Black aluminum unibody",
      "Audio": "Six-speaker sound system with force-cancelling woofers"
    },
    sentimentStats: {
      positiveCount: 1674,
      neutralCount: 109,
      negativeCount: 37,
      positivePct: 92,
      neutralPct: 6,
      negativePct: 2,
      consensusScore: 94
    },
    aspects: [
      { name: "Performance", sentiment: "positive", score: 98, mentions: 1540, summary: "M3 Pro handles 4K ProRes timeline scrubbing and Docker containers without fan spin." },
      { name: "Battery Life", sentiment: "positive", score: 97, mentions: 1420, summary: "Effortlessly delivers 14-16 hours of real-world software development work." },
      { name: "Display", sentiment: "positive", score: 96, mentions: 1390, summary: "True blacks, 1600 nits peak HDR brightness, and butter-smooth 120Hz scrolling." },
      { name: "Audio & Speakers", sentiment: "positive", score: 95, mentions: 980, summary: "Best-in-class built-in laptop audio with punchy spatial resonance." },
      { name: "Price / Value", sentiment: "neutral", score: 71, mentions: 1120, summary: "Hefty initial investment, though justified by 5+ year resale and longevity." },
      { name: "Upgradeability", sentiment: "negative", score: 48, mentions: 630, summary: "Unified memory and SSD are soldered with steep RAM upgrade pricing." }
    ],
    summary: {
      verdict: "Gold Standard",
      executiveSummary: "The M3 Pro MacBook Pro 14 offers unmatched performance per watt. It maintains full compute speeds on battery power without thermal throttling or loud fan noise. The Liquid Retina XDR display, studio-quality microphones, and class-leading battery longevity make it the premier mobile workstation.",
      pros: [
        "Uncompromised performance whether plugged in or operating on battery",
        "Astonishing 16+ hour real-world battery life on typical software development stacks",
        "Breathtaking 120Hz Mini-LED XDR display with incredible color calibration",
        "Space Black finish significantly reduces fingerprint smudging",
        "Generous port selection including full-size SD card reader and HDMI"
      ],
      cons: [
        "Base 18GB unified memory and 512GB storage are non-upgradeable after purchase",
        "Premium ₹1,99,900 asking price in the Indian market",
        "Slightly heavier than standard ultrabooks at 1.61 kg"
      ],
      keyConcerns: "Expensive storage upgrade tiers and lack of user repairability.",
      consensus: "94% Overwhelmingly Positive Consensus across 1,820 professional user reviews.",
      recommendedFor: "Software engineers, digital creators, video editors, and power users demanding portable workstation prowess."
    },
    reviews: [
      {
        id: "rev-mac-1",
        author: "Karan Johar Sharma",
        rating: 5,
        date: "2026-03-20",
        verified: true,
        sentiment: "positive",
        title: "I can work two full workdays without carrying my charger",
        text: "The M3 Pro battery is unbelievable. Running VS Code, three Node servers, and 30 Chrome tabs for 14 hours and still had 25% battery left. The screen is gorgeous.",
        aspects: ["Battery Life", "Performance", "Display"]
      },
      {
        id: "rev-mac-2",
        author: "Meera Krishnan",
        rating: 5,
        date: "2026-02-19",
        verified: true,
        sentiment: "positive",
        title: "Silent powerhouse for 4K video rendering",
        text: "Exported an hour of 4K 10-bit footage in DaVinci Resolve. The fans didn't even turn on audible speed. Space Black looks stealthy and clean.",
        aspects: ["Performance", "Audio & Speakers"]
      }
    ]
  },
  {
    id: "iphone-16-pro-max",
    name: "Apple iPhone 16 Pro Max (256GB, Natural Titanium)",
    brand: "Apple",
    category: "Smartphones",
    priceINR: 144900,
    rating: 4.7,
    reviewCount: 4620,
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    description: "6.9″ Super Retina XDR display with ProMotion, grade 5 titanium frame, A18 Pro Bionic chip, Camera Control button, and 4K 120fps Dolby Vision video recording.",
    badge: "Flagship Champion",
    specs: {
      "Display": "6.9″ OLED Super Retina XDR (2868 × 1320), 120Hz ProMotion, 2000 nits",
      "Processor": "Apple A18 Pro (6-core CPU, 6-core GPU, 16-core Neural Engine)",
      "Cameras": "48MP Fusion + 48MP Ultra-Wide + 12MP 5x Telephoto with Tetraprism",
      "Video": "4K 120 fps ProRes, Dolby Vision, Spatial Audio Capture",
      "Build": "Grade 5 Titanium with Ceramic Shield front & textured matte glass",
      "Battery": "4685 mAh, up to 33 hours video playback, MagSafe 25W",
      "Controls": "Action Button + Dedicated Capacitive Camera Control Button",
      "Operating System": "iOS 18 with Apple Intelligence integration"
    },
    sentimentStats: {
      positiveCount: 4065,
      neutralCount: 369,
      negativeCount: 186,
      positivePct: 88,
      neutralPct: 8,
      negativePct: 4,
      consensusScore: 91
    },
    aspects: [
      { name: "Camera System", sentiment: "positive", score: 97, mentions: 3820, summary: "4K 120fps slow-motion and 48MP ultra-wide macro shots are unrivaled." },
      { name: "Battery Life", sentiment: "positive", score: 95, mentions: 3410, summary: "Easily lasts 1.5 to 2 full days of heavy usage with 9+ hours screen-on time." },
      { name: "Display", sentiment: "positive", score: 94, mentions: 2950, summary: "Ultra-thin bezels and high outdoor peak brightness make it stunning." },
      { name: "Performance", sentiment: "positive", score: 96, mentions: 2600, summary: "A18 Pro tears through console-quality AAA games without overheating." },
      { name: "Camera Control Button", sentiment: "neutral", score: 71, mentions: 1890, summary: "Slight learning curve for the touch-slide zoom sensitivity." },
      { name: "Dimensions & Grip", sentiment: "neutral", score: 74, mentions: 1340, summary: "6.9-inch footprint is expansive; one-handed use requires reachability." }
    ],
    summary: {
      verdict: "Top Smartphone",
      executiveSummary: "The iPhone 16 Pro Max combines best-in-class battery endurance, unmatched video recording capabilities (4K 120fps Dolby Vision), and a breathtaking 6.9-inch display with whisper-thin bezels. The A18 Pro chip ensures fluid speed, while the titanium frame keeps the overall weight balanced.",
      pros: [
        "Unmatched battery stamina lasting up to 2 full days on moderate use",
        "Cinematic video quality with 4K 120fps slow-motion recording",
        "Expansive 6.9″ OLED with razor-thin borders and 2000 nits outdoor clarity",
        "Fast USB-C 10Gbps data transfer speeds for external SSD recording",
        "Upgraded thermal graphite architecture keeps body cooler during gaming"
      ],
      cons: [
        "Large 6.9″ frame makes one-handed pocketability challenging for some",
        "Charging speed peaks around 27W-30W, slower than Android 100W competitors",
        "High initial retail cost in the Indian market"
      ],
      keyConcerns: "Substantial physical dimensions and gradual charging rates compared to Chinese Android flagships.",
      consensus: "91% Positive Consensus across 4,620 verified owner reviews.",
      recommendedFor: "Mobile content creators, videographers, photographers, and power users wanting the longest battery life."
    },
    reviews: [
      {
        id: "rev-ip-1",
        author: "Siddharth Verma",
        rating: 5,
        date: "2026-03-18",
        verified: true,
        sentiment: "positive",
        title: "Battery life that refuses to die",
        text: "I took this phone off the charger at 7 AM, used GPS navigation for 2 hours, took over 200 photos at a wedding, and went to bed with 48% battery remaining. Pure perfection.",
        aspects: ["Battery Life", "Camera System"]
      },
      {
        id: "rev-ip-2",
        author: "Rohan Kapoor",
        rating: 4,
        date: "2026-02-22",
        verified: true,
        sentiment: "neutral",
        title: "Camera control button takes time to get used to",
        text: "The photo quality is sensational, especially low light. The new camera control button is cool, but I found myself accidentally triggering zoom until I adjusted sensitivity.",
        aspects: ["Camera Control Button", "Camera System"]
      }
    ]
  },
  {
    id: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra (512GB, Titanium Gray)",
    brand: "Samsung",
    category: "Smartphones",
    priceINR: 129999,
    rating: 4.6,
    reviewCount: 3950,
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    description: "6.8″ QHD+ Dynamic AMOLED 2X flat display with anti-reflective Corning Gorilla Armor, Snapdragon 8 Gen 3 for Galaxy, integrated S-Pen stylus, and 200MP camera system.",
    badge: "Versatility King",
    specs: {
      "Display": "6.8″ QHD+ Flat AMOLED (3120 × 1440), 1-120Hz LTPO, Gorilla Armor Anti-Reflective",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy (4nm, Overclocked Cortex-X4)",
      "Cameras": "200MP Main + 50MP 5x Periscope + 10MP 3x Telephoto + 12MP Ultra-Wide",
      "Stylus": "Built-in Bluetooth S-Pen with Air Actions",
      "Battery": "5000 mAh with 45W wired and 15W wireless charging",
      "AI Features": "Galaxy AI (Circle to Search, Live Call Translate, Note Assist)",
      "Software Support": "7 full years of Android OS updates & security patches"
    },
    sentimentStats: {
      positiveCount: 3397,
      neutralCount: 395,
      negativeCount: 158,
      positivePct: 86,
      neutralPct: 10,
      negativePct: 4,
      consensusScore: 88
    },
    aspects: [
      { name: "Display & Anti-Reflective", sentiment: "positive", score: 98, mentions: 3120, summary: "Gorilla Armor completely eliminates outdoor reflections in bright Indian sunlight." },
      { name: "Camera Zoom & 200MP", sentiment: "positive", score: 93, mentions: 2940, summary: "Crisp 5x and 10x architectural and concert zoom capability." },
      { name: "S-Pen & Productivity", sentiment: "positive", score: 92, mentions: 1820, summary: "Built-in S-Pen is invaluable for document signing and precision photo editing." },
      { name: "Performance", sentiment: "positive", score: 94, mentions: 2200, summary: "Supercharged Snapdragon 8 Gen 3 provides blistering speed with 12GB RAM." },
      { name: "Ergonomics & Corners", sentiment: "neutral", score: 72, mentions: 1420, summary: "Sharp squared-off corners can dig into palms without a protective case." },
      { name: "Shutter Lag", sentiment: "negative", score: 68, mentions: 810, summary: "Occasional motion blur when capturing fast-moving children and pets indoors." }
    ],
    summary: {
      verdict: "Top Android Flagship",
      executiveSummary: "The Galaxy S24 Ultra is the pinnacle of Android productivity. Its anti-reflective Gorilla Armor glass transforms outdoor viewing, the integrated S-Pen remains peerless for digital notes, and Samsung's promise of 7 years of software updates guarantees long-term return on investment.",
      pros: [
        "Gorilla Armor glass cuts reflections by 75% for unmatched outdoor visibility",
        "Versatile quad-camera array with unmatched 5x to 30x optical clarity",
        "Built-in S-Pen stylus for sketching, signing documents, and remote camera control",
        "Flat display profile makes glass screen protectors easy to apply flawlessly",
        "7 years of promised Android OS and security upgrades"
      ],
      cons: [
        "Boxy rectangular corners can feel sharp in hands without a case",
        "Indoor shutter speed still experiences slight delay with rapid movement",
        "45W charging speed still takes over an hour for a 0-100% top up"
      ],
      keyConcerns: "Sharp corner ergonomics and shutter speed on fast indoor targets.",
      consensus: "88% Positive Consensus across 3,950 verified customer reviews.",
      recommendedFor: "Power users, enterprise executives, and Android aficionados needing multi-window productivity and optical zoom."
    },
    reviews: [
      {
        id: "rev-s24-1",
        author: "Aditya Bhattacharya",
        rating: 5,
        date: "2026-03-10",
        verified: true,
        sentiment: "positive",
        title: "The anti-reflective screen is a game changer in Delhi summer",
        text: "I can read emails directly under blazing midday sun without cupping my hand over the display. Gorilla Armor is the single best hardware improvement on any phone in years.",
        aspects: ["Display & Anti-Reflective"]
      },
      {
        id: "rev-s24-2",
        author: "Sneha Nair",
        rating: 4,
        date: "2026-02-18",
        verified: true,
        sentiment: "positive",
        title: "S-Pen is unbeatable for quick notes",
        text: "I sign contracts and annotate PDFs daily with the S-Pen. Camera 5x optical zoom is razor sharp for concerts. Just buy a case with rounded edges because the bare phone corners are sharp.",
        aspects: ["S-Pen & Productivity", "Ergonomics & Corners"]
      }
    ]
  },
  {
    id: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2 (49mm Titanium, GPS + Cellular)",
    brand: "Apple",
    category: "Smartwatches",
    priceINR: 89900,
    rating: 4.8,
    reviewCount: 1640,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Rugged aerospace-grade titanium case, precision dual-frequency GPS, up to 36 hours regular battery life, 3000 nits display, Action button, and 100m water resistance.",
    badge: "Adventure Standard",
    specs: {
      "Case": "49mm Aerospace-Grade Titanium with raised bezel lip",
      "Display": "Always-On Retina OLED, 3000 nits peak outdoor brightness, Sapphire Crystal",
      "Chip": "S9 SiP with 4-core Neural Engine and on-device Siri",
      "GPS": "Precision Dual-Frequency (L1 and L5) GPS",
      "Battery Life": "36 hours normal use / up to 72 hours in Low Power Mode",
      "Water Resistance": "100m water resistance, EN13319 dive computer certification to 40m",
      "Emergency": "86-decibel Emergency Siren audible up to 180 meters",
      "Connectivity": "LTE Cellular + UMTS, Wi-Fi, Bluetooth 5.3, UWB Gen 2"
    },
    sentimentStats: {
      positiveCount: 1492,
      neutralCount: 115,
      negativeCount: 33,
      positivePct: 91,
      neutralPct: 7,
      negativePct: 2,
      consensusScore: 93
    },
    aspects: [
      { name: "Display Brightness", sentiment: "positive", score: 99, mentions: 1410, summary: "3000 nits display is instantly readable under direct alpine glare." },
      { name: "Battery Life", sentiment: "positive", score: 94, mentions: 1350, summary: "Easily hits 3 days between charges with regular GPS workout tracking." },
      { name: "Durability & Build", sentiment: "positive", score: 96, mentions: 1220, summary: "Titanium case and flat sapphire crystal shrug off rocks and door frames." },
      { name: "GPS Accuracy", sentiment: "positive", score: 95, mentions: 980, summary: "Dual-frequency L1/L5 locks onto satellite coordinates even in dense skyscraper canyons." },
      { name: "Size on Small Wrists", sentiment: "neutral", score: 68, mentions: 790, summary: "49mm lug-to-lug width is bulky on wrists under 6.5 inches." },
      { name: "Price / Value", sentiment: "neutral", score: 72, mentions: 890, summary: "Significant price tag compared to standard Series 9 or 10." }
    ],
    summary: {
      verdict: "Ultimate Smartwatch",
      executiveSummary: "Apple Watch Ultra 2 is the most capable smartwatch on the market. It blends full smartwatch functionality (cellular calling, notifications, apps) with genuine multi-day adventure endurance, a blindingly bright 3000-nit sapphire screen, and indestructible titanium construction.",
      pros: [
        "Legitimate 3-day battery life eliminating the dread of daily evening charging",
        "Spectacular 3000 nits display readable in blinding outdoor sunlight",
        "Indestructible titanium chassis that withstands brutal scrapes and knocks",
        "Customizable physical Action button for instant workout lap timing",
        "Dual-frequency GPS provides track-accurate running route maps"
      ],
      cons: [
        "Large 49mm case can look oversized and catch on tight dress shirt cuffs",
        "Sleep tracking can feel cumbersome due to physical watch thickness",
        "Restricted strictly to Apple iPhone users"
      ],
      keyConcerns: "Physical bulk on smaller wrists and exclusive compatibility with iOS.",
      consensus: "93% Overwhelmingly Positive Consensus across 1,640 verified buyers.",
      recommendedFor: "Endurance athletes, outdoor adventurers, marathon runners, and iPhone users desiring multi-day battery."
    },
    reviews: [
      {
        id: "rev-aw-1",
        author: "Gaurav Sen",
        rating: 5,
        date: "2026-03-05",
        verified: true,
        sentiment: "positive",
        title: "Finally an Apple Watch that lasts through a weekend trek",
        text: "Did a 2-day trek in the Western Ghats with continuous GPS trail tracking. Reached home Sunday night with 34% battery remaining. The sapphire glass is scratch-proof.",
        aspects: ["Battery Life", "GPS Accuracy", "Durability & Build"]
      }
    ]
  },
  {
    id: "ipad-pro-m4",
    name: "Apple iPad Pro 13″ (M4, 256GB, Ultra Retina XDR)",
    brand: "Apple",
    category: "Tablets",
    priceINR: 129900,
    rating: 4.7,
    reviewCount: 1420,
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    description: "Impossibly thin 5.1mm design, breakthrough Tandem OLED Ultra Retina XDR display, blazing M4 silicon chip, and landscape front camera with Center Stage.",
    badge: "Display Marvel",
    specs: {
      "Display": "13″ Tandem OLED Ultra Retina XDR (2752 × 2064), 1000 nits full screen / 1600 nits peak HDR",
      "Thickness": "5.1mm — The thinnest Apple product ever made",
      "Processor": "Apple M4 (9-core CPU, 10-core GPU with hardware ray tracing, 16-core NPU)",
      "Cameras": "12MP Wide back + Landscape 12MP TrueDepth front camera",
      "Audio": "Four-speaker audio system with studio-quality microphones",
      "Accessories": "Apple Pencil Pro support with barrel roll & Magic Keyboard with function row",
      "Weight": "579g Space Black aluminum body"
    },
    sentimentStats: {
      positiveCount: 1264,
      neutralCount: 114,
      negativeCount: 42,
      positivePct: 89,
      neutralPct: 8,
      negativePct: 3,
      consensusScore: 90
    },
    aspects: [
      { name: "Tandem OLED Display", sentiment: "positive", score: 99, mentions: 1280, summary: "Tandem OLED yields jaw-dropping HDR highlights with zero blooming around text." },
      { name: "Ultra-Thin Portability", sentiment: "positive", score: 96, mentions: 1150, summary: "At 5.1mm, holding the 13-inch tablet feels remarkably light and agile." },
      { name: "M4 Performance", sentiment: "positive", score: 97, mentions: 990, summary: "Crushes 3D sculpting in Nomad and 4K ProRes timeline rendering in Final Cut." },
      { name: "iPadOS Limitations", sentiment: "negative", score: 58, mentions: 850, summary: "Software multitasking still restricts the raw power of the desktop-class M4 silicon." },
      { name: "Price with Accessories", sentiment: "neutral", score: 69, mentions: 920, summary: "Pairing with Magic Keyboard and Apple Pencil Pro pushes total cost past ₹1.8 Lakhs." }
    ],
    summary: {
      verdict: "Hardware Pinnacle",
      executiveSummary: "The iPad Pro M4 is an engineering marvel. Tandem OLED produces the best display ever mounted on a mobile device, encased in an impossibly slender 5.1mm unibody. While iPadOS still limits desktop desktop windowing, for digital illustrators and HDR media creators, it has no equal.",
      pros: [
        "Revolutionary Tandem OLED screen with zero halo blooming and infinite contrast",
        "Unbelievably thin 5.1mm design that feels effortless to hold",
        "M4 chip provides staggering headroom for graphics and AI inference",
        "Landscape front camera is positioned naturally for video calls",
        "Apple Pencil Pro haptics and barrel roll enhance illustration precision"
      ],
      cons: [
        "iPadOS window management still doesn't match full macOS workflow flexibility",
        "Magic Keyboard and Pencil Pro accessories add substantial additional expenditure",
        "No multi-user account support for shared household or studio use"
      ],
      keyConcerns: "Software limitations relative to desktop OS capabilities, and high total cost with accessories.",
      consensus: "90% Positive Consensus across 1,420 creative professionals.",
      recommendedFor: "Digital artists, concept painters, storyboard illustrators, and mobile video editors."
    },
    reviews: [
      {
        id: "rev-ipad-1",
        author: "Rituja Mukherjee",
        rating: 5,
        date: "2026-03-02",
        verified: true,
        sentiment: "positive",
        title: "Tandem OLED makes watching and color-grading content pure joy",
        text: "The black levels on this OLED screen are deep and ink-like. Drawing with the Apple Pencil Pro feels like real paper, with barrel roll adding so much nuance to calligraphic brush strokes.",
        aspects: ["Tandem OLED Display", "Ultra-Thin Portability"]
      }
    ]
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Categories", icon: "devices" },
  { id: "Smartphones", name: "Smartphones", icon: "smartphone" },
  { id: "Laptops", name: "Laptops", icon: "laptop" },
  { id: "Headphones", name: "Headphones", icon: "headphones" },
  { id: "Smartwatches", name: "Smartwatches", icon: "watch" },
  { id: "Tablets", name: "Tablets", icon: "tablet" }
];
