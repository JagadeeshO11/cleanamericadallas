export const categories = [
  {
    id: 'cleaning',
    label: 'House Cleaning & Maid',
    vehicles: [
      { id: 'house-clean',  name: 'Standard House Cleaning',   desc: 'Dusting, mopping, kitchen & bath cleaning',  rate: 49, unit: 'hr',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80' },
      { id: 'deep-clean',   name: 'Deep Home Cleaning',        desc: 'Comprehensive scrub, baseboards, appliances', rate: 149, unit: 'visit',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80' },
      { id: 'move-clean',   name: 'Move-In / Move-Out Clean',  desc: 'Empty home deep sanitation & closet wash',   rate: 189, unit: 'visit',
        image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&q=80' },
      { id: 'carpet-clean', name: 'Carpet & Sofa Steam Clean', desc: 'Hot water stain & odor extraction',         rate: 99, unit: 'room',
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80' },
    ],
  },
  {
    id: 'plumbing',
    label: 'Plumbing & Drain',
    vehicles: [
      { id: 'plumb-repair',  name: 'Plumbing Service Call',     desc: 'Pipe leak fix, faucet & toilet repair',      rate: 79, unit: 'hr',
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80' },
      { id: 'drain-clean',   name: 'Drain & Sewer Unclogging',  desc: 'Hydro-jetting & main line snake clearance',  rate: 119, unit: 'service',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&q=80' },
      { id: 'water-heater',  name: 'Water Heater Service',      desc: 'Tankless & tank maintenance or flush',       rate: 149, unit: 'service',
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80' },
      { id: 'garbage-disposal', name: 'Garbage Disposal Repair', desc: 'Jam clearance & motor replacement',       rate: 89, unit: 'service',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80' },
    ],
  },
  {
    id: 'hvac',
    label: 'HVAC & Air Conditioning',
    vehicles: [
      { id: 'ac-tuneup',     name: 'AC System Tune-Up',        desc: 'Refrigerant check, coil clean & inspection', rate: 89, unit: 'visit',
        image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&q=80' },
      { id: 'ac-repair',     name: 'Emergency AC Repair',       desc: 'Compressor, capacitor & airflow fixes',       rate: 129, unit: 'hr',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80' },
      { id: 'air-duct',      name: 'Air Duct Cleaning',         desc: 'Whole-house vent & duct dust sterilization', rate: 199, unit: 'service',
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80' },
      { id: 'thermostat',    name: 'Smart Thermostat Setup',    desc: 'Nest/Ecobee installation & wiring',          rate: 79, unit: 'service',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80' },
    ],
  },
  {
    id: 'electrical',
    label: 'Electrical & Lighting',
    vehicles: [
      { id: 'electrician',   name: 'Licensed Electrician',      desc: 'Wiring troubleshooting & breaker repair',   rate: 85, unit: 'hr',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80' },
      { id: 'light-install', name: 'Fixture & Ceiling Fan',     desc: 'Chandelier, recessed light & fan mounting',  rate: 69, unit: 'service',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80' },
      { id: 'panel-upgrade', name: 'EV Charger / Outlet Install', desc: 'Level 2 EV charger & 240V dedicated outlet', rate: 249, unit: 'service',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80' },
    ],
  },
  {
    id: 'lawn',
    label: 'Lawn Care & Landscaping',
    vehicles: [
      { id: 'lawn-mow',      name: 'Lawn Mowing & Edging',      desc: 'Mowing, string trimming, driveway blow-off',  rate: 45, unit: 'visit',
        image: 'https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=600' },
      { id: 'tree-trim',     name: 'Tree & Hedge Trimming',     desc: 'Branch pruning, bush shaping & debris hauling', rate: 120, unit: 'visit',
        image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=600' },
      { id: 'sprinkler',     name: 'Irrigation & Sprinkler Repair', desc: 'Zone testing, head replacement & leak fix', rate: 89, unit: 'service',
        image: 'https://images.pexels.com/photos/2253818/pexels-photo-2253818.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
  },
  {
    id: 'handyman',
    label: 'Handyman & Repairs',
    vehicles: [
      { id: 'handyman-pro',  name: 'General Handyman',         desc: 'TV mounting, drywall patch, door repair',    rate: 65, unit: 'hr',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80' },
      { id: 'assembly',      name: 'Furniture Assembly',        desc: 'IKEA, Wayfair & patio set assembly',         rate: 55, unit: 'hr',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80' },
      { id: 'drywall-repair', name: 'Drywall & Texture Repair', desc: 'Hole patching, sanding & texture matching',   rate: 95, unit: 'service',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80' },
    ],
  },
  {
    id: 'pest',
    label: 'Pest Control & Protection',
    vehicles: [
      { id: 'pest-spray',    name: 'General Pest Spray',        desc: 'Ant, spider, cockroach barrier spray',       rate: 85, unit: 'visit',
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80' },
      { id: 'termite-check', name: 'Termite Inspection & Bait', desc: 'Full perimeter soil check & bait stations',  rate: 149, unit: 'visit',
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80' },
      { id: 'mosquito-fog',  name: 'Mosquito Lawn Fogging',     desc: 'Seasonal yard treatment for outdoor comfort', rate: 75, unit: 'visit',
        image: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=600&q=80' },
    ],
  },
  {
    id: 'roofing',
    label: 'Roof, Gutters & Pressure Wash',
    vehicles: [
      { id: 'gutter-clean',  name: 'Gutter Cleaning & Flushing', desc: 'Debris removal & downspout clearing',       rate: 119, unit: 'service',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80' },
      { id: 'pressure-wash', name: 'Pressure Washing',          desc: 'Driveway, patio, siding & fence wash',        rate: 139, unit: 'service',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
      { id: 'roof-inspect',  name: 'Roof Inspection & Patch',   desc: 'Shingle repair & storm damage assessment',   rate: 199, unit: 'service',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80' },
    ],
  },
];

export const allVehicles = categories.flatMap(c =>
  c.vehicles.map(v => ({ ...v, category: c.id, categoryLabel: c.label }))
);
