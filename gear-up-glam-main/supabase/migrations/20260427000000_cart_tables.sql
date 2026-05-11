-- Cart and CartItem tables
CREATE TABLE public.cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON public.cart FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart"
  ON public.cart FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON public.cart FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_cart_updated_at
  BEFORE UPDATE ON public.cart
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Cart items
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.cart(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cart_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items"
  ON public.cart_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cart
      WHERE id = cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own cart items"
  ON public.cart_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cart
      WHERE id = cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own cart items"
  ON public.cart_items FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cart
      WHERE id = cart_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own cart items"
  ON public.cart_items FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cart
      WHERE id = cart_id AND user_id = auth.uid()
    )
  );