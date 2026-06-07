import { supabase, supabaseAdmin } from "../supabase";

// ----------------------------------------------------
// TYPES
// ----------------------------------------------------

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_category_id?: string | null;
  description?: string | null;
  image_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  price: number;
  currency: string;
  material?: string | null;
  dimensions?: string | null;
  is_customizable: boolean;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  media?: ProductMedia[];
}

export interface ProductMedia {
  id: string;
  product_id: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url?: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface LatestCreation {
  id: string;
  title: string;
  description?: string | null;
  product_id?: string | null;
  media_url: string;
  media_type: "image" | "video";
  is_featured: boolean;
  display_order: number;
  created_at: string;
  product?: {
    name: string;
    slug: string;
    sku: string;
  } | null;
}

export interface Settings {
  id: number;
  business_name: string;
  instagram_url?: string | null;
  whatsapp_number?: string | null;
  whatsapp_group_url?: string | null;
  logo_url?: string | null;
  about_text?: string | null;
}

// ----------------------------------------------------
// DETECT MOCK MODE
// ----------------------------------------------------
const isMockMode = 
  !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-supabase-project");

if (isMockMode && typeof window === "undefined") {
  console.log("⚠️ Database URL not set. Running in Mock Data Mode with in-memory storage.");
}

// ----------------------------------------------------
// MOCK DATA STORAGE (In-memory)
// ----------------------------------------------------

const defaultCategories: Category[] = [
  {
    id: "cat-lamps",
    name: "Lamps",
    slug: "lamps",
    description: "Warm ambient lamps, pendant lights, and light covers.",
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
    display_order: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-jewellery-holder",
    name: "Jewellery Holder",
    slug: "jewellery-holder",
    description: "Beautiful modern stands and trays to organize your rings and necklaces.",
    image_url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-pen-holder",
    name: "Pen Holder",
    slug: "pen-holder",
    description: "Geometric desk organizers and pen stands for workspaces.",
    image_url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const defaultProducts: Product[] = [
  {
    id: "prod-cubic-cylinder-lamp",
    sku: "ENV-LMP-001",
    name: "Cubic Texture Cylinder Lamp",
    slug: "cubic-texture-cylinder-lamp",
    short_description: "Elegant cylindrical table lamp featuring a dense 3D cubic pattern on a wooden tripod base.",
    description: "Elevate your space with this stunning cylindrical table lamp featuring an algorithmically generated 3D cubic texture. Crafted from eco-friendly, biodegradable bioplastic, its intricate pattern diffuses a soft, glare-free ambient light. Perfectly mounted on a minimalist wooden base with elegant tripod legs, this piece is an exquisite blend of modern digital design and warm, organic aesthetics. Ideal for bedside tables or study desks.",
    price: 1999.00,
    currency: "INR",
    material: "Biodegradable PLA & Wood base",
    dimensions: "12cm (Diameter) x 22cm (Height)",
    is_customizable: true,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-isometric-cube-lattice-lamp",
    sku: "ENV-LMP-002",
    name: "Isometric Cube Lattice Lamp",
    slug: "isometric-cube-lattice-lamp",
    short_description: "Tall cylindrical table lamp with an isometric cube lattice cutout pattern for dramatic shadow play.",
    description: "A masterpiece of geometry and light. This tall cylindrical lamp features an isometric cube lattice pattern that creates a beautiful play of shadows and warm light on your walls. The open lattice design allows the warm ambient glow to shine through, casting mesmerizing geometric shadows. Crafted from premium matte PLA, it adds a futuristic yet cozy vibe to any living room or workspace.",
    price: 2199.00,
    currency: "INR",
    material: "Biodegradable PLA",
    dimensions: "10cm (Diameter) x 28cm (Height)",
    is_customizable: true,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-honeycomb-lattice-cylinder-lamp",
    sku: "ENV-LMP-003",
    name: "Honeycomb Lattice Cylinder Lamp",
    slug: "honeycomb-lattice-cylinder-lamp",
    short_description: "Tall cylindrical table lamp with an organic honeycomb hexagon cutout pattern.",
    description: "Inspired by the efficiency and beauty of nature, the Honeycomb Lattice Cylinder Lamp features a repeating hexagonal pattern. This structure casts a beautiful, warm honeycomb shadow across your room, creating a cozy and inviting atmosphere. Made with premium, durable bioplastic, this lamp combines clean modern lines with organic geometry. An eye-catching addition to shelves, consoles, or side tables.",
    price: 1899.00,
    currency: "INR",
    material: "Biodegradable PLA",
    dimensions: "10cm (Diameter) x 28cm (Height)",
    is_customizable: true,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-twisted-ribbed-helix-lamp",
    sku: "ENV-LMP-004",
    name: "Twisted Ribbed Helix Lamp",
    slug: "twisted-ribbed-helix-lamp",
    short_description: "Sculptural vase-like table lamp with twisted vertical ridges on dark wooden tripod legs.",
    description: "With its organic, fluid curves and twisted vertical ridges, the Twisted Helix Lamp is as much a sculpture as it is a light source. Its twisted form creates a dynamic visual effect, looking different from every angle. Mounted on elegant, dark wooden tripod feet, it diffuses a warm, relaxing glow that highlights the textured surface. Crafted from sustainable PLA, it is the perfect statement piece for your home.",
    price: 2999.00,
    currency: "INR",
    material: "Biodegradable PLA & Dark Wood base",
    dimensions: "18cm (Diameter) x 26cm (Height)",
    is_customizable: true,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-hourglass-fluted-beacon-lamp",
    sku: "ENV-LMP-005",
    name: "Hourglass Fluted Beacon Lamp",
    slug: "hourglass-fluted-beacon-lamp",
    short_description: "Contemporary twisted hourglass table lamp with fine fluted vertical lines.",
    description: "Showcasing a elegant twisted hourglass silhouette, this fluted beacon lamp features fine vertical lines that trace its twisting form. The fluted texture creates a sophisticated diffusion of warm light, turning any corner into a relaxing sanctuary. Designed with a clean minimalist base, it brings a sleek, contemporary touch to modern interiors. Made from biodegradable materials using precision FDM printing.",
    price: 2499.00,
    currency: "INR",
    material: "Biodegradable PLA",
    dimensions: "14cm (Width) x 14cm (Length) x 25cm (Height)",
    is_customizable: true,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-royal-crown-trinket-dish",
    sku: "ENV-JWL-001",
    name: "Royal Crown Trinket Dish",
    slug: "royal-crown-trinket-dish",
    short_description: "Elegant crown-shaped jewelry dish for holding rings, watches, and bracelets.",
    description: "Add a touch of royalty to your dressing table with this Crown Trinket Dish. Meticulously designed with high-walled crown points that double as secure hangers for your rings, while the spacious circular dish holds your watches, necklaces, and daily accessories. Printed in a premium marble-like texture PLA, it offers a sophisticated stone look with the lightweight durability of eco-friendly bioplastics.",
    price: 999.00,
    currency: "INR",
    material: "Marble-texture PLA",
    dimensions: "14cm (Diameter) x 8cm (Height)",
    is_customizable: true,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-coquette-bow-jewelry-tray",
    sku: "ENV-JWL-002",
    name: "Coquette Bow Jewelry Tray",
    slug: "coquette-bow-jewelry-tray",
    short_description: "Charming pastel pink trinket tray adorned with a beautiful oversized coquette bow.",
    description: "Aesthetic meets organization. This Coquette Bow Jewelry Tray features a smooth pastel pink finish with a beautifully sculpted 3D bow accent. It is the perfect minimalist tray for keeping your favorite rings, earrings, and delicate bracelets safe. Printed using high-grade matte PLA, it has a luxurious soft-touch finish that complements any modern dressing setup.",
    price: 899.00,
    currency: "INR",
    material: "Matte Pink PLA",
    dimensions: "15cm (Width) x 12cm (Length) x 4cm (Height)",
    is_customizable: true,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-brontosaurus-dinosaur-ring-stand",
    sku: "ENV-JWL-003",
    name: "Brontosaurus Dinosaur Ring Stand",
    slug: "brontosaurus-dinosaur-ring-stand",
    short_description: "Playful matte black dinosaur jewelry dish featuring a long neck for stacking rings.",
    description: "Make organizing fun with our Brontosaurus Dinosaur Ring Stand. This charming long-necked dinosaur stands at the center of a circular dish, acting as the perfect vertical spindle to stack your rings safely. The surrounding dish is ideal for holding stud earrings and small trinkets. Printed in a premium matte charcoal black PLA, it brings a modern, playful, and functional accent to your nightstand.",
    price: 799.00,
    currency: "INR",
    material: "Matte Black PLA",
    dimensions: "12cm (Diameter) x 15cm (Height)",
    is_customizable: true,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-daisy-blossom-jewelry-tree",
    sku: "ENV-JWL-004",
    name: "Daisy Blossom Jewelry Tree",
    slug: "daisy-blossom-jewelry-tree",
    short_description: "Vibrant hot pink flower-themed jewelry tree with branches and leaves for rings and earrings.",
    description: "Let your accessories bloom! The Daisy Blossom Jewelry Tree is a delightful hot pink organizer featuring a tall flower stem, leaves, and curving branches designed to hold multiple rings, necklaces, and hoop earrings. The circular base dish provides extra space for larger accessories. Precision 3D printed from high-density, durable bioplastic, this stand is a cheerful and practical centerpiece for your vanity.",
    price: 1199.00,
    currency: "INR",
    material: "High-Gloss Hot Pink PLA",
    dimensions: "13cm (Diameter) x 25cm (Height)",
    is_customizable: true,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-miniature-wardrobe-earring-rack",
    sku: "ENV-JWL-005",
    name: "Miniature Wardrobe Earring Rack",
    slug: "miniature-wardrobe-earring-rack",
    short_description: "Adorable clothing rack jewelry display with mini coat hangers for hanging earrings.",
    description: "The ultimate display for your earring collection. This Miniature Wardrobe Earring Rack replicates a boutique clothing rack, complete with eight tiny, functional coat hangers. Hang your favorite drop and dangle earrings on the hangers and use the peg-board style lower rack for stud earrings. Printed in a natural wood-grain look PLA, it adds an incredibly cute, creative, and neat display to your dressing room table.",
    price: 1299.00,
    currency: "INR",
    material: "Wood-grain PLA",
    dimensions: "18cm (Width) x 8cm (Depth) x 16cm (Height)",
    is_customizable: true,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-sporty-puffer-jacket-pen-holder",
    sku: "ENV-PEN-001",
    name: "Sporty Puffer Jacket Pen Holder",
    slug: "sporty-puffer-jacket-pen-holder",
    short_description: "Cool green puffer-jacket styled desk organizer to hold your favorite pens.",
    description: "Bring a cozy winter vibe to your workspace. This Sporty Puffer Jacket Pen Holder replicates a miniature green down-filled puffer jacket with detailed stitched baffles and a tiny zipper. Printed in vibrant green PLA, it serves as a highly unique and conversational desk organizer. The spacious collar opening holds multiple pens, markers, or highlighters with style.",
    price: 599.00,
    currency: "INR",
    material: "Biodegradable green PLA",
    dimensions: "10cm (Diameter) x 11cm (Height)",
    is_customizable: true,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-medical-doctor-lab-coat-pen-holder",
    sku: "ENV-PEN-002",
    name: "Medical Doctor Lab Coat Pen Holder",
    slug: "medical-doctor-lab-coat-pen-holder",
    short_description: "Clean white doctor's coat themed desk stand with sculpted stethoscope and badge details.",
    description: "The perfect appreciation gift for healthcare heroes or medical students. The Medical Doctor Lab Coat Pen Holder is styled as a professional white doctor's lab coat, featuring detailed lapels, pockets, a miniature stethoscope, and an ID badge. Printed in crisp, premium white PLA, it is an extremely neat and encouraging desk companion for any clinic or study table.",
    price: 699.00,
    currency: "INR",
    material: "Bio-degradable matte white PLA",
    dimensions: "11cm (Width) x 9cm (Depth) x 12cm (Height)",
    is_customizable: true,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-cozy-red-puffer-jacket-pen-holder",
    sku: "ENV-PEN-003",
    name: "Cozy Red Puffer Jacket Pen Holder",
    slug: "cozy-red-puffer-jacket-pen-holder",
    short_description: "Cozy bright red puffer coat desk organizer to hold office stationery.",
    description: "Add a warm splash of color to your workspace. This Cozy Red Puffer Jacket Pen Holder features a detailed red quilted puffer coat design with an open collar ready to store your pens, pencils, and styluses. Crafted with textured layers using precision 3D printing, it offers an incredibly fun and stylish alternative to boring plastic pen cups.",
    price: 599.00,
    currency: "INR",
    material: "Matte Red PLA",
    dimensions: "10cm (Diameter) x 11cm (Height)",
    is_customizable: true,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-athletic-orange-puffer-coat-pen-stand",
    sku: "ENV-PEN-004",
    name: "Athletic Orange Puffer Coat Pen Stand",
    slug: "athletic-orange-puffer-coat-pen-stand",
    short_description: "Athletic orange puffer-jacket styled desk holder with tiny zipper and logo details.",
    description: "Brighten up your desk layout with this athletic-themed Orange Puffer Coat Pen Stand. Styled as a miniature puffed jacket with a white swoosh logo accent, this pen holder blends street fashion and office functionality. Printed in high-visibility bright orange PLA, it keeps your pens and highlighters upright and easily accessible.",
    price: 599.00,
    currency: "INR",
    material: "Glossy Orange PLA",
    dimensions: "10cm (Diameter) x 11cm (Height)",
    is_customizable: true,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-superhero-muscular-torso-pen-holder",
    sku: "ENV-PEN-005",
    name: "Superhero Muscular Torso Pen Holder",
    slug: "superhero-muscular-torso-pen-holder",
    short_description: "Muscular superhero chest themed desk holder with embossed emblem.",
    description: "Unleash your productivity! The Superhero Muscular Torso Pen Holder features a sculpted white muscular chest wearing the iconic 'S' shield. Designed for comic book fans, students, and professionals, this powerful pencil cup holds all your writing gear with heroic strength. Printed in premium matte white PLA, it stands out as an artistic, sculptural desk organizer.",
    price: 799.00,
    currency: "INR",
    material: "Premium Matte White PLA",
    dimensions: "12cm (Width) x 8cm (Depth) x 13cm (Height)",
    is_customizable: true,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const defaultProductMedia: ProductMedia[] = [
  {
    id: "m-cubic-cylinder-lamp-1",
    product_id: "prod-cubic-cylinder-lamp",
    media_type: "image",
    media_url: "/products/media__1780732717856.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-isometric-cube-lattice-lamp-1",
    product_id: "prod-isometric-cube-lattice-lamp",
    media_type: "image",
    media_url: "/products/media__1780732717857.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-honeycomb-lattice-cylinder-lamp-1",
    product_id: "prod-honeycomb-lattice-cylinder-lamp",
    media_type: "image",
    media_url: "/products/media__1780732717858.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-twisted-ribbed-helix-lamp-1",
    product_id: "prod-twisted-ribbed-helix-lamp",
    media_type: "image",
    media_url: "/products/media__1780732717859.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-hourglass-fluted-beacon-lamp-1",
    product_id: "prod-hourglass-fluted-beacon-lamp",
    media_type: "image",
    media_url: "/products/media__1780732717863.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-royal-crown-trinket-dish-1",
    product_id: "prod-royal-crown-trinket-dish",
    media_type: "image",
    media_url: "/products/media__1780733080369.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-coquette-bow-jewelry-tray-1",
    product_id: "prod-coquette-bow-jewelry-tray",
    media_type: "image",
    media_url: "/products/media__1780733080394.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-brontosaurus-dinosaur-ring-stand-1",
    product_id: "prod-brontosaurus-dinosaur-ring-stand",
    media_type: "image",
    media_url: "/products/media__1780733080397.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-daisy-blossom-jewelry-tree-1",
    product_id: "prod-daisy-blossom-jewelry-tree",
    media_type: "image",
    media_url: "/products/media__1780733080398.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-miniature-wardrobe-earring-rack-1",
    product_id: "prod-miniature-wardrobe-earring-rack",
    media_type: "image",
    media_url: "/products/media__1780733080402.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-sporty-puffer-jacket-pen-holder-1",
    product_id: "prod-sporty-puffer-jacket-pen-holder",
    media_type: "image",
    media_url: "/products/media__1780733218184.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-medical-doctor-lab-coat-pen-holder-1",
    product_id: "prod-medical-doctor-lab-coat-pen-holder",
    media_type: "image",
    media_url: "/products/media__1780733218210.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-cozy-red-puffer-jacket-pen-holder-1",
    product_id: "prod-cozy-red-puffer-jacket-pen-holder",
    media_type: "image",
    media_url: "/products/media__1780733218211.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-athletic-orange-puffer-coat-pen-stand-1",
    product_id: "prod-athletic-orange-puffer-coat-pen-stand",
    media_type: "image",
    media_url: "/products/media__1780733218213.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  },
  {
    id: "m-superhero-muscular-torso-pen-holder-1",
    product_id: "prod-superhero-muscular-torso-pen-holder",
    media_type: "image",
    media_url: "/products/media__1780733218224.jpg",
    display_order: 0,
    is_primary: true,
    created_at: new Date().toISOString()
  }
];

const defaultProductCategories: { product_id: string; category_id: string }[] = [
  { product_id: "prod-cubic-cylinder-lamp", category_id: "cat-lamps" },
  { product_id: "prod-isometric-cube-lattice-lamp", category_id: "cat-lamps" },
  { product_id: "prod-honeycomb-lattice-cylinder-lamp", category_id: "cat-lamps" },
  { product_id: "prod-twisted-ribbed-helix-lamp", category_id: "cat-lamps" },
  { product_id: "prod-hourglass-fluted-beacon-lamp", category_id: "cat-lamps" },
  { product_id: "prod-royal-crown-trinket-dish", category_id: "cat-jewellery-holder" },
  { product_id: "prod-coquette-bow-jewelry-tray", category_id: "cat-jewellery-holder" },
  { product_id: "prod-brontosaurus-dinosaur-ring-stand", category_id: "cat-jewellery-holder" },
  { product_id: "prod-daisy-blossom-jewelry-tree", category_id: "cat-jewellery-holder" },
  { product_id: "prod-miniature-wardrobe-earring-rack", category_id: "cat-jewellery-holder" },
  { product_id: "prod-sporty-puffer-jacket-pen-holder", category_id: "cat-pen-holder" },
  { product_id: "prod-medical-doctor-lab-coat-pen-holder", category_id: "cat-pen-holder" },
  { product_id: "prod-cozy-red-puffer-jacket-pen-holder", category_id: "cat-pen-holder" },
  { product_id: "prod-athletic-orange-puffer-coat-pen-stand", category_id: "cat-pen-holder" },
  { product_id: "prod-superhero-muscular-torso-pen-holder", category_id: "cat-pen-holder" }
];

const defaultTags: Tag[] = [
  { id: "t1", name: "minimalist", slug: "minimalist" },
  { id: "t2", name: "organic", slug: "organic" },
  { id: "t3", name: "futuristic", slug: "futuristic" },
  { id: "t4", name: "matte", slug: "matte" }
];

const defaultProductTags: { product_id: string; tag_id: string }[] = [
  { product_id: "prod-cubic-cylinder-lamp", tag_id: "t1" },
  { product_id: "prod-cubic-cylinder-lamp", tag_id: "t4" },
  { product_id: "prod-isometric-cube-lattice-lamp", tag_id: "t3" },
  { product_id: "prod-isometric-cube-lattice-lamp", tag_id: "t1" },
  { product_id: "prod-honeycomb-lattice-cylinder-lamp", tag_id: "t2" },
  { product_id: "prod-honeycomb-lattice-cylinder-lamp", tag_id: "t1" },
  { product_id: "prod-twisted-ribbed-helix-lamp", tag_id: "t2" },
  { product_id: "prod-twisted-ribbed-helix-lamp", tag_id: "t4" },
  { product_id: "prod-hourglass-fluted-beacon-lamp", tag_id: "t1" },
  { product_id: "prod-hourglass-fluted-beacon-lamp", tag_id: "t3" },
  { product_id: "prod-royal-crown-trinket-dish", tag_id: "t1" },
  { product_id: "prod-royal-crown-trinket-dish", tag_id: "t4" },
  { product_id: "prod-coquette-bow-jewelry-tray", tag_id: "t1" },
  { product_id: "prod-brontosaurus-dinosaur-ring-stand", tag_id: "t1" },
  { product_id: "prod-brontosaurus-dinosaur-ring-stand", tag_id: "t4" },
  { product_id: "prod-daisy-blossom-jewelry-tree", tag_id: "t2" },
  { product_id: "prod-miniature-wardrobe-earring-rack", tag_id: "t1" },
  { product_id: "prod-miniature-wardrobe-earring-rack", tag_id: "t2" },
  { product_id: "prod-sporty-puffer-jacket-pen-holder", tag_id: "t1" },
  { product_id: "prod-sporty-puffer-jacket-pen-holder", tag_id: "t4" },
  { product_id: "prod-medical-doctor-lab-coat-pen-holder", tag_id: "t1" },
  { product_id: "prod-cozy-red-puffer-jacket-pen-holder", tag_id: "t1" },
  { product_id: "prod-cozy-red-puffer-jacket-pen-holder", tag_id: "t4" },
  { product_id: "prod-athletic-orange-puffer-coat-pen-stand", tag_id: "t1" },
  { product_id: "prod-superhero-muscular-torso-pen-holder", tag_id: "t3" }
];

const defaultCreations: LatestCreation[] = [
  {
    id: "cr-1",
    title: "Fresh off the printer: Cubic Texture Cylinder Lamp!",
    description: "Watch the intricate cubic patterns catch the warm morning light. Crafted using sustainable bioplastics.",
    product_id: "prod-cubic-cylinder-lamp",
    media_url: "/products/media__1780732717856.jpg",
    media_type: "image",
    is_featured: true,
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: "cr-2",
    title: "Honeycomb shadows are magical.",
    description: "Testing out the diffusion on the Honeycomb Lattice Lamp. Warm cozy evenings guaranteed.",
    product_id: "prod-honeycomb-lattice-cylinder-lamp",
    media_url: "/products/media__1780732717858.jpg",
    media_type: "image",
    is_featured: true,
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: "cr-3",
    title: "Introducing the Coquette Bow Jewelry Tray!",
    description: "The cutest addition to your bedside table. A luxurious matte pastel pink finish featuring an oversized ribbon bow.",
    product_id: "prod-coquette-bow-jewelry-tray",
    media_url: "/products/media__1780733080394.jpg",
    media_type: "image",
    is_featured: true,
    display_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: "cr-4",
    title: "Earrings closet, literally!",
    description: "Check out this adorable Miniature Wardrobe Earring Rack. It comes with tiny hangers to organize your earrings just like clothes.",
    product_id: "prod-miniature-wardrobe-earring-rack",
    media_url: "/products/media__1780733080402.jpg",
    media_type: "image",
    is_featured: true,
    display_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: "cr-5",
    title: "Style up your desk organizer!",
    description: "Vibrant sporty orange puffer jacket styled down-filled pen stand. Keeps all your workspace pens cozy.",
    product_id: "prod-athletic-orange-puffer-coat-pen-stand",
    media_url: "/products/media__1780733218213.jpg",
    media_type: "image",
    is_featured: true,
    display_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: "cr-6",
    title: "Medical heroes appreciation gift!",
    description: "Introducing the sculpted Doctor Lab Coat Pen Holder, customized with stethoscope and name tags.",
    product_id: "prod-medical-doctor-lab-coat-pen-holder",
    media_url: "/products/media__1780733218210.jpg",
    media_type: "image",
    is_featured: true,
    display_order: 6,
    created_at: new Date().toISOString()
  }
];

let mockSettings: Settings = {
  id: 1,
  business_name: "Envision 3D (Demo)",
  instagram_url: "https://www.instagram.com/envision_.3d/",
  whatsapp_number: "+1234567890",
  whatsapp_group_url: "https://chat.whatsapp.com/Lg0MttFqr8h4RHOxnWNJGv?mode=gi_t",
  logo_url: "",
  about_text: "We build premium, custom-designed 3D printed planters, vases, lights, and modern home decor pieces. Running inside custom Mock In-Memory Database Mode.",
};

// Mutable runtime state copies
let categoriesMemory = [...defaultCategories];
let productsMemory = [...defaultProducts];
let mediaMemory = [...defaultProductMedia];
let productCategoriesMemory = [...defaultProductCategories];
let productTagsMemory = [...defaultProductTags];
let tagsMemory = [...defaultTags];
let creationsMemory = [...defaultCreations];

// ----------------------------------------------------
// CUSTOMER-FACING QUERIES
// ----------------------------------------------------

export async function getCategories(onlyActive = true): Promise<Category[]> {
  if (isMockMode) {
    return onlyActive ? categoriesMemory.filter(c => c.is_active) : categoriesMemory;
  }

  let query = supabase.from("categories").select("*").order("display_order", { ascending: true });
  if (onlyActive) {
    query = query.eq("is_active", true);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isMockMode) {
    return categoriesMemory.find(c => c.slug === slug) || null;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }
  return data;
}

export async function getProducts(options?: {
  onlyActive?: boolean;
  onlyFeatured?: boolean;
  categorySlug?: string;
  searchQuery?: string;
}): Promise<(Product & { 
  primary_media_url?: string; 
  product_categories?: { category_id: string }[];
})[]> {
  const onlyActive = options?.onlyActive ?? true;
  const onlyFeatured = options?.onlyFeatured ?? false;
  const categorySlug = options?.categorySlug;
  const searchQuery = options?.searchQuery;

  if (isMockMode) {
    let prods = [...productsMemory];
    if (onlyActive) prods = prods.filter(p => p.is_active);
    if (onlyFeatured) prods = prods.filter(p => p.is_featured);

    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      prods = prods.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description || "").toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q)
      );
    }

    if (categorySlug) {
      const cat = categoriesMemory.find(c => c.slug === categorySlug);
      if (cat) {
        const subCatIds = categoriesMemory
          .filter(c => c.parent_category_id === cat.id)
          .map(c => c.id);
        const categoryIds = [cat.id, ...subCatIds];

        const allowedIds = new Set(
          productCategoriesMemory
            .filter(pc => categoryIds.includes(pc.category_id))
            .map(pc => pc.product_id)
        );
        prods = prods.filter(p => allowedIds.has(p.id));
      } else {
        prods = [];
      }
    }

    return prods.map(p => {
      const mediaList = mediaMemory.filter(m => m.product_id === p.id);
      const sortedMedia = mediaList.sort(
        (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order
      );
      const matchedCatIds = productCategoriesMemory
        .filter(pc => pc.product_id === p.id)
        .map(pc => ({ category_id: pc.category_id }));
      return {
        ...p,
        primary_media_url: sortedMedia[0]?.media_url || undefined,
        media: sortedMedia,
        product_categories: matchedCatIds,
      };
    });
  }

  let query = supabase
    .from("products")
    .select(`
      *,
      product_media (id, media_type, media_url, display_order, is_primary),
      product_categories (category_id)
    `);

  if (onlyActive) {
    query = query.eq("is_active", true);
  }
  if (onlyFeatured) {
    query = query.eq("is_featured", true);
  }

  if (searchQuery && searchQuery.trim() !== "") {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  let products = (data || []) as any[];

  if (categorySlug) {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (catData) {
      const { data: subCats } = await supabase
        .from("categories")
        .select("id")
        .eq("parent_category_id", catData.id);

      const categoryIds = [catData.id, ...(subCats || []).map(sc => sc.id)];

      const { data: joinData } = await supabase
        .from("product_categories")
        .select("product_id")
        .in("category_id", categoryIds);
      
      const allowedIds = new Set((joinData || []).map(j => j.product_id));
      products = products.filter(p => allowedIds.has(p.id));
    } else {
      products = [];
    }
  }

  return products.map(p => {
    const sortedMedia = (p.product_media || []).sort(
      (a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order
    );
    return {
      ...p,
      primary_media_url: sortedMedia[0]?.media_url || undefined,
      media: sortedMedia,
      product_categories: p.product_categories || [],
    };
  });
}

export async function getProductBySlug(slug: string): Promise<(Product & { 
  media: ProductMedia[]; 
  categories: Category[];
  tags: Tag[];
}) | null> {
  if (isMockMode) {
    const product = productsMemory.find(p => p.slug === slug);
    if (!product) return null;

    const mediaList = mediaMemory
      .filter(m => m.product_id === product.id)
      .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order);

    const matchedCatIds = new Set(productCategoriesMemory.filter(pc => pc.product_id === product.id).map(pc => pc.category_id));
    const categories = categoriesMemory.filter(c => matchedCatIds.has(c.id));

    const matchedTagIds = new Set(productTagsMemory.filter(pt => pt.product_id === product.id).map(pt => pt.tag_id));
    const tags = tagsMemory.filter(t => matchedTagIds.has(t.id));

    return {
      ...product,
      media: mediaList,
      categories,
      tags,
    };
  }

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_media (id, product_id, media_type, media_url, thumbnail_url, display_order, is_primary, created_at)
    `)
    .eq("slug", slug)
    .single();

  if (error || !product) {
    console.error("Error fetching product by slug:", error);
    return null;
  }

  const { data: catJoins } = await supabase
    .from("product_categories")
    .select("categories (*)")
    .eq("product_id", product.id);

  const categories = (catJoins || []).map((c: any) => c.categories).filter(Boolean);

  const { data: tagJoins } = await supabase
    .from("product_tags")
    .select("tags (*)")
    .eq("product_id", product.id);

  const tags = (tagJoins || []).map((t: any) => t.tags).filter(Boolean);

  const sortedMedia = (product.product_media || []).sort(
    (a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order
  );

  return {
    ...product,
    media: sortedMedia,
    categories,
    tags,
  };
}

export async function getLatestCreations(options?: { onlyFeatured?: boolean }): Promise<LatestCreation[]> {
  if (isMockMode) {
    let list = [...creationsMemory];
    if (options?.onlyFeatured) {
      list = list.filter(c => c.is_featured);
    }
    // Sort mock mode creations: display_order ascending, then created_at descending
    list.sort((a, b) => {
      const orderA = a.display_order ?? 0;
      const orderB = b.display_order ?? 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    return list.map(c => {
      const prod = productsMemory.find(p => p.id === c.product_id);
      return {
        ...c,
        product: prod ? { name: prod.name, slug: prod.slug, sku: prod.sku } : null
      };
    });
  }

  let query = supabase
    .from("latest_creations")
    .select(`
      *,
      products (name, slug, sku)
    `)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (options?.onlyFeatured) {
    query = query.eq("is_featured", true);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching latest creations:", error);
    return [];
  }

  return (data || []).map((item: any) => ({
    ...item,
    product: item.products,
  }));
}

export async function getProductsForSearch(): Promise<{
  id: string;
  sku: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  price: number;
  currency: string;
  is_customizable: boolean;
  primary_media_url?: string | null;
  categoryNames: string[];
  tagNames: string[];
}[]> {
  if (isMockMode) {
    return productsMemory.filter(p => p.is_active).map(p => {
      const mediaList = mediaMemory.filter(m => m.product_id === p.id);
      const sortedMedia = mediaList.sort(
        (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order
      );

      const matchedCatIds = new Set(productCategoriesMemory.filter(pc => pc.product_id === p.id).map(pc => pc.category_id));
      const categoryNames = categoriesMemory.filter(c => matchedCatIds.has(c.id)).map(c => c.name);

      const matchedTagIds = new Set(productTagsMemory.filter(pt => pt.product_id === p.id).map(pt => pt.tag_id));
      const tagNames = tagsMemory.filter(t => matchedTagIds.has(t.id)).map(t => t.name);

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        short_description: p.short_description,
        description: p.description,
        price: Number(p.price),
        currency: p.currency,
        is_customizable: p.is_customizable,
        primary_media_url: sortedMedia[0]?.media_url || null,
        categoryNames,
        tagNames,
      };
    });
  }

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_media (media_url, display_order, is_primary),
      product_categories (categories (name)),
      product_tags (tags (name))
    `)
    .eq("is_active", true);

  if (error) {
    console.error("Search query error:", error);
    return [];
  }

  return (data || []).map((p: any) => {
    const sortedMedia = (p.product_media || []).sort(
      (a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order
    );

    return {
      id: p.id,
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      short_description: p.short_description,
      description: p.description,
      price: Number(p.price),
      currency: p.currency,
      is_customizable: p.is_customizable,
      primary_media_url: sortedMedia[0]?.media_url || null,
      categoryNames: (p.product_categories || [])
        .map((pc: any) => pc.categories?.name)
        .filter(Boolean),
      tagNames: (p.product_tags || [])
        .map((pt: any) => pt.tags?.name)
        .filter(Boolean),
    };
  });
}

export async function getSettings(): Promise<Settings> {
  if (isMockMode) {
    return mockSettings;
  }

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching settings:", error);
    return {
      id: 1,
      business_name: "Envision 3D",
      instagram_url: "https://www.instagram.com/envision_.3d/",
      whatsapp_number: "+1234567890",
      whatsapp_group_url: "https://chat.whatsapp.com/Lg0MttFqr8h4RHOxnWNJGv?mode=gi_t",
      logo_url: "",
      about_text: "Premium 3D printed planters, home decor and custom lamps.",
    };
  }

  return data;
}

// ----------------------------------------------------
// ADMIN ONLY OPERATIONS (Uses supabaseAdmin client)
// ----------------------------------------------------

export async function getAdminByEmail(email: string) {
  if (isMockMode) {
    if (email === "admin@envision3d.com") {
      return {
        id: "mock-admin",
        name: "Mock Admin",
        email: "admin@envision3d.com",
        password_hash: "$2b$10$ZS5uNI3f1qZOYPwceMhvY.ohUlKo7JZQTRei4I0SHQL6AfDsF7WOq", // bcrypt for 'admin123'
      };
    }
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("admins")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return null;
  }
  return data;
}

export async function updateSettingsAdmin(data: Partial<Settings>) {
  if (isMockMode) {
    mockSettings = { ...mockSettings, ...data };
    return mockSettings;
  }

  const { data: updated, error } = await supabaseAdmin
    .from("settings")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update settings: ${error.message}`);
  }
  return updated;
}

// Product CRUD
export async function createProductAdmin(
  product: Omit<Product, "id" | "created_at" | "updated_at">,
  categoryIds: string[],
  tagNames: string[]
) {
  if (isMockMode) {
    const newProd: Product = {
      ...product,
      id: `p-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    productsMemory.push(newProd);

    // Categories join
    categoryIds.forEach(cid => {
      productCategoriesMemory.push({ product_id: newProd.id, category_id: cid });
    });

    // Tags link
    tagNames.forEach(name => {
      let tag = tagsMemory.find(t => t.name === name);
      if (!tag) {
        tag = { id: `t-${Date.now()}-${Math.random()}`, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") };
        tagsMemory.push(tag);
      }
      productTagsMemory.push({ product_id: newProd.id, tag_id: tag.id });
    });

    return newProd;
  }

  const { data: newProd, error: prodErr } = await supabaseAdmin
    .from("products")
    .insert(product)
    .select()
    .single();

  if (prodErr || !newProd) {
    throw new Error(`Product creation failed: ${prodErr?.message}`);
  }

  if (categoryIds.length > 0) {
    const catRows = categoryIds.map(cid => ({
      product_id: newProd.id,
      category_id: cid,
    }));
    await supabaseAdmin.from("product_categories").insert(catRows);
  }

  if (tagNames.length > 0) {
    for (const name of tagNames) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const { data: tagData } = await supabaseAdmin
        .from("tags")
        .upsert({ name, slug }, { onConflict: "slug" })
        .select()
        .single();

      if (tagData) {
        await supabaseAdmin
          .from("product_tags")
          .insert({ product_id: newProd.id, tag_id: tagData.id });
      }
    }
  }

  return newProd;
}

export async function updateProductAdmin(
  id: string,
  product: Partial<Omit<Product, "id" | "created_at" | "updated_at">>,
  categoryIds?: string[],
  tagNames?: string[]
) {
  if (isMockMode) {
    const idx = productsMemory.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Product not found");

    productsMemory[idx] = {
      ...productsMemory[idx],
      ...product,
      updated_at: new Date().toISOString(),
    };

    if (categoryIds !== undefined) {
      productCategoriesMemory = productCategoriesMemory.filter(pc => pc.product_id !== id);
      categoryIds.forEach(cid => {
        productCategoriesMemory.push({ product_id: id, category_id: cid });
      });
    }

    if (tagNames !== undefined) {
      productTagsMemory = productTagsMemory.filter(pt => pt.product_id !== id);
      tagNames.forEach(name => {
        let tag = tagsMemory.find(t => t.name === name);
        if (!tag) {
          tag = { id: `t-${Date.now()}-${Math.random()}`, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") };
          tagsMemory.push(tag);
        }
        productTagsMemory.push({ product_id: id, tag_id: tag.id });
      });
    }

    return productsMemory[idx];
  }

  const { data: updated, error: prodErr } = await supabaseAdmin
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (prodErr || !updated) {
    throw new Error(`Product update failed: ${prodErr?.message}`);
  }

  if (categoryIds !== undefined) {
    await supabaseAdmin.from("product_categories").delete().eq("product_id", id);
    if (categoryIds.length > 0) {
      const catRows = categoryIds.map(cid => ({
        product_id: id,
        category_id: cid,
      }));
      await supabaseAdmin.from("product_categories").insert(catRows);
    }
  }

  if (tagNames !== undefined) {
    await supabaseAdmin.from("product_tags").delete().eq("product_id", id);
    for (const name of tagNames) {
      if (!name.trim()) continue;
      const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
      const { data: tagData } = await supabaseAdmin
        .from("tags")
        .upsert({ name: name.trim(), slug }, { onConflict: "slug" })
        .select()
        .single();

      if (tagData) {
        await supabaseAdmin
          .from("product_tags")
          .insert({ product_id: id, tag_id: tagData.id });
      }
    }
  }

  return updated;
}

export async function deleteProductAdmin(id: string) {
  if (isMockMode) {
    productsMemory = productsMemory.filter(p => p.id !== id);
    mediaMemory = mediaMemory.filter(m => m.product_id !== id);
    productCategoriesMemory = productCategoriesMemory.filter(pc => pc.product_id !== id);
    productTagsMemory = productTagsMemory.filter(pt => pt.product_id !== id);
    return true;
  }

  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
  return true;
}

// Media CRUD
export async function addProductMediaAdmin(media: Omit<ProductMedia, "id" | "created_at">) {
  if (isMockMode) {
    const item: ProductMedia = {
      ...media,
      id: `m-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    mediaMemory.push(item);
    return item;
  }

  const { data, error } = await supabaseAdmin
    .from("product_media")
    .insert(media)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add product media: ${error.message}`);
  }
  return data;
}

export async function deleteProductMediaAdmin(mediaId: string) {
  if (isMockMode) {
    mediaMemory = mediaMemory.filter(m => m.id !== mediaId);
    return true;
  }

  const { error } = await supabaseAdmin
    .from("product_media")
    .delete()
    .eq("id", mediaId);

  if (error) {
    throw new Error(`Failed to delete product media: ${error.message}`);
  }
  return true;
}

export async function setPrimaryProductMediaAdmin(productId: string, mediaId: string) {
  if (isMockMode) {
    mediaMemory = mediaMemory.map(m => {
      if (m.product_id === productId) {
        return { ...m, is_primary: m.id === mediaId };
      }
      return m;
    });
    return mediaMemory.find(m => m.id === mediaId) || null;
  }

  await supabaseAdmin
    .from("product_media")
    .update({ is_primary: false })
    .eq("product_id", productId);

  const { data, error } = await supabaseAdmin
    .from("product_media")
    .update({ is_primary: true })
    .eq("id", mediaId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to set primary media: ${error.message}`);
  }
  return data;
}

// Category CRUD
export async function createCategoryAdmin(category: Omit<Category, "id" | "created_at" | "updated_at">) {
  if (isMockMode) {
    const item: Category = {
      ...category,
      id: `c-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    categoriesMemory.push(item);
    return item;
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }
  return data;
}

export async function updateCategoryAdmin(id: string, category: Partial<Omit<Category, "id" | "created_at" | "updated_at">>) {
  if (isMockMode) {
    const idx = categoriesMemory.findIndex(c => c.id === id);
    if (idx === -1) throw new Error("Category not found");
    categoriesMemory[idx] = {
      ...categoriesMemory[idx],
      ...category,
      updated_at: new Date().toISOString(),
    };
    return categoriesMemory[idx];
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update category: ${error.message}`);
  }
  return data;
}

export async function deleteCategoryAdmin(id: string) {
  if (isMockMode) {
    categoriesMemory = categoriesMemory.filter(c => c.id !== id);
    productCategoriesMemory = productCategoriesMemory.filter(pc => pc.category_id !== id);
    return true;
  }

  const { error } = await supabaseAdmin
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete category: ${error.message}`);
  }
  return true;
}

// Creations CRUD
export async function createLatestCreationAdmin(creation: Omit<LatestCreation, "id" | "created_at">) {
  if (isMockMode) {
    const item: LatestCreation = {
      ...creation,
      id: `cr-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    creationsMemory.push(item);
    return item;
  }

  const { data, error } = await supabaseAdmin
    .from("latest_creations")
    .insert(creation)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create latest creation: ${error.message}`);
  }
  return data;
}

export async function updateLatestCreationAdmin(id: string, creation: Partial<Omit<LatestCreation, "id" | "created_at">>) {
  if (isMockMode) {
    const idx = creationsMemory.findIndex(c => c.id === id);
    if (idx === -1) throw new Error("Creation log not found");
    creationsMemory[idx] = {
      ...creationsMemory[idx],
      ...creation,
    };
    return creationsMemory[idx];
  }

  const { data, error } = await supabaseAdmin
    .from("latest_creations")
    .update(creation)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update latest creation: ${error.message}`);
  }
  return data;
}

export async function deleteLatestCreationAdmin(id: string) {
  if (isMockMode) {
    creationsMemory = creationsMemory.filter(c => c.id !== id);
    return true;
  }

  const { error } = await supabaseAdmin
    .from("latest_creations")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete latest creation: ${error.message}`);
  }
  return true;
}
