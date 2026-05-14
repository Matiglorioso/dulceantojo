-- Dulce Antojo — esquema inicial, RLS, triggers y seed (Fase 1)
-- Ejecutar una vez por proyecto (o dropear tablas públicas antes de reintentar).

-- 1) Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2) Tablas
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
  category_id uuid NOT NULL REFERENCES public.categories (id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  price int NOT NULL,
  image_url text,
  image_blur_data text,
  badges text[] NOT NULL DEFAULT '{}',
  allergens text[] NOT NULL DEFAULT '{}',
  portions text,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  is_out_of_stock boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX products_category_id_idx ON public.products (category_id);
CREATE INDEX products_slug_idx ON public.products (slug);
CREATE INDEX categories_slug_idx ON public.categories (slug);

-- 6) Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at ()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER categories_set_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at ();

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at ();

CREATE TRIGGER settings_set_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at ();

-- 8) Helper admin (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin ()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
  AS $$
  SELECT EXISTS (
    SELECT
      1
    FROM
      public.profiles p
    WHERE
      p.id = auth.uid ()
      AND p.role = 'admin');
$$;

REVOKE ALL ON FUNCTION public.is_admin () FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin () TO anon, authenticated, service_role;

-- 7) RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
    USING (auth.uid () = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
    USING (auth.uid () = id)
    WITH CHECK (auth.uid () = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
    WITH CHECK (auth.uid () = id);

-- categories: lectura pública solo activas; admin todo
CREATE POLICY "categories_public_select_active" ON public.categories
  FOR SELECT
    USING (is_active = true);

CREATE POLICY "categories_admin_all" ON public.categories
  FOR ALL TO authenticated
    USING (public.is_admin ())
    WITH CHECK (public.is_admin ());

-- products: lectura pública activos + categoría activa; admin todo
CREATE POLICY "products_public_select_active" ON public.products
  FOR SELECT
    USING (is_active = true AND EXISTS (
        SELECT
          1
        FROM
          public.categories c
        WHERE
          c.id = products.category_id
          AND c.is_active = true));

CREATE POLICY "products_admin_all" ON public.products
  FOR ALL TO authenticated
    USING (public.is_admin ())
    WITH CHECK (public.is_admin ());

-- settings: lectura pública total; mutaciones solo admin
CREATE POLICY "settings_public_select" ON public.settings
  FOR SELECT
    USING (true);

CREATE POLICY "settings_admin_write" ON public.settings
  FOR ALL TO authenticated
    USING (public.is_admin ())
    WITH CHECK (public.is_admin ());

-- 9) Seed — categorías
INSERT INTO public.categories (slug, name, description, sort_order, is_active)
  VALUES ('tartas', 'Tartas', 'De 24 cm que rinden entre 8 y 12 porciones.', 0, true),
('tortas', 'Tortas', 'De 20 cm que rinden entre 20 y 25 porciones.', 1, true),
('budines', 'Budines', 'Budines artesanales en variedad de sabores; ideales para compartir o regalar.', 2, true)
ON CONFLICT (slug)
  DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- 9) Seed — productos (29)
INSERT INTO public.products (category_id, slug, name, description, price, badges, allergens, portions, is_active, is_featured, is_out_of_stock, sort_order)
SELECT
  c.id,
  v.slug,
  v.name,
  v.description,
  v.price,
  v.badges,
  '{}'::text[],
  NULL,
  true,
  v.is_featured,
  false,
  v.sort_order
FROM
  public.categories c
  INNER JOIN (
    VALUES ('tartas', 'tarta-cabsha', 'Cabsha', 'Masa sablée de vainilla, dulce de leche y ganache de chocolate semiamargo', 27000, ARRAY[]::text[], false, 0),
      ('tartas', 'tarta-coco', 'Coco', 'Masa sablée de vainilla, dulce de leche y coco', 27000, ARRAY[]::text[], false, 1),
      ('tartas', 'tarta-frutal', 'Frutal', 'Masa sablée de vainilla, crema pastelera y frutas frescas de estación', 29000, ARRAY[]::text[], false, 2),
      ('tartas', 'tarta-frutilla', 'Frutilla', 'Masa sablée de vainilla, dulce de leche, crema chantilly y frutillas frescas', 29000, ARRAY['Recomendada']::text[], true, 3),
      ('tartas', 'tarta-pastafrola', 'Pastafrola', 'Base de masa frola de vainilla con dulce de membrillo o batata', 20000, ARRAY[]::text[], false, 4),
      ('tartas', 'tarta-lemon-pie', 'Lemon Pie', 'Masa sablée de vainilla, curd de limón y merengue suizo', 29000, ARRAY[]::text[], false, 5),
      ('tartas', 'tarta-durazno', 'Durazno', 'Masa sablée de vainilla, crema chantilly y duraznos en almíbar', 27000, ARRAY[]::text[], false, 6),
      ('tartas', 'tarta-ricota', 'Ricota', 'Masa sablée de vainilla con relleno de ricota y naranja', 27000, ARRAY[]::text[], false, 7),
      ('tartas', 'tarta-key-lime-pie', 'Key Lime Pie', 'Base de galletitas de vainilla con relleno cremoso de leche condensada y lima. Decorada con crema chantilly', 29000, ARRAY[]::text[], false, 8),
      ('tortas', 'torta-matilda', 'Matilda', 'Tres bizcochuelos de chocolate rellenos y cubiertos de crema bariloche. Decoración con frutos rojos', 65000, ARRAY[]::text[], false, 0),
      ('tortas', 'torta-chaja', 'Chajá', 'Tres capas de bizcochuelo de vainilla y dos rellenos. Uno de dulce de leche con duraznos en almíbar y otro con dulce de leche y merenguitos', 60000, ARRAY[]::text[], false, 1),
      ('tortas', 'torta-selva-negra', 'Selva Negra', 'Tres capas de bizcochuelo de chocolate con crema chantilly y cerezas en almíbar. Decorada con virutas de chocolate', 60000, ARRAY[]::text[], false, 2),
      ('tortas', 'torta-marquise-clasica', 'Marquise clásica', 'Brownie húmedo hecho con chocolate cobertura, dulce de leche, crema chantilly y merengue suizo', 50000, ARRAY[]::text[], false, 3),
      ('tortas', 'torta-marquise-frutos-rojos', 'Marquise con frutos rojos', 'Brownie húmedo hecho con chocolate cobertura, dulce de leche, crema chantilly y frutos rojos', 52000, ARRAY[]::text[], false, 4),
      ('tortas', 'torta-tiramisu', 'Tiramisú', 'Crema mascarpone intercalada con vainillas embebidas en café', 40000, ARRAY[]::text[], false, 5),
      ('tortas', 'torta-pavlova', 'Pavlova', 'Base crujiente de merengue francés cocido y por encima dulce de leche y crema chantilly. Decorada con frutos rojos', 45000, ARRAY[]::text[], false, 6),
      ('tortas', 'torta-cheesecake-ny', 'Cheesecake NY', 'Base de galletitas de vainilla, crema de queso y reducción de frutos rojos. Decorado con frutos rojos enteros', 50000, ARRAY['Recomendada']::text[], true, 7),
      ('tortas', 'torta-chocotorta', 'Chocotorta', 'Galletitas chocolinas embebidas en café con relleno de crema chocotorta', 55000, ARRAY[]::text[], false, 8),
      ('tortas', 'torta-cheesecake-maracuya', 'Cheesecake maracuyá', 'Base crocante de galletitas de vainilla, por encima crema de queso. Decorada con mermelada de maracuyá', 50000, ARRAY[]::text[], false, 9),
      ('budines', 'budin-limon', 'Limón', 'Masa de vainilla y limón cubierto de glaseado de azúcar', 8500, ARRAY[]::text[], false, 0),
      ('budines', 'budin-naranja', 'Naranja', 'Masa de vainilla y naranja cubierto de glaseado de azúcar', 8500, ARRAY[]::text[], false, 1),
      ('budines', 'budin-vainilla-chocolate', 'Vainilla y Chips de Chocolate', 'Masa de vainilla y con chips de chocolate semiamargo', 9000, ARRAY[]::text[], false, 2),
      ('budines', 'budin-naranja-chocolate', 'Naranja y Chocolate', 'Masa de chocolate con naranja. Decorado con una cobertura de chocolate semiamargo', 9000, ARRAY[]::text[], false, 3),
      ('budines', 'budin-limon-amapolas', 'Limón y Amapolas', 'Masa de vainilla con limón y semillas de amapola. Cubierto por un glaseado de azúcar', 9000, ARRAY['Recomendada']::text[], false, 4),
      ('budines', 'budin-marmolado', 'Budín Marmolado', 'Masa de vainilla y chocolate con cobertura de chocolate', 9000, ARRAY[]::text[], false, 5),
      ('budines', 'budin-banana-chocolate', 'Integral de Banana con Chocolate', 'Masa integral de vainilla con banana y chips de chocolate semiamargo', 8500, ARRAY[]::text[], false, 6),
      ('budines', 'budin-carrot-cake', 'Integral Carrot Cake con Nueces', 'Masa de integral de naranja y zanahoria con nueces', 8500, ARRAY[]::text[], false, 7),
      ('budines', 'budin-manzana', 'Integral de Manzana', 'Masa integral de vainilla con manzana rallada. Decorado con nueces picadas', 8500, ARRAY[]::text[], false, 8),
      ('budines', 'budin-limon-arandanos', 'Limón y Arándanos', 'Masa de limón con arándanos por dentro. Decorado con un crumble crocante', 9000, ARRAY[]::text[], false, 9)) AS v (cat_slug, slug, name, description, price, badges, is_featured, sort_order)
    ON c.slug = v.cat_slug
ON CONFLICT (slug)
  DO UPDATE SET
    category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    badges = EXCLUDED.badges,
    is_featured = EXCLUDED.is_featured,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

-- 9) Seed — settings
INSERT INTO public.settings (key, value)
  VALUES ('whatsapp_number', to_jsonb ('5493515147985'::text)),
('opening_message', to_jsonb ('ENVÍOS A CÓRDOBA CAPITAL · PEDIDOS CON 48HS DE ANTICIPACIÓN'::text)),
('anticipation_hours', to_jsonb (48)),
('shipping_info', '{"zones": [], "default_cost": 0, "free_above": null}'::jsonb),
('payment_info', '{"alias": "TODO", "cbu": "TODO", "titular": "TODO"}'::jsonb),
('business_location', '{"city": "Córdoba", "country": "Argentina"}'::jsonb),
('hero_slides', '[
    {"image": null, "alt": "Especialidades de la casa — slide 1", "title": "¡Conocé nuestros productos!", "subtitle": "ESPECIALIDADES DE LA CASA", "cta": "Ver más"},
    {"image": null, "alt": "Especialidades de la casa — slide 2", "title": "¡Conocé nuestros productos!", "subtitle": "ESPECIALIDADES DE LA CASA", "cta": "Ver más"},
    {"image": null, "alt": "Especialidades de la casa — slide 3", "title": "¡Conocé nuestros productos!", "subtitle": "ESPECIALIDADES DE LA CASA", "cta": "Ver más"},
    {"image": null, "alt": "Especialidades de la casa — slide 4", "title": "¡Conocé nuestros productos!", "subtitle": "ESPECIALIDADES DE LA CASA", "cta": "Ver más"}
  ]'::jsonb)
ON CONFLICT (key)
  DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = now();
