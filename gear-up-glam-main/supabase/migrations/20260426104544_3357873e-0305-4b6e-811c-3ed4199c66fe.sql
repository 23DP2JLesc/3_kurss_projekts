
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  fitment TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update products"
  ON public.products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete products"
  ON public.products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User status (ban / warn)
CREATE TABLE public.user_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  banned BOOLEAN NOT NULL DEFAULT false,
  warning_message TEXT,
  warning_acknowledged BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own status"
  ON public.user_status FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users update own status"
  ON public.user_status FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert status"
  ON public.user_status FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_user_status_updated_at
  BEFORE UPDATE ON public.user_status
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Default 'user' role on signup (extend handle_new_user)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed products
INSERT INTO public.products (name, brand, model, type, category, price, original_price, image, stock, fitment, description) VALUES
('Titanium Racing Exhaust System','Akrapovič','ZX-10R','Exhaust','Exhaust',1299.99,1599.99,'/src/assets/product-exhaust.jpg',7,ARRAY['Kawasaki ZX-10R','BMW S1000RR'],'Lightweight titanium race exhaust tuned for sharper throttle response, lower weight, and track-ready sound.'),
('Brembo Racing Brake Kit','Brembo','Panigale V4','Brakes','Brakes',849.99,NULL,'/src/assets/product-brakes.jpg',11,ARRAY['Ducati Panigale V4','Yamaha R1'],'High-bite caliper and rotor kit built for consistent stopping power under heavy race braking.'),
('Öhlins TTX GP Suspension Fork','Öhlins','S1000RR','Suspension','Suspension',2199.99,2499.99,'/src/assets/product-suspension.jpg',4,ARRAY['BMW S1000RR','Kawasaki ZX-10R'],'Fully adjustable cartridge suspension with GP-derived damping control for precise front-end feedback.'),
('Carbon Fiber Race Fairings','Ilmberger','R1','Bodywork','Bodywork',1899.99,NULL,'/src/assets/product-fairings.jpg',5,ARRAY['Yamaha R1','Ducati Panigale V4'],'Pre-drilled carbon fairing set with race geometry, heat shielding, and fast service access.'),
('Performance Air Filter','Sprint Filter','RSV4','Engine','Engine',149.99,NULL,'/src/assets/product-exhaust.jpg',18,ARRAY['Aprilia RSV4','BMW S1000RR'],'Washable high-flow air filter that improves intake breathing while protecting the engine on road and track.'),
('LED Headlight Kit','Rizoma','MT-10','Lighting','Lighting',299.99,349.99,'/src/assets/product-brakes.jpg',0,ARRAY['Yamaha MT-10','Kawasaki Z900'],'Compact LED conversion kit with sharper night visibility and plug-ready fitment for street builds.');
