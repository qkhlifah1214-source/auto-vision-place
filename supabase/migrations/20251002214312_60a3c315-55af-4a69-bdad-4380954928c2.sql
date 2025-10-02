-- Create sections table for organizing categories
CREATE TABLE public.sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create car_models table for managing car makes/models
CREATE TABLE public.car_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create offers table for homepage offers
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create messages table for user communications
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add section_id to categories table
ALTER TABLE public.categories ADD COLUMN section_id UUID REFERENCES public.sections(id);

-- Enable RLS on new tables
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sections
CREATE POLICY "Anyone can view sections"
  ON public.sections FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage sections"
  ON public.sections FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for car_models
CREATE POLICY "Anyone can view car models"
  ON public.car_models FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage car models"
  ON public.car_models FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for offers
CREATE POLICY "Anyone can view active offers"
  ON public.offers FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage offers"
  ON public.offers FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for messages
CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Insert default sections
INSERT INTO public.sections (name_ar, name_en, icon) VALUES
  ('سيارات', 'Cars', 'Car'),
  ('عقارات', 'Real Estate', 'Building'),
  ('إلكترونيات', 'Electronics', 'Smartphone');