-- SQL Schema for Envision 3D Catalog
-- Execute this script in your Supabase SQL Editor.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS product_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS latest_creations CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS product_media CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 1. Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR' NOT NULL,
  material VARCHAR(255),
  dimensions VARCHAR(255),
  is_customizable BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Product Categories Join Table
CREATE TABLE product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- 4. Product Media Table (Multiple images / short videos)
CREATE TABLE product_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  media_type VARCHAR(50) CHECK (media_type IN ('image', 'video')) NOT NULL,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tags Table
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- 6. Product Tags Join Table
CREATE TABLE product_tags (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- 7. Latest Creations Table
CREATE TABLE latest_creations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  media_url TEXT NOT NULL,
  media_type VARCHAR(50) CHECK (media_type IN ('image', 'video')) NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Settings Table (Single Row constraint enforced by ID = 1)
CREATE TABLE settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name VARCHAR(255) DEFAULT 'Envision 3D' NOT NULL,
  instagram_url TEXT,
  whatsapp_number VARCHAR(50),
  whatsapp_group_url TEXT,
  logo_url TEXT,
  about_text TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Admins Table
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for Fast Search
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || coalesce(description, '')));
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_timestamp_categories
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_products
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_settings
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- Seed Initial Admin User (Default credentials: admin@envision3d.com / admin123)
INSERT INTO admins (name, email, password_hash)
VALUES ('Envision Admin', 'admin@envision3d.com', '$2b$10$ZS5uNI3f1qZOYPwceMhvY.ohUlKo7JZQTRei4I0SHQL6AfDsF7WOq')
ON CONFLICT (email) DO NOTHING;

-- Seed Default Settings
INSERT INTO settings (id, business_name, instagram_url, whatsapp_number, whatsapp_group_url, logo_url, about_text)
VALUES (1, 'Envision 3D', 'https://www.instagram.com/envision_.3d/', '+1234567890', 'https://chat.whatsapp.com/Lg0MttFqr8h4RHOxnWNJGv?mode=gi_t', '', 'We build premium, custom-designed 3D printed planters, vases, lights, and modern home decor pieces.')
ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  instagram_url = EXCLUDED.instagram_url,
  whatsapp_number = EXCLUDED.whatsapp_number,
  whatsapp_group_url = EXCLUDED.whatsapp_group_url,
  about_text = EXCLUDED.about_text;

-- Seed Default Categories
INSERT INTO categories (id, name, slug, description, display_order, is_active)
VALUES 
  ('c1111111-1111-1111-1111-111111111111', 'Lamps', 'lamps', 'Warm ambient lamps, pendant lights, and light covers.', 0, TRUE),
  ('c2222222-2222-2222-2222-222222222222', 'Jewellery Holder', 'jewellery-holder', 'Beautiful modern stands and trays to organize your rings and necklaces.', 1, TRUE),
  ('c3333333-3333-3333-3333-333333333333', 'Pen Holder', 'pen-holder', 'Geometric desk organizers and pen stands for workspaces.', 2, TRUE);

-- Seed Default Products
INSERT INTO products (id, sku, name, slug, short_description, description, price, currency, material, dimensions, is_customizable, is_featured, is_active)
VALUES 
  (
    'f1111111-1111-1111-1111-111111111111', 
    'ENV-LMP-001', 
    'Cubic Texture Cylinder Lamp', 
    'cubic-texture-cylinder-lamp', 
    'Elegant cylindrical table lamp featuring a dense 3D cubic pattern on a wooden tripod base.', 
    'Elevate your space with this stunning cylindrical table lamp featuring an algorithmically generated 3D cubic texture. Crafted from eco-friendly, biodegradable bioplastic, its intricate pattern diffuses a soft, glare-free ambient light. Perfectly mounted on a minimalist wooden base with elegant tripod legs, this piece is an exquisite blend of modern digital design and warm, organic aesthetics. Ideal for bedside tables or study desks.', 
    1999.00, 
    'INR', 
    'Biodegradable PLA & Wood base', 
    '12cm (Diameter) x 22cm (Height)', 
    TRUE, 
    TRUE, 
    TRUE
  ),
  (
    'f2222222-2222-2222-2222-222222222222', 
    'ENV-LMP-002', 
    'Isometric Cube Lattice Lamp', 
    'isometric-cube-lattice-lamp', 
    'Tall cylindrical table lamp with an isometric cube lattice cutout pattern for dramatic shadow play.', 
    'A masterpiece of geometry and light. This tall cylindrical lamp features an isometric cube lattice pattern that creates a beautiful play of shadows and warm light on your walls. The open lattice design allows the warm ambient glow to shine through, casting mesmerizing geometric shadows. Crafted from premium matte PLA, it adds a futuristic yet cozy vibe to any living room or workspace.', 
    2199.00, 
    'INR', 
    'Biodegradable PLA', 
    '10cm (Diameter) x 28cm (Height)', 
    TRUE, 
    TRUE, 
    TRUE
  ),
  (
    'f3333333-3333-3333-3333-333333333333', 
    'ENV-LMP-003', 
    'Honeycomb Lattice Cylinder Lamp', 
    'honeycomb-lattice-cylinder-lamp', 
    'Tall cylindrical table lamp with an organic honeycomb hexagon cutout pattern.', 
    'Inspired by the efficiency and beauty of nature, the Honeycomb Lattice Cylinder Lamp features a repeating hexagonal pattern. This structure casts a beautiful, warm honeycomb shadow across your room, creating a cozy and inviting atmosphere. Made with premium, durable bioplastic, this lamp combines clean modern lines with organic geometry. An eye-catching addition to shelves, consoles, or side tables.', 
    1899.00, 
    'INR', 
    'Biodegradable PLA', 
    '10cm (Diameter) x 28cm (Height)', 
    TRUE, 
    FALSE, 
    TRUE
  ),
  (
    'f4444444-4444-4444-4444-444444444444', 
    'ENV-LMP-004', 
    'Twisted Ribbed Helix Lamp', 
    'twisted-ribbed-helix-lamp', 
    'Sculptural vase-like table lamp with twisted vertical ridges on dark wooden tripod legs.', 
    'With its organic, fluid curves and twisted vertical ridges, the Twisted Helix Lamp is as much a sculpture as it is a light source. Its twisted form creates a dynamic visual effect, looking different from every angle. Mounted on elegant, dark wooden tripod feet, it diffuses a warm, relaxing glow that highlights the textured surface. Crafted from sustainable PLA, it is the perfect statement piece for your home.', 
    2999.00, 
    'INR', 
    'Biodegradable PLA & Dark Wood base', 
    '18cm (Diameter) x 26cm (Height)', 
    TRUE, 
    TRUE, 
    TRUE
  ),
  (
    'f5555555-5555-5555-5555-555555555555', 
    'ENV-LMP-005', 
    'Hourglass Fluted Beacon Lamp', 
    'hourglass-fluted-beacon-lamp', 
    'Contemporary twisted hourglass table lamp with fine fluted vertical lines.', 
    'Showcasing a elegant twisted hourglass silhouette, this fluted beacon lamp features fine vertical lines that trace its twisting form. The fluted texture creates a sophisticated diffusion of warm light, turning any corner into a relaxing sanctuary. Designed with a clean minimalist base, it brings a sleek, contemporary touch to modern interiors. Made from biodegradable materials using precision FDM printing.', 
    2499.00, 
    'INR', 
    'Biodegradable PLA', 
    '14cm (Width) x 14cm (Length) x 25cm (Height)', 
    TRUE, 
    FALSE, 
    TRUE
  ),
  (
    'f6666666-6666-6666-6666-666666666666', 
    'ENV-JWL-001', 
    'Royal Crown Trinket Dish', 
    'royal-crown-trinket-dish', 
    'Elegant crown-shaped jewelry dish for holding rings, watches, and bracelets.', 
    'Add a touch of royalty to your dressing table with this Crown Trinket Dish. Meticulously designed with high-walled crown points that double as secure hangers for your rings, while the spacious circular dish holds your watches, necklaces, and daily accessories. Printed in a premium marble-like texture PLA, it offers a sophisticated stone look with the lightweight durability of eco-friendly bioplastics.', 
    999.00, 
    'INR', 
    'Marble-texture PLA', 
    '14cm (Diameter) x 8cm (Height)', 
    TRUE, 
    TRUE, 
    TRUE
  ),
  (
    'f7777777-7777-7777-7777-777777777777', 
    'ENV-JWL-002', 
    'Coquette Bow Jewelry Tray', 
    'coquette-bow-jewelry-tray', 
    'Charming pastel pink trinket tray adorned with a beautiful oversized coquette bow.', 
    'Aesthetic meets organization. This Coquette Bow Jewelry Tray features a smooth pastel pink finish with a beautifully sculpted 3D bow accent. It is the perfect minimalist tray for keeping your favorite rings, earrings, and delicate bracelets safe. Printed using high-grade matte PLA, it has a luxurious soft-touch finish that complements any modern dressing setup.', 
    899.00, 
    'INR', 
    'Matte Pink PLA', 
    '15cm (Width) x 12cm (Length) x 4cm (Height)', 
    TRUE, 
    TRUE, 
    TRUE
  ),
  (
    'f8888888-8888-8888-8888-888888888888', 
    'ENV-JWL-003', 
    'Brontosaurus Dinosaur Ring Stand', 
    'brontosaurus-dinosaur-ring-stand', 
    'Playful matte black dinosaur jewelry dish featuring a long neck for stacking rings.', 
    'Make organizing fun with our Brontosaurus Dinosaur Ring Stand. This charming long-necked dinosaur stands at the center of a circular dish, acting as the perfect vertical spindle to stack your rings safely. The surrounding dish is ideal for holding stud earrings and small trinkets. Printed in a premium matte charcoal black PLA, it brings a modern, playful, and functional accent to your nightstand.', 
    799.00, 
    'INR', 
    'Matte Black PLA', 
    '12cm (Diameter) x 15cm (Height)', 
    TRUE, 
    FALSE, 
    TRUE
  ),
  (
    'f9999999-9999-9999-9999-999999999999', 
    'ENV-JWL-004', 
    'Daisy Blossom Jewelry Tree', 
    'daisy-blossom-jewelry-tree', 
    'Vibrant hot pink flower-themed jewelry tree with branches and leaves for rings and earrings.', 
    'Let your accessories bloom! The Daisy Blossom Jewelry Tree is a delightful hot pink organizer featuring a tall flower stem, leaves, and curving branches designed to hold multiple rings, necklaces, and hoop earrings. The circular base dish provides extra space for larger accessories. Precision 3D printed from high-density, durable bioplastic, this stand is a cheerful and practical centerpiece for your vanity.', 
    1199.00, 
    'INR', 
    'High-Gloss Hot Pink PLA', 
    '13cm (Diameter) x 25cm (Height)', 
    TRUE, 
    TRUE, 
    TRUE
  ),
  (
    'faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
    'ENV-JWL-005', 
    'Miniature Wardrobe Earring Rack', 
    'miniature-wardrobe-earring-rack', 
    'Adorable clothing rack jewelry display with mini coat hangers for hanging earrings.', 
    'The ultimate display for your earring collection. This Miniature Wardrobe Earring Rack replicates a boutique clothing rack, complete with eight tiny, functional coat hangers. Hang your favorite drop and dangle earrings on the hangers and use the peg-board style lower rack for stud earrings. Printed in a natural wood-grain look PLA, it adds an incredibly cute, creative, and neat display to your dressing room table.', 
    1299.00, 
    'INR', 
    'Wood-grain PLA', 
    '18cm (Width) x 8cm (Depth) x 16cm (Height)', 
    TRUE, 
    FALSE, 
    TRUE
  ),
  (
    'fbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
    'ENV-PEN-001', 
    'Sporty Puffer Jacket Pen Holder', 
    'sporty-puffer-jacket-pen-holder', 
    'Cool green puffer-jacket styled desk organizer to hold your favorite pens.', 
    'Bring a cozy winter vibe to your workspace. This Sporty Puffer Jacket Pen Holder replicates a miniature green down-filled puffer jacket with detailed stitched baffles and a tiny zipper. Printed in vibrant green PLA, it serves as a highly unique and conversational desk organizer. The spacious collar opening holds multiple pens, markers, or highlighters with style.', 
    599.00, 
    'INR', 
    'Biodegradable green PLA', 
    '10cm (Diameter) x 11cm (Height)', 
    TRUE, 
    TRUE, 
    TRUE
  ),
  (
    'fccccccc-cccc-cccc-cccc-cccccccccccc', 
    'ENV-PEN-002', 
    'Medical Doctor Lab Coat Pen Holder', 
    'medical-doctor-lab-coat-pen-holder', 
    'Clean white doctor''s coat themed desk stand with sculpted stethoscope and badge details.', 
    'The perfect appreciation gift for healthcare heroes or medical students. The Medical Doctor Lab Coat Pen Holder is styled as a professional white doctor''s lab coat, featuring detailed lapels, pockets, a miniature stethoscope, and an ID badge. Printed in crisp, premium white PLA, it is an extremely neat and encouraging desk companion for any clinic or study table.', 
    699.00, 
    'INR', 
    'Bio-degradable matte white PLA', 
    '11cm (Width) x 9cm (Depth) x 12cm (Height)', 
    TRUE, 
    TRUE, 
    TRUE
  ),
  (
    'fddddddd-dddd-dddd-dddd-dddddddddddd', 
    'ENV-PEN-003', 
    'Cozy Red Puffer Jacket Pen Holder', 
    'cozy-red-puffer-jacket-pen-holder', 
    'Cozy bright red puffer coat desk organizer to hold office stationery.', 
    'Add a warm splash of color to your workspace. This Cozy Red Puffer Jacket Pen Holder features a detailed red quilted puffer coat design with an open collar ready to store your pens, pencils, and styluses. Crafted with textured layers using precision 3D printing, it offers an incredibly fun and stylish alternative to boring plastic pen cups.', 
    599.00, 
    'INR', 
    'Matte Red PLA', 
    '10cm (Diameter) x 11cm (Height)', 
    TRUE, 
    FALSE, 
    TRUE
  ),
  (
    'feeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 
    'ENV-PEN-004', 
    'Athletic Orange Puffer Coat Pen Stand', 
    'athletic-orange-puffer-coat-pen-stand', 
    'Athletic orange puffer-jacket styled desk holder with tiny zipper and logo details.', 
    'Brighten up your desk layout with this athletic-themed Orange Puffer Coat Pen Stand. Styled as a miniature puffed jacket with a white swoosh logo accent, this pen holder blends street fashion and office functionality. Printed in high-visibility bright orange PLA, it keeps your pens and highlighters upright and easily accessible.', 
    599.00, 
    'INR', 
    'Glossy Orange PLA', 
    '10cm (Diameter) x 11cm (Height)', 
    TRUE, 
    TRUE, 
    TRUE
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 
    'ENV-PEN-005', 
    'Superhero Muscular Torso Pen Holder', 
    'superhero-muscular-torso-pen-holder', 
    'Muscular superhero chest themed desk holder with embossed emblem.', 
    'Unleash your productivity! The Superhero Muscular Torso Pen Holder features a sculpted white muscular chest wearing the iconic ''S'' shield. Designed for comic book fans, students, and professionals, this powerful pencil cup holds all your writing gear with heroic strength. Printed in premium matte white PLA, it stands out as an artistic, sculptural desk organizer.', 
    799.00, 
    'INR', 
    'Premium Matte White PLA', 
    '12cm (Width) x 8cm (Depth) x 13cm (Height)', 
    TRUE, 
    FALSE, 
    TRUE
  );

-- Map Products to Categories
INSERT INTO product_categories (product_id, category_id)
VALUES 
  ('f1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111'),
  ('f2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111'),
  ('f3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111'),
  ('f4444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111'),
  ('f5555555-5555-5555-5555-555555555555', 'c1111111-1111-1111-1111-111111111111'),
  ('f6666666-6666-6666-6666-666666666666', 'c2222222-2222-2222-2222-222222222222'),
  ('f7777777-7777-7777-7777-777777777777', 'c2222222-2222-2222-2222-222222222222'),
  ('f8888888-8888-8888-8888-888888888888', 'c2222222-2222-2222-2222-222222222222'),
  ('f9999999-9999-9999-9999-999999999999', 'c2222222-2222-2222-2222-222222222222'),
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c2222222-2222-2222-2222-222222222222'),
  ('fbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c3333333-3333-3333-3333-333333333333'),
  ('fccccccc-cccc-cccc-cccc-cccccccccccc', 'c3333333-3333-3333-3333-333333333333'),
  ('fddddddd-dddd-dddd-dddd-dddddddddddd', 'c3333333-3333-3333-3333-333333333333'),
  ('feeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'c3333333-3333-3333-3333-333333333333'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'c3333333-3333-3333-3333-333333333333');

-- Seed Default Product Media
INSERT INTO product_media (product_id, media_type, media_url, display_order, is_primary)
VALUES
  ('f1111111-1111-1111-1111-111111111111', 'image', '/products/media__1780732717856.jpg', 0, TRUE),
  ('f2222222-2222-2222-2222-222222222222', 'image', '/products/media__1780732717857.jpg', 0, TRUE),
  ('f3333333-3333-3333-3333-333333333333', 'image', '/products/media__1780732717858.jpg', 0, TRUE),
  ('f4444444-4444-4444-4444-444444444444', 'image', '/products/media__1780732717859.jpg', 0, TRUE),
  ('f5555555-5555-5555-5555-555555555555', 'image', '/products/media__1780732717863.jpg', 0, TRUE),
  ('f6666666-6666-6666-6666-666666666666', 'image', '/products/media__1780733080369.jpg', 0, TRUE),
  ('f7777777-7777-7777-7777-777777777777', 'image', '/products/media__1780733080394.jpg', 0, TRUE),
  ('f8888888-8888-8888-8888-888888888888', 'image', '/products/media__1780733080397.jpg', 0, TRUE),
  ('f9999999-9999-9999-9999-999999999999', 'image', '/products/media__1780733080398.jpg', 0, TRUE),
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'image', '/products/media__1780733080402.jpg', 0, TRUE),
  ('fbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'image', '/products/media__1780733218184.jpg', 0, TRUE),
  ('fccccccc-cccc-cccc-cccc-cccccccccccc', 'image', '/products/media__1780733218210.jpg', 0, TRUE),
  ('fddddddd-dddd-dddd-dddd-dddddddddddd', 'image', '/products/media__1780733218211.jpg', 0, TRUE),
  ('feeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'image', '/products/media__1780733218213.jpg', 0, TRUE),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'image', '/products/media__1780733218224.jpg', 0, TRUE);

-- Seed Default Tags
INSERT INTO tags (id, name, slug)
VALUES 
  ('d1111111-1111-1111-1111-111111111111', 'minimalist', 'minimalist'),
  ('d2222222-2222-2222-2222-222222222222', 'organic', 'organic'),
  ('d3333333-3333-3333-3333-333333333333', 'futuristic', 'futuristic'),
  ('d4444444-4444-4444-4444-444444444444', 'matte', 'matte');

-- Map Products to Tags
INSERT INTO product_tags (product_id, tag_id)
VALUES 
  ('f1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111'),
  ('f1111111-1111-1111-1111-111111111111', 'd4444444-4444-4444-4444-444444444444'),
  ('f2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111'),
  ('f2222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333'),
  ('f3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111'),
  ('f3333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222'),
  ('f4444444-4444-4444-4444-444444444444', 'd2222222-2222-2222-2222-222222222222'),
  ('f4444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444'),
  ('f5555555-5555-5555-5555-555555555555', 'd1111111-1111-1111-1111-111111111111'),
  ('f5555555-5555-5555-5555-555555555555', 'd3333333-3333-3333-3333-333333333333'),
  ('f6666666-6666-6666-6666-666666666666', 'd1111111-1111-1111-1111-111111111111'),
  ('f6666666-6666-6666-6666-666666666666', 'd4444444-4444-4444-4444-444444444444'),
  ('f7777777-7777-7777-7777-777777777777', 'd1111111-1111-1111-1111-111111111111'),
  ('f8888888-8888-8888-8888-888888888888', 'd1111111-1111-1111-1111-111111111111'),
  ('f8888888-8888-8888-8888-888888888888', 'd4444444-4444-4444-4444-444444444444'),
  ('f9999999-9999-9999-9999-999999999999', 'd2222222-2222-2222-2222-222222222222'),
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd1111111-1111-1111-1111-111111111111'),
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd2222222-2222-2222-2222-222222222222'),
  ('fbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'd1111111-1111-1111-1111-111111111111'),
  ('fbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'd4444444-4444-4444-4444-444444444444'),
  ('fccccccc-cccc-cccc-cccc-cccccccccccc', 'd1111111-1111-1111-1111-111111111111'),
  ('fddddddd-dddd-dddd-dddd-dddddddddddd', 'd1111111-1111-1111-1111-111111111111'),
  ('fddddddd-dddd-dddd-dddd-dddddddddddd', 'd4444444-4444-4444-4444-444444444444'),
  ('feeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'd1111111-1111-1111-1111-111111111111'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'd3333333-3333-3333-3333-333333333333');

-- Seed Latest Creations
INSERT INTO latest_creations (title, description, product_id, media_url, media_type, is_featured, display_order)
VALUES 
  ('Fresh off the printer: Cubic Texture Cylinder Lamp!', 'Watch the intricate cubic patterns catch the warm morning light. Crafted using sustainable bioplastics.', 'f1111111-1111-1111-1111-111111111111', '/products/media__1780732717856.jpg', 'image', TRUE, 1),
  ('Honeycomb shadows are magical.', 'Testing out the diffusion on the Honeycomb Lattice Lamp. Warm cozy evenings guaranteed.', 'f3333333-3333-3333-3333-333333333333', '/products/media__1780732717858.jpg', 'image', TRUE, 2),
  ('Introducing the Coquette Bow Jewelry Tray!', 'The cutest addition to your bedside table. A luxurious matte pastel pink finish featuring an oversized ribbon bow.', 'f7777777-7777-7777-7777-777777777777', '/products/media__1780733080394.jpg', 'image', TRUE, 3),
  ('Earrings closet, literally!', 'Check out this adorable Miniature Wardrobe Earring Rack. It comes with tiny hangers to organize your earrings just like clothes.', 'faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/products/media__1780733080402.jpg', 'image', TRUE, 4),
  ('Style up your desk organizer!', 'Vibrant sporty orange puffer jacket styled down-filled pen stand. Keeps all your workspace pens cozy.', 'feeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '/products/media__1780733218213.jpg', 'image', TRUE, 5),
  ('Medical heroes appreciation gift!', 'Introducing the sculpted Doctor Lab Coat Pen Holder, customized with stethoscope and name tags.', 'fccccccc-cccc-cccc-cccc-cccccccccccc', '/products/media__1780733218210.jpg', 'image', TRUE, 6);
