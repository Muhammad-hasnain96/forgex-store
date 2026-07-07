import type { Product } from "./types";

/** Unique product image — Wikimedia Commons (relevant) or Unsplash (unique ID per product). */
const W = (path: string) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}`;

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop&auto=format&q=80`;

/**
 * 60 products: original 10 (p1–p10) + 50 more (p11–p60).
 * Every product has a unique image URL matched to the item.
 */
export const SEED_PRODUCTS: Product[] = [
  // ── Original 10 catalog items (restored) ──
  { id: "p1", name: "Claw Hammer 16oz", price: 850, category: "Hand Tools", stock: 45, rating: 4.8, reviews: 23, description: "Professional grade claw hammer with ergonomic grip and shock-absorbing handle. Perfect for framing and demolition work.", image: W("a/a4/Framing_hammer.jpg/400px-Framing_hammer.jpg") },
  { id: "p2", name: "Cordless Drill 12V", price: 6500, category: "Power Tools", stock: 12, rating: 4.9, reviews: 67, description: "Compact and powerful cordless drill with 2-speed transmission. Includes 2 batteries and charger.", image: W("1/16/Hitachi_D10VC2.jpg/400px-Hitachi_D10VC2.jpg") },
  { id: "p3", name: 'Pipe Wrench 14"', price: 1450, category: "Hand Tools", stock: 28, rating: 4.7, reviews: 15, description: "Heavy-duty adjustable pipe wrench. Cast iron construction with serrated jaws for secure grip.", image: W("f/f5/Pipe_wrench.jpg/400px-Pipe_wrench.jpg") },
  { id: "p4", name: "PVC Pipe 1in (3m)", price: 420, category: "Plumbing", stock: 85, rating: 4.6, reviews: 8, description: "Schedule 40 PVC pipe, 1 inch diameter, 3 meters length. Perfect for irrigation and plumbing.", image: W("8/8d/PVC_Pipes.jpg/400px-PVC_Pipes.jpg") },
  { id: "p5", name: "Emulsion Paint 4L", price: 3200, category: "Paint", stock: 34, rating: 4.5, reviews: 42, description: "Premium quality emulsion paint with excellent coverage. Eco-friendly and quick-drying.", image: W("5/59/Paint_rollers_and_tray.jpg/400px-Paint_rollers_and_tray.jpg") },
  { id: "p6", name: "GI Binding Wire 1kg", price: 380, category: "Fasteners", stock: 120, rating: 4.4, reviews: 9, description: "Galvanized iron binding wire for construction. High tensile strength and corrosion resistant.", image: W("9/9a/Rebar.JPG/400px-Rebar.JPG") },
  { id: "p7", name: "Aluminium Ladder 6ft", price: 8900, category: "Tools", stock: 8, rating: 4.9, reviews: 34, description: "Lightweight yet sturdy aluminum ladder. Non-slip steps and safety guardrails included.", image: W("4/49/Aluminium_step_ladder.jpg/400px-Aluminium_step_ladder.jpg") },
  { id: "p8", name: "Wood Screws (100pc)", price: 250, category: "Fasteners", stock: 200, rating: 4.3, reviews: 11, description: "Assorted wood screws with Phillips head. Rust-resistant coating for outdoor use.", image: W("e/e9/Wood_screws.jpg/400px-Wood_screws.jpg") },
  { id: "p9", name: "Angle Grinder 4in", price: 5200, category: "Power Tools", stock: 5, rating: 4.8, reviews: 28, description: "Powerful angle grinder for cutting and grinding. Adjustable speed and safety features.", image: W("b/b5/Angle_grinder.jpg/400px-Angle_grinder.jpg") },
  { id: "p10", name: "Measuring Tape 5m", price: 320, category: "Hand Tools", stock: 156, rating: 4.6, reviews: 19, description: "Durable measuring tape with clear markings. Auto-locking mechanism and belt clip.", image: W("d/d5/Tape_measure.jpg/400px-Tape_measure.jpg") },

  // ── 50 additional products (p11–p60), each with a unique image ──
  { id: "p11", name: "Screwdriver Set 6pc", price: 650, category: "Hand Tools", stock: 60, rating: 4.6, reviews: 31, description: "Chrome vanadium screwdriver set with magnetic tips.", image: U("1586864387967-d02a85b3a4ae") },
  { id: "p12", name: "Adjustable Spanner 10in", price: 980, category: "Hand Tools", stock: 42, rating: 4.5, reviews: 27, description: "Chrome finish adjustable spanner for nuts and bolts.", image: U("1530124566582-0c518b3290d0") },
  { id: "p13", name: "Combination Pliers 8in", price: 720, category: "Hand Tools", stock: 55, rating: 4.4, reviews: 22, description: "Insulated grip combination pliers for cutting and gripping.", image: U("1504148455328-c376907d081c") },
  { id: "p14", name: "Hex Key Set 9pc", price: 390, category: "Hand Tools", stock: 88, rating: 4.3, reviews: 16, description: "Metric hex key set with ball-end design.", image: U("1616624646953-e682d8127d75") },
  { id: "p15", name: "Rubber Mallet 16oz", price: 540, category: "Hand Tools", stock: 36, rating: 4.5, reviews: 14, description: "Soft-face rubber mallet for assembly work.", image: U("1504307651256-08a2ec904c3b") },

  { id: "p16", name: "Circular Saw 7.25in", price: 11200, category: "Power Tools", stock: 9, rating: 4.7, reviews: 44, description: "Electric circular saw with carbide blade for clean cuts.", image: U("1590804053-2c915a2c3a85") },
  { id: "p17", name: "Impact Driver Kit", price: 9800, category: "Power Tools", stock: 14, rating: 4.9, reviews: 52, description: "High-torque impact driver with bit set and carry case.", image: U("1589939705384-01112f84d8ea") },
  { id: "p18", name: "Jigsaw 600W", price: 7400, category: "Power Tools", stock: 11, rating: 4.6, reviews: 36, description: "Variable speed jigsaw for curved and straight cuts.", image: U("1574717620600-28a49c9f3b51") },
  { id: "p19", name: "Heat Gun 2000W", price: 4200, category: "Power Tools", stock: 17, rating: 4.4, reviews: 19, description: "Dual-temperature heat gun for paint stripping and shrinking.", image: U("1581094794329-c8112a89af12") },
  { id: "p20", name: "Orbital Sander", price: 6800, category: "Power Tools", stock: 13, rating: 4.7, reviews: 41, description: "Random orbital sander with dust collection bag.", image: U("1504328345606-18bbc8c9d7d1") },

  { id: "p21", name: "Basin Wrench", price: 1100, category: "Plumbing", stock: 22, rating: 4.5, reviews: 14, description: "Telescopic basin wrench for tight under-sink spaces.", image: U("1625842268674-991b9502414e") },
  { id: "p22", name: "PTFE Thread Tape", price: 80, category: "Plumbing", stock: 200, rating: 4.4, reviews: 56, description: "Plumber's tape for leak-free threaded joints.", image: U("1558618666-fcd25c85f82e") },
  { id: "p23", name: "Kitchen Mixer Tap", price: 4500, category: "Plumbing", stock: 16, rating: 4.7, reviews: 21, description: "Stainless steel kitchen faucet with ceramic cartridge.", image: U("1604197572626-884341134ec2") },
  { id: "p24", name: "Water Pump 0.5HP", price: 18500, category: "Plumbing", stock: 7, rating: 4.8, reviews: 33, description: "Self-priming peripheral water pump for home use.", image: U("1558618047-3c8c76ca79d6") },
  { id: "p25", name: "Flush Valve Kit", price: 890, category: "Plumbing", stock: 40, rating: 4.3, reviews: 12, description: "Universal toilet flush valve repair kit.", image: U("1607472586893-d937816f0cce") },

  { id: "p26", name: "Enamel Paint 1L", price: 890, category: "Paint", stock: 48, rating: 4.4, reviews: 29, description: "High-gloss enamel for metal and wood surfaces.", image: U("1598306442570-dfccc7cae1a4") },
  { id: "p27", name: "Paint Roller Kit", price: 450, category: "Paint", stock: 72, rating: 4.3, reviews: 18, description: "Roller, tray, and extension pole for wall painting.", image: U("1631673662642-180379ba346d") },
  { id: "p28", name: "Wall Putty 5kg", price: 680, category: "Paint", stock: 55, rating: 4.6, reviews: 24, description: "Acrylic wall putty for smooth interior finishes.", image: U("1562259949-e8e7689d7828") },
  { id: "p29", name: "Spray Paint Black", price: 350, category: "Paint", stock: 90, rating: 4.2, reviews: 37, description: "Fast-dry spray paint for metal, wood, and plastic.", image: U("1563457953712-c91ba884f43d") },
  { id: "p30", name: "Primer Sealer 4L", price: 2100, category: "Paint", stock: 30, rating: 4.5, reviews: 20, description: "Interior wall primer for better paint adhesion.", image: U("1549497532-a77045d99d21") },

  { id: "p31", name: "Anchor Bolts M10 (20pc)", price: 520, category: "Fasteners", stock: 65, rating: 4.5, reviews: 16, description: "Expansion anchor bolts for concrete and brick.", image: U("1616400580995-33e5b4a68dc9") },
  { id: "p32", name: "Nail Assortment 1kg", price: 180, category: "Fasteners", stock: 140, rating: 4.1, reviews: 22, description: "Mixed size steel nails for framing and finishing.", image: U("1518709268805-4e9042fe34f4") },
  { id: "p33", name: "Stainless Bolt Set M6", price: 340, category: "Fasteners", stock: 88, rating: 4.6, reviews: 13, description: "Hex bolt and nut set with washers, stainless steel.", image: U("1605157626492-edd0b212e754") },
  { id: "p34", name: "Wall Plugs 8mm (50pc)", price: 120, category: "Fasteners", stock: 175, rating: 4.2, reviews: 30, description: "Nylon wall plugs for secure screw fixing.", image: U("1513827742562-0d9eabf5ea9d") },
  { id: "p35", name: "Rivet Gun Kit", price: 1450, category: "Fasteners", stock: 24, rating: 4.4, reviews: 11, description: "Hand riveter with assorted aluminum rivets.", image: U("1613665813447-55e8aabf46bb") },

  { id: "p36", name: "Toolbox 19in", price: 2200, category: "Tools", stock: 25, rating: 4.5, reviews: 41, description: "Heavy-duty plastic toolbox with metal latches.", image: U("1581578731548-c64695cc6952") },
  { id: "p37", name: "Spirit Level 24in", price: 750, category: "Tools", stock: 38, rating: 4.7, reviews: 19, description: "Aluminium spirit level with three vials.", image: U("1612538496567-6334ec9baa81") },
  { id: "p38", name: "Utility Knife Pro", price: 280, category: "Tools", stock: 95, rating: 4.4, reviews: 47, description: "Retractable utility knife with spare blades.", image: U("1600585154526-990e94668da8") },
  { id: "p39", name: "Workbench Clamp 6in", price: 890, category: "Tools", stock: 31, rating: 4.6, reviews: 26, description: "Cast iron C-clamp for woodworking and metalwork.", image: U("1513468989059-884d9d0d8b24") },
  { id: "p40", name: "Socket Wrench Set 40pc", price: 3200, category: "Tools", stock: 19, rating: 4.8, reviews: 35, description: "Chrome vanadium socket set with ratchet handle.", image: U("1621905251910-48116de21e66") },

  { id: "p41", name: "Extension Board 4-Socket", price: 1200, category: "Electrical", stock: 44, rating: 4.5, reviews: 58, description: "Surge-protected extension board with 2m cable.", image: U("1621905252507-b35492cc74b4") },
  { id: "p42", name: "LED Bulb 12W (4pc)", price: 480, category: "Electrical", stock: 110, rating: 4.6, reviews: 72, description: "Energy-saving cool white LED bulbs, E27 base.", image: U("1473186577051-6b67e7b7a110") },
  { id: "p43", name: "Copper Wire 2.5mm (90m)", price: 8500, category: "Electrical", stock: 15, rating: 4.7, reviews: 28, description: "Single-core copper wire for household wiring.", image: U("1558442074-3c6c7f9100da") },
  { id: "p44", name: "Circuit Breaker 32A", price: 650, category: "Electrical", stock: 52, rating: 4.4, reviews: 17, description: "MCB single pole breaker for distribution boards.", image: U("1621905251189-634802ed38d8") },
  { id: "p45", name: "Digital Multimeter", price: 2800, category: "Electrical", stock: 20, rating: 4.8, reviews: 39, description: "Auto-ranging multimeter for voltage and current testing.", image: U("1581244277943-fe4a9c777189") },

  { id: "p46", name: "Safety Helmet", price: 450, category: "Safety", stock: 80, rating: 4.3, reviews: 45, description: "ISI-marked construction safety helmet with chin strap.", image: U("1595428774223-54855aa50284") },
  { id: "p47", name: "Work Gloves Pair", price: 220, category: "Safety", stock: 150, rating: 4.2, reviews: 63, description: "Cut-resistant coated work gloves, size L.", image: U("1606107550915-1793df606e28") },
  { id: "p48", name: "Safety Goggles", price: 180, category: "Safety", stock: 120, rating: 4.4, reviews: 34, description: "Anti-fog safety goggles for workshop and site work.", image: U("1556228720-195a672e8a03") },
  { id: "p49", name: "Ear Protection Muffs", price: 890, category: "Safety", stock: 35, rating: 4.6, reviews: 21, description: "Noise reduction ear muffs for power tool use.", image: U("1556228577-ef4a3bb2d8b0") },
  { id: "p50", name: "Reflective Safety Vest", price: 320, category: "Safety", stock: 90, rating: 4.1, reviews: 28, description: "High-visibility vest for construction sites.", image: U("1503387767088-15d89c92543b") },

  { id: "p51", name: "Garden Hose 30m", price: 2400, category: "Garden", stock: 26, rating: 4.5, reviews: 32, description: "Flexible PVC garden hose with spray nozzle.", image: U("1504919198541-7e965aac8fce") },
  { id: "p52", name: "Pruning Shears", price: 680, category: "Garden", stock: 40, rating: 4.6, reviews: 19, description: "Sharp bypass pruners for branches up to 20mm.", image: U("1558904541-efa8b8f04918") },
  { id: "p53", name: "Shovel Round Point", price: 1100, category: "Garden", stock: 33, rating: 4.4, reviews: 24, description: "Steel round point shovel with fiberglass handle.", image: U("1585771724684-38269b1e3aac") },
  { id: "p54", name: "Wheelbarrow", price: 6500, category: "Garden", stock: 10, rating: 4.7, reviews: 15, description: "Galvanized tray wheelbarrow with pneumatic tyre.", image: U("1601244617636-877f47c41d9f") },
  { id: "p55", name: "Garden Rake Steel", price: 520, category: "Garden", stock: 48, rating: 4.3, reviews: 11, description: "14-tine steel rake for soil leveling and debris.", image: U("1466692476867-a7c8bcf97f6b") },

  { id: "p56", name: "Portland Cement 50kg", price: 1150, category: "Building Materials", stock: 200, rating: 4.5, reviews: 89, description: "OPC 53 grade cement bag for construction.", image: U("1590608261837-4eb3e2a7ac72") },
  { id: "p57", name: "River Sand 1 CFT", price: 90, category: "Building Materials", stock: 500, rating: 4.2, reviews: 54, description: "Washed river sand for plastering and masonry.", image: U("1541888946425-d81bb19240f5") },
  { id: "p58", name: "Red Bricks (100pc)", price: 14000, category: "Building Materials", stock: 30, rating: 4.6, reviews: 42, description: "First-class burnt clay bricks for wall construction.", image: U("1574662130391-2006c7efac12") },
  { id: "p59", name: "Waterproofing Compound 1L", price: 780, category: "Building Materials", stock: 45, rating: 4.4, reviews: 23, description: "Liquid waterproofing for roofs and bathrooms.", image: U("1600585154340-be6161a56a0c") },
  { id: "p60", name: "Steel Rebar 12mm (12ft)", price: 1650, category: "Building Materials", stock: 75, rating: 4.7, reviews: 38, description: "Grade 60 deformed steel bar for RCC work.", image: U("1489515217757-5fd1be406fef") },
];

export const SEED_PRODUCTS_HTML = SEED_PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  cat: p.category,
  stock: p.stock,
  rating: p.rating,
  reviews: p.reviews,
  desc: p.description,
  image: p.image,
}));
