import type { Product } from "./types";

/**
 * Pexels CDN — every ID was HTTP-checked AND visually verified as clothing/textile.
 * Sources: Lahore fashion shoots (Dhanno), bridal catalogs, men kurta/SK photos, fabric markets.
 */
const P = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop`;

/**
 * 60 Pakistani clothing products — real names + real garment photos (verified).
 */
export const SEED_PRODUCTS: Product[] = [
  // Ladies Shalwar Kameez — verified Pakistani fashion catalog photos
  { id: "p1", name: "Gul Ahmed Lawn 3PC | Charcoal Floral | Stitched", price: 4200, category: "Ladies Shalwar Kameez", stock: 28, rating: 4.8, reviews: 64, description: "Premium lawn 3-piece with pink floral print and lace border. Shirt + dupatta + trouser. Sizes S–XL.", image: P(31323212) },
  { id: "p2", name: "Maria B Style Embroidered Kurta | Powder Blue", price: 3500, category: "Ladies Shalwar Kameez", stock: 35, rating: 4.6, reviews: 41, description: "Soft powder-blue embroidered neckline with lace cuffs. Breathable summer wear.", image: P(36634905) },
  { id: "p3", name: "Sana Safinaz Inspired Lawn | Lavender Pink", price: 6800, category: "Ladies Shalwar Kameez", stock: 14, rating: 4.9, reviews: 52, description: "Lavender-pink lawn with embroidered neck panel and matching dupatta.", image: P(31874437) },
  { id: "p4", name: "Alkaram Embroidered Suit | Pistachio Green", price: 4800, category: "Ladies Shalwar Kameez", stock: 22, rating: 4.7, reviews: 33, description: "Pistachio green embroidered kurta with floral daman and printed dupatta.", image: P(31874439) },
  { id: "p5", name: "Khaadi Teal Lawn 3PC | Floral Dupatta", price: 3900, category: "Ladies Shalwar Kameez", stock: 30, rating: 4.5, reviews: 27, description: "Deep teal lawn with large floral printed dupatta. Eid and daily wear.", image: P(31323178) },
  { id: "p6", name: "Sapphire Formal SK | Black Gold Embroidery", price: 9500, category: "Ladies Shalwar Kameez", stock: 8, rating: 4.9, reviews: 19, description: "Black formal suit with heavy gold embroidery on neckline and hem.", image: P(29413649) },
  { id: "p7", name: "Limelight Floral Lawn | Black Purple Print", price: 2800, category: "Ladies Shalwar Kameez", stock: 45, rating: 4.4, reviews: 58, description: "Black base with purple floral digital print and contrast neck border.", image: P(31323179) },
  { id: "p8", name: "Nishat Navy Embroidered 3PC | Gold Work", price: 7200, category: "Ladies Shalwar Kameez", stock: 12, rating: 4.8, reviews: 24, description: "Navy blue embroidered bib neckline with printed dupatta.", image: P(29413650) },
  { id: "p9", name: "Bonanza Velvet Winter SK | Burgundy", price: 4100, category: "Ladies Shalwar Kameez", stock: 20, rating: 4.6, reviews: 31, description: "Rich burgundy velvet with embroidered dupatta. Winter party wear.", image: P(34688066) },
  { id: "p10", name: "Edenrobe Velvet Embroidered | Deep Maroon", price: 8500, category: "Ladies Shalwar Kameez", stock: 10, rating: 4.7, reviews: 16, description: "Maroon velvet 3-piece with scalloped embroidered dupatta.", image: P(34688066) },
  { id: "p11", name: "Orient Textile Floral Lawn | Charcoal Pink", price: 3200, category: "Ladies Shalwar Kameez", stock: 38, rating: 4.3, reviews: 22, description: "Charcoal floral lawn with embroidered lace hem. Summer collection.", image: P(31323212) },
  { id: "p12", name: "Saeed Ghani Embroidered | Powder Blue Lace", price: 5600, category: "Ladies Shalwar Kameez", stock: 16, rating: 4.7, reviews: 29, description: "Powder blue with white embroidery and lace daman. Festive wear.", image: P(36634905) },
  { id: "p13", name: "Gul Ahmed Swiss Voile | Lilac Embroidery", price: 4400, category: "Ladies Shalwar Kameez", stock: 25, rating: 4.6, reviews: 36, description: "Lilac Swiss voile with geometric embroidered neckline.", image: P(31874437) },
  { id: "p14", name: "Asim Jofa Style Lawn | Pistachio Floral", price: 3700, category: "Ladies Shalwar Kameez", stock: 32, rating: 4.5, reviews: 44, description: "Pistachio green floral embroidery. Artisan lawn collection.", image: P(31874439) },
  { id: "p15", name: "Baroque Teal Party SK | Printed Dupatta", price: 7800, category: "Ladies Shalwar Kameez", stock: 11, rating: 4.8, reviews: 21, description: "Teal party wear with statement floral dupatta.", image: P(31323178) },

  // Gents Shalwar Kameez — verified men in traditional kurta / SK
  { id: "p16", name: "Junaid Jamshed Cotton SK | Classic White", price: 3200, category: "Gents Shalwar Kameez", stock: 40, rating: 4.7, reviews: 72, description: "Pure white cotton shalwar kameez with mandarin collar. Sizes M–XXL.", image: P(8621978) },
  { id: "p17", name: "Bonanza Satrangi Wash & Wear | Cream", price: 2800, category: "Gents Shalwar Kameez", stock: 50, rating: 4.5, reviews: 55, description: "Easy-care cream wash & wear. Ideal for daily and Jummah wear.", image: P(8802650) },
  { id: "p18", name: "Gul Ahmed Kurta + Waistcoat | White Green", price: 5500, category: "Gents Shalwar Kameez", stock: 18, rating: 4.8, reviews: 38, description: "White cotton kurta with forest-green printed Nehru waistcoat.", image: P(13222257) },
  { id: "p19", name: "Alkaram Formal Wedding Set | White Pink", price: 4200, category: "Gents Shalwar Kameez", stock: 24, rating: 4.6, reviews: 29, description: "White Nehru jacket over pink shirt. Wedding guest formal.", image: P(36342211) },
  { id: "p20", name: "Royal Tag Brown Cotton SK | Casual", price: 6500, category: "Gents Shalwar Kameez", stock: 15, rating: 4.9, reviews: 42, description: "Medium-brown cotton shalwar kameez. Everyday traditional wear.", image: P(3632710) },
  { id: "p21", name: "Edwards Khaddar Winter SK | Tan Brown", price: 3800, category: "Gents Shalwar Kameez", stock: 28, rating: 4.5, reviews: 31, description: "Warm tan-brown khaddar style kurta with band collar.", image: P(34616147) },
  { id: "p22", name: "Cambridge White Cotton SK | Slim Fit", price: 2900, category: "Gents Shalwar Kameez", stock: 42, rating: 4.4, reviews: 26, description: "Classic white cotton SK. Slim fit cut for modern look.", image: P(8621978) },
  { id: "p23", name: "Charcoal Waistcoat Formal Set | Green Gold", price: 7200, category: "Gents Shalwar Kameez", stock: 10, rating: 4.8, reviews: 18, description: "White kurta with green-gold printed waistcoat. Wedding ready.", image: P(13222257) },
  { id: "p24", name: "J. Pathani Style SK | Off White", price: 4500, category: "Gents Shalwar Kameez", stock: 20, rating: 4.6, reviews: 34, description: "Pathani-inspired off-white shalwar kameez with front placket.", image: P(8802650) },
  { id: "p25", name: "Outfitters Double Cuff Formal | Ivory", price: 4800, category: "Gents Shalwar Kameez", stock: 16, rating: 4.7, reviews: 22, description: "Ivory formal SK with Nehru jacket styling.", image: P(36342211) },
  { id: "p26", name: "Engine Eid Special SK | Festive White", price: 5200, category: "Gents Shalwar Kameez", stock: 22, rating: 4.8, reviews: 47, description: "Festive white cotton for Eid. Mandarin collar.", image: P(8621978) },
  { id: "p27", name: "Breakout Casual Cotton SK | Brown", price: 2600, category: "Gents Shalwar Kameez", stock: 55, rating: 4.3, reviews: 61, description: "Budget-friendly brown cotton for home and casual wear.", image: P(3632710) },
  { id: "p28", name: "Republic Designer Premium | Kurta Waistcoat", price: 8900, category: "Gents Shalwar Kameez", stock: 8, rating: 4.9, reviews: 15, description: "Designer kurta + waistcoat set. Premium fabric.", image: P(13222257) },
  { id: "p29", name: "ChenOne Boski Blend SK | Cream Group Fit", price: 3400, category: "Gents Shalwar Kameez", stock: 30, rating: 4.5, reviews: 28, description: "Soft boski cream blend. Lightweight and comfortable.", image: P(8802650) },
  { id: "p30", name: "Deepak Perwani Style Wedding | Formal White", price: 12500, category: "Gents Shalwar Kameez", stock: 6, rating: 4.9, reviews: 12, description: "Heavy formal wedding look with white Nehru jacket.", image: P(36342211) },

  // Ladies Kurtas
  { id: "p31", name: "Khaadi Cotton Kurta | Powder Blue Embroidered", price: 2200, category: "Ladies Kurtas", stock: 48, rating: 4.5, reviews: 39, description: "Straight cut powder-blue embroidered kurta. Pair with jeans or trousers.", image: P(36634905) },
  { id: "p32", name: "Limelight Embroidered Kurta | Lavender Pink", price: 3800, category: "Ladies Kurtas", stock: 22, rating: 4.7, reviews: 31, description: "Lavender-pink embroidered kurta with side slits. Sizes S–XL.", image: P(31874437) },
  { id: "p33", name: "Sapphire A-Line Kurta | Pistachio Green", price: 2900, category: "Ladies Kurtas", stock: 35, rating: 4.4, reviews: 24, description: "Pistachio green A-line kurta. Office and college wear.", image: P(31874439) },
  { id: "p34", name: "Gul Ahmed Lawn Kurta | Teal Floral", price: 2500, category: "Ladies Kurtas", stock: 40, rating: 4.3, reviews: 18, description: "Teal lawn kurta with floral print accents.", image: P(31323178) },
  { id: "p35", name: "Outfitters Long Shirt Kurta | Black Gold", price: 3200, category: "Ladies Kurtas", stock: 28, rating: 4.6, reviews: 27, description: "Black long shirt kurta with gold embroidery.", image: P(29413649) },
  { id: "p36", name: "Baroque Mirror Work Style Kurta | Black Floral", price: 4500, category: "Ladies Kurtas", stock: 14, rating: 4.8, reviews: 20, description: "Black purple floral print kurta with contrast neckline.", image: P(31323179) },
  { id: "p37", name: "Generation Palazzo Kurta Set | Navy Gold", price: 5200, category: "Ladies Kurtas", stock: 16, rating: 4.7, reviews: 33, description: "Navy embroidered kurta set with matching trousers.", image: P(29413650) },
  { id: "p38", name: "Crossroads Floral Kurta | Charcoal Pink", price: 2800, category: "Ladies Kurtas", stock: 32, rating: 4.4, reviews: 22, description: "Charcoal floral kurta. Youth and casual collection.", image: P(31323212) },

  // Gents Kurtas
  { id: "p39", name: "Junaid Jamshed Plain Kurta | White Cotton", price: 1800, category: "Gents Kurtas", stock: 60, rating: 4.6, reviews: 85, description: "Classic white cotton kurta. Sizes S–XXL.", image: P(8621978) },
  { id: "p40", name: "Bonanza Embroidered Eid Kurta | Cream", price: 3500, category: "Gents Kurtas", stock: 25, rating: 4.7, reviews: 41, description: "Eid cream kurta. Soft cotton blend.", image: P(8802650) },
  { id: "p41", name: "J. Pathani Kurta | Brown Cotton", price: 2800, category: "Gents Kurtas", stock: 30, rating: 4.5, reviews: 36, description: "Brown pathani-style kurta with stand collar.", image: P(3632710) },
  { id: "p42", name: "Alkaram Linen Kurta | Tan Beige", price: 3200, category: "Gents Kurtas", stock: 22, rating: 4.6, reviews: 28, description: "Tan beige summer kurta. Breathable fabric.", image: P(34616147) },
  { id: "p43", name: "Royal Tag Kurta + Waistcoat Set | Ivory Green", price: 6500, category: "Gents Kurtas", stock: 12, rating: 4.8, reviews: 19, description: "Matching kurta and green waistcoat. Wedding guest favourite.", image: P(13222257) },
  { id: "p44", name: "Engine Printed Kurta | Formal White Jacket", price: 2400, category: "Gents Kurtas", stock: 38, rating: 4.4, reviews: 32, description: "Formal white Nehru-style look for events.", image: P(36342211) },
  { id: "p45", name: "Outfitters Long Kurta | Classic White", price: 2600, category: "Gents Kurtas", stock: 34, rating: 4.5, reviews: 24, description: "Below-knee white kurta with side slits.", image: P(8621978) },
  { id: "p46", name: "Gul Ahmed Festive Kurta | Cream Group", price: 4200, category: "Gents Kurtas", stock: 18, rating: 4.7, reviews: 27, description: "Festive cream kurta for family gatherings.", image: P(8802650) },

  // Formal & Wedding — verified bridal / formal photos
  { id: "p47", name: "Bunto Kazmi Style Bridal Lehenga | Deep Red", price: 45000, category: "Formal & Wedding", stock: 4, rating: 4.9, reviews: 8, description: "Heavy red bridal lehenga with silver embroidery, dupatta and blouse. Custom sizing.", image: P(37615683) },
  { id: "p48", name: "Amir Adnan Style Groom Formal | White Jacket", price: 28000, category: "Formal & Wedding", stock: 5, rating: 4.9, reviews: 11, description: "Groom formal white Nehru jacket set. Wedding collection.", image: P(36342211) },
  { id: "p49", name: "Maria B Bridal Lehenga | Red White Panetar", price: 12000, category: "Formal & Wedding", stock: 9, rating: 4.8, reviews: 16, description: "Red and white bridal lehenga with gold border. Garden wedding look.", image: P(20736212) },
  { id: "p50", name: "Republic Coral Bridal Lehenga | Zardozi", price: 9500, category: "Formal & Wedding", stock: 11, rating: 4.7, reviews: 22, description: "Dusty rose / coral bridal lehenga with heavy gold embroidery.", image: P(32212940) },
  { id: "p51", name: "Sana Safinaz Engagement SK | Burgundy Velvet", price: 15000, category: "Formal & Wedding", stock: 7, rating: 4.8, reviews: 14, description: "Burgundy velvet engagement suit with embroidered dupatta.", image: P(34688066) },
  { id: "p52", name: "Barat Formal Outfit | Kurta Waistcoat Gold", price: 22000, category: "Formal & Wedding", stock: 5, rating: 4.9, reviews: 9, description: "Complete barat look with kurta and printed waistcoat.", image: P(13222257) },

  // Unstitched Fabric — real textile market / fabric roll photos
  { id: "p53", name: "Gul Ahmed Lawn 3PC Unstitched | Market Print", price: 3200, category: "Unstitched Fabric", stock: 50, rating: 4.6, reviews: 67, description: "Premium lawn unstitched: 2.5m shirt, 2m dupatta, 2.5m trouser.", image: P(30698866) },
  { id: "p54", name: "Alkaram Khaddar 2PC Unstitched | Winter Rolls", price: 2800, category: "Unstitched Fabric", stock: 40, rating: 4.5, reviews: 38, description: "Winter khaddar unstitched with printed shawl piece.", image: P(31090803) },
  { id: "p55", name: "Nishat Silk Unstitched 3PC | Formal Textile", price: 5500, category: "Unstitched Fabric", stock: 20, rating: 4.7, reviews: 25, description: "Silk blend 3-piece unstitched for formal stitching.", image: P(31850032) },
  { id: "p56", name: "Limelight Cotton Suit 7m | Value Pack", price: 2200, category: "Unstitched Fabric", stock: 65, rating: 4.4, reviews: 52, description: "7-meter cotton suit piece for home tailoring.", image: P(37203287) },

  // Dupatta & Shawl — real shawl / textile display photos
  { id: "p57", name: "Gul Ahmed Chiffon Dupatta | Embroidered Display", price: 1200, category: "Dupatta & Shawl", stock: 80, rating: 4.5, reviews: 44, description: "Embroidered chiffon-style dupatta. 2.5 yards.", image: P(23749436) },
  { id: "p58", name: "Pashmina Shawl | Kashmiri Embroidery Wall", price: 3500, category: "Dupatta & Shawl", stock: 25, rating: 4.8, reviews: 31, description: "Pashmina-style shawl with Kashmiri floral embroidery.", image: P(23749436) },
  { id: "p59", name: "Net Dupatta Style | Textile Market Pick", price: 1800, category: "Dupatta & Shawl", stock: 45, rating: 4.6, reviews: 28, description: "Party wear dupatta from premium textile selection.", image: P(30698866) },
  { id: "p60", name: "Peshawari Wool Shawl | Winter Collection", price: 2800, category: "Dupatta & Shawl", stock: 30, rating: 4.7, reviews: 19, description: "Warm wool shawl for winter. Unisex.", image: P(37203287) },
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
