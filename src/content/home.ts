/**
 * Landing-page copy, moved verbatim out of the page component.
 * Edit text here; components only render it.
 */

export const whyCards = [
  {
    num: '01',
    img: 'lifestyle-trek.webp',
    title: 'High Altitude & Pilgrimage',
    desc: 'Every year thousands travel to Kedarnath, Badrinath, Ladakh, Sikkim. As altitude rises, oxygen drops. Breathlessness, fatigue, headache and dizziness follow.',
    list: ['Pilgrims fulfilling faith', 'Bikers conquering terrain', 'Travellers & photographers'],
  },
  {
    num: '02',
    img: 'lifestyle-yoga.webp',
    title: 'Elderly & Vulnerable',
    desc: 'With age, lung capacity to exchange oxygen in the blood decreases. Walking, climbing stairs, travelling — simple activities become exhausting... and suffocating. breathEN provides gentle, immediate comfort.',
    list: [
      'Improves comfort & confidence',
      'Reduces breathlessness & exhaustion',
      'Immediate on-the-go comfort and relief',
    ],
  },
  {
    num: '03',
    img: 'lifestyle-fire.webp',
    title: 'First Aid & Emergency',
    desc: 'Emergencies give no warnings. Fire incidents, factory accidents, smoke, chemical and gases exposure, sudden breathlessness — breathEN acts as immediate temporary oxygen boost before help arrives.',
    list: ['Police & fire rescue teams', 'Factory and industrial staff and personnel', 'Residential building dwellers'],
  },
  {
    num: '04',
    img: 'lifestyle-office.webp',
    title: 'Indoor Professionals',
    desc: 'Millions spend 8–12 hours indoors daily. AC environments have lower oxygen, higher CO₂ — causing mental fatigue, low productivity, sleepiness and headaches.',
    list: ['Office workers & IT professionals', 'Designers & students', 'Anyone working indoors'],
  },
  {
    num: '05',
    img: 'lifestyle-gym.webp',
    title: 'Fitness & Athletes',
    desc: 'Physical exertion increases oxygen demand. breathEN supports muscle recovery, reduces fatigue, improves alertness and restores energy faster after intense sessions.',
    list: ['Athletes & gym users', 'Cyclists & runners', 'Sports professionals'],
  },
];

export const whyBenefits = [
  'Instant oxygen boost',
  'No prescription needed',
  'Zero side effects',
  'Upto 200 shots per can',
  'Trusted by fire officers',
  'Ships across India',
];

export const howToSteps = [
  { n: 1, h: 'Place the Mask', p: 'Place the mask over your nose and mouth for a comfortable, secure fit.' },
  { n: 2, h: 'Activate the Shot', p: 'Press and quick release the actuator (button) to activate each shot.' },
  { n: 3, h: 'Inhale Deeply', p: 'Inhale the shot deeply through your nose — the natural breathing pathway.' },
  { n: 4, h: 'Repeat as Needed', p: 'Inhale 5–10 shots as needed. For exertion, shots can be increased as required.' },
  {
    n: 5,
    h: 'Feel the Difference',
    p: 'Experience immediate freshness, better focus, and reduced fatigue within seconds.',
  },
];

/** The words from the old scrolling banner, in the same order. */
export const brandTags = [
  'BREATHE BETTER',
  'LIVE STRONGER',
  'URBAN LIFESTYLE',
  'FITNESS READY',
  'TRAVEL READY',
  'ALTITUDE READY',
  'NOSE BREATHING',
  'LEAK PROOF',
  'RECYCLABLE',
];

/** The three one-liners from the old scrolling quote banner (quotes added by the component). */
export const pullQuotes = [
  { quote: 'Works like magic, totally indispensable', by: 'IMDAD FAKHI' },
  { quote: 'Get your breath back almost immediately', by: 'SS PATIL — FIRE OFFICER' },
  { quote: 'Gives me comfort and support', by: 'RABIYA BI, 68' },
];

export const testimonials = [
  {
    text: 'Get your breath back almost immediately with breathEN.',
    name: 'SS Patil',
    title: 'Fire Officer',
    tag: 'Verified First Responder',
  },
  {
    text: "BreathEN reduces fatigue, gives a quick performance boost, and provides relief from smog and pollution. It's an awesome product and works like magic, totally indispensable.",
    name: 'Imdad Fakhi',
    title: 'breathEN User',
  },
  {
    text: 'For years, stepping outside felt frightening. My breathing would get heavy, and I avoided walking altogether. When my breathing starts to feel difficult, breathEN gives me comfort and support. It helps me calm down, breathe easier, and regain confidence to continue.',
    name: 'Rabiya Bi, 68 years',
    title: 'Has Chronic Asthma',
  },
  {
    text: 'Hospital visit avoided — just because breathEN supported their breathing immediately after evacuating the building. They were able to breathe normally again with only 10–12 shots.',
    name: 'Anonymous Housewife',
    title: 'Fire Incident Evacuee',
    tag: 'Hospital Visit Avoided',
  },
];

/**
 * Product benefits. Transcribed word for word from the brand's two benefit
 * infographics (benefits-1.jpg, benefits-2.jpg) so they render as real text.
 */
export const benefitGroups = [
  {
    id: 'lifestyle',
    label: 'Lifestyle Benefits',
    items: [
      {
        title: 'Travel Recovery / Jet Lag',
        desc: 'Supports faster recovery from flights, road trips, altitude changes, and long journeys.',
      },
      {
        title: 'Supports Urban Lifestyle',
        desc: 'Helps counter the heavy-air feeling from offices, traffic, pollution, and closed spaces.',
      },
      {
        title: 'Instant Refresh',
        desc: 'Quick oxygen boost that helps you feel lighter, clearer, and energised within seconds.',
      },
      {
        title: 'Clear Focus',
        desc: 'Refreshing breaths help reduce foggy-head feeling after stress or fatigue.',
      },
    ],
  },
  {
    id: 'performance',
    label: 'Performance Benefits',
    items: [
      {
        title: 'Enhance Endurance',
        desc: 'Supports longer-lasting energy during workouts, travel, and active days.',
      },
      {
        title: 'Breathe Better',
        desc: 'Enjoy smoother, lighter breathing anytime your air feels heavy.',
      },
      {
        title: 'Perform Stronger',
        desc: 'Refreshes breathing between or after activity to support stamina and post-exercise comfort',
      },
      {
        title: 'Recover Faster',
        desc: 'Supports quicker breathing comfort after workouts, stress, and long days.',
      },
    ],
  },
];

/** FAQ, moved verbatim from the old FAQ component. */
export const faqs = [
  {
    q: 'What is breathEN?',
    a: "breathEN is the world's first nose breathing canister containing 99% pure oxygen, designed to help you feel refreshed, re-energised, and mentally clear in moments when pollution, fatigue, stress, or physical exertion drain your body. It is a wellness and lifestyle product — not a medical device.",
  },
  {
    q: 'How do I use breathEN?',
    a: 'Place the mask over your nose and mouth. Press and quick release the actuator to activate each shot. Inhale deeply. Repeat 5–10 shots as needed. For full video instructions, visit our YouTube channel: breathEN OXYGEN.',
  },
  {
    q: 'How long does one canister last?',
    a: 'Each canister contains 8.5 litres of 99% pure oxygen, equating to over 200 shots. A full can feels empty because oxygen gas has virtually no discernible mass — but it is guaranteed full.',
  },
  {
    q: 'Are there any side effects?',
    a: 'No. breathEN has zero side effects because it is simply much higher quality air than you normally breathe. No known side effects when used as directed. Overuse is not recommended.',
  },
  {
    q: 'Can I use breathEN with COPD or asthma?',
    a: 'breathEN is a supplemental oxygen product that helps you breathe more comfortably during shortness of breath or exertion. It is not a replacement for prescribed medical oxygen. Many COPD individuals find it helpful as an on-the-go boost. Always consult your doctor for medical conditions.',
  },
  {
    q: 'Why would I need oxygen when I already breathe air?',
    a: "Urban air — especially in cities — often contains high CO₂ levels, pollutants, and low effective oxygen availability. High CO₂ leads to faster exhaustion, brain fog, reduced concentration, and poor recovery. breathEN provides clean, concentrated oxygen that helps your body recover faster when natural breathing isn't enough.",
  },
  {
    q: 'Is breathEN a medical product?',
    a: 'No. breathEN is not a medical device and does not replace medical oxygen or treatment. It is a wellness and lifestyle product, meant for general revitalisation and recovery.',
  },
  {
    q: 'Can athletes and gym-goers use breathEN?',
    a: 'Absolutely. breathEN is especially useful for post-workout recovery, intense training sessions, endurance and breathing comfort, and between sets or matches.',
  },
  {
    q: 'Is breathEN flammable?',
    a: 'Oxygen is not a fuel itself, but can accelerate combustion. Store in a cool, dry place, away from direct heat or flames. Keep out of reach of children.',
  },
  { q: 'Can I recycle the canisters?', a: 'Yes! Our canisters are made from aluminium, which is fully recyclable.' },
  {
    q: 'Can I collaborate or partner with breathEN?',
    a: 'Yes! We collaborate with athletes & fitness professionals, corporate wellness programs, gyms & sports academies, and lifestyle & wellness brands. Contact us at info@breathen99.com or call +91 9819250202.',
  },
];
