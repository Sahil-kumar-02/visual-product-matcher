-- Create products table to store product information
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read products (public catalog)
CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert products (for demo purposes)
CREATE POLICY "Authenticated users can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster category searches
CREATE INDEX idx_products_category ON public.products(category);

-- Insert sample products (50+ products across different categories)
INSERT INTO public.products (name, category, description, image_url, price) VALUES
  -- Electronics
  ('Wireless Headphones Pro', 'Electronics', 'Premium noise-canceling headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 299.99),
  ('Smart Watch Ultra', 'Electronics', 'Advanced fitness tracking smartwatch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 399.99),
  ('Laptop Stand Aluminum', 'Electronics', 'Ergonomic laptop stand', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 49.99),
  ('Wireless Mouse', 'Electronics', 'Ergonomic wireless mouse', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', 29.99),
  ('USB-C Hub', 'Electronics', '7-in-1 USB-C adapter', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500', 39.99),
  ('Bluetooth Speaker', 'Electronics', 'Portable waterproof speaker', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 79.99),
  ('Webcam HD', 'Electronics', '1080p streaming webcam', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500', 89.99),
  ('Mechanical Keyboard', 'Electronics', 'RGB mechanical gaming keyboard', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', 129.99),
  ('Gaming Mouse Pad', 'Electronics', 'Extended RGB mouse pad', 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500', 24.99),
  ('Phone Stand', 'Electronics', 'Adjustable phone holder', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 19.99),
  
  -- Fashion
  ('Classic Denim Jacket', 'Fashion', 'Vintage style denim jacket', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 89.99),
  ('Leather Crossbody Bag', 'Fashion', 'Genuine leather handbag', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500', 129.99),
  ('Sneakers White', 'Fashion', 'Classic white sneakers', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', 79.99),
  ('Sunglasses Aviator', 'Fashion', 'UV protection sunglasses', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', 149.99),
  ('Wool Scarf', 'Fashion', 'Soft merino wool scarf', 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500', 39.99),
  ('Baseball Cap', 'Fashion', 'Cotton baseball cap', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', 24.99),
  ('Leather Belt', 'Fashion', 'Classic leather belt', 'https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=500', 49.99),
  ('Running Shoes', 'Fashion', 'Performance running shoes', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 119.99),
  ('Wool Coat', 'Fashion', 'Winter wool coat', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500', 199.99),
  ('Cotton T-Shirt', 'Fashion', 'Basic cotton tee', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 29.99),
  
  -- Home & Living
  ('Ceramic Vase', 'Home', 'Handcrafted ceramic vase', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500', 34.99),
  ('Throw Pillow Set', 'Home', 'Decorative pillow covers', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500', 44.99),
  ('Wall Art Canvas', 'Home', 'Abstract wall art print', 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=500', 79.99),
  ('Table Lamp', 'Home', 'Modern LED table lamp', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', 59.99),
  ('Area Rug', 'Home', 'Modern geometric rug', 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=500', 149.99),
  ('Plant Pot Set', 'Home', 'Ceramic plant pots', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', 29.99),
  ('Wall Clock', 'Home', 'Minimalist wall clock', 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500', 39.99),
  ('Bookshelf', 'Home', '5-tier wooden bookshelf', 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500', 129.99),
  ('Mirror Round', 'Home', 'Decorative wall mirror', 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=500', 69.99),
  ('Storage Basket', 'Home', 'Woven storage basket', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500', 24.99),
  
  -- Kitchen
  ('Coffee Maker', 'Kitchen', 'Programmable coffee maker', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 89.99),
  ('Blender', 'Kitchen', 'High-speed blender', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500', 129.99),
  ('Knife Set', 'Kitchen', 'Professional knife set', 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500', 99.99),
  ('Cutting Board', 'Kitchen', 'Bamboo cutting board', 'https://images.unsplash.com/photo-1594135915181-a96c027fc73d?w=500', 29.99),
  ('Mixing Bowls', 'Kitchen', 'Stainless steel bowls', 'https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=500', 39.99),
  ('Dutch Oven', 'Kitchen', 'Cast iron Dutch oven', 'https://images.unsplash.com/photo-1585515320310-259814833071?w=500', 149.99),
  ('Tea Kettle', 'Kitchen', 'Stovetop tea kettle', 'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=500', 44.99),
  ('Food Storage Set', 'Kitchen', 'Glass container set', 'https://images.unsplash.com/photo-1584990347449-39b0e4d777a5?w=500', 49.99),
  ('Wine Glasses', 'Kitchen', 'Crystal wine glasses', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500', 59.99),
  ('Dinner Plates', 'Kitchen', 'Ceramic plate set', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500', 79.99),
  
  -- Sports & Fitness
  ('Yoga Mat', 'Sports', 'Non-slip yoga mat', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 34.99),
  ('Dumbbells Set', 'Sports', 'Adjustable dumbbells', 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500', 149.99),
  ('Water Bottle', 'Sports', 'Insulated water bottle', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', 24.99),
  ('Resistance Bands', 'Sports', 'Exercise resistance bands', 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500', 19.99),
  ('Jump Rope', 'Sports', 'Speed jump rope', 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=500', 14.99),
  ('Gym Bag', 'Sports', 'Durable sports duffle bag', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 49.99),
  ('Foam Roller', 'Sports', 'Muscle recovery roller', 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=500', 29.99),
  ('Boxing Gloves', 'Sports', 'Training boxing gloves', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500', 69.99),
  ('Tennis Racket', 'Sports', 'Professional tennis racket', 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=500', 199.99),
  ('Bike Helmet', 'Sports', 'Safety bike helmet', 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500', 59.99);

-- Create search_history table to track user searches
CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_image_url TEXT,
  search_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert search history (no auth required for this demo)
CREATE POLICY "Anyone can insert search history"
  ON public.search_history
  FOR INSERT
  WITH CHECK (true);
