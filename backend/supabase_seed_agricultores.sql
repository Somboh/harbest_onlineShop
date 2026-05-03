-- =============================================================================
-- Seed: 9 agricultores con sus productos.
-- Pensado para ejecutarse desde el SQL Editor de Supabase.
-- Es idempotente: usa ON CONFLICT DO NOTHING.
--
-- Contraseña común para todos los agricultores: "agricultor123".
-- Se hashea con bcrypt vía la extensión pgcrypto, formato compatible con
-- bcrypt.compare() (bcryptjs) que usa el backend en Auth.
--
-- Los `id` de producto coinciden con los de frontend/src/data/mockProducts.js
-- para que la pantalla ProductDetail siga renderizando correctamente la imagen
-- local cuando se navega desde la búsqueda.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 1) Fotos para los avatares de los agricultores.
-- producto.foto y agricultor.foto son FK a fotos.id, así que insertamos antes.
-- -----------------------------------------------------------------------------
INSERT INTO public.fotos (id, path) VALUES
    ('foto-agri-granjasjaume',   'https://picsum.photos/seed/agri-granjasjaume/400/400'),
    ('foto-agri-illoverdu',      'https://picsum.photos/seed/agri-illoverdu/400/400'),
    ('foto-agri-antonio',        'https://picsum.photos/seed/agri-antonio/400/400'),
    ('foto-agri-verdevivo',      'https://picsum.photos/seed/agri-verdevivo/400/400'),
    ('foto-agri-esenciasdelsur', 'https://picsum.photos/seed/agri-esenciasdelsur/400/400'),
    ('foto-agri-huertadelsur',   'https://picsum.photos/seed/agri-huertadelsur/400/400'),
    ('foto-agri-ecofruit',       'https://picsum.photos/seed/agri-ecofruit/400/400'),
    ('foto-agri-huertaviva',     'https://picsum.photos/seed/agri-huertaviva/400/400'),
    ('foto-agri-jaume',          'https://picsum.photos/seed/agri-jaume/400/400')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2) Agricultores. Contraseña en claro: "agricultor123".
-- -----------------------------------------------------------------------------
INSERT INTO public.agricultor (id, email, nombre, contra, direccion, telefono, foto) VALUES
    ('agri-granjasjaume',   'granjasjaume@example.com',   'Granjas Jaume',    crypt('agricultor123', gen_salt('bf', 10)), 'Calle Mayor 12, Xátiva',         600101101, 'foto-agri-granjasjaume'),
    ('agri-illoverdu',      'illoverdu@example.com',      'Illo verdulerías', crypt('agricultor123', gen_salt('bf', 10)), 'Av. Andalucía 4, Granada',       600202202, 'foto-agri-illoverdu'),
    ('agri-antonio',        'antonio@example.com',        'Antonio & Co',     crypt('agricultor123', gen_salt('bf', 10)), 'Plaza La Vera 7, Cáceres',       600303303, 'foto-agri-antonio'),
    ('agri-verdevivo',      'verdevivo@example.com',      'Verde Vivo',       crypt('agricultor123', gen_salt('bf', 10)), 'Camino Huerta 9, Murcia',        600404404, 'foto-agri-verdevivo'),
    ('agri-esenciasdelsur', 'esenciasdelsur@example.com', 'Esencias del Sur', crypt('agricultor123', gen_salt('bf', 10)), 'Calle Especiero 22, Sevilla',    600505505, 'foto-agri-esenciasdelsur'),
    ('agri-huertadelsur',   'huertadelsur@example.com',   'Huerta del Sur',   crypt('agricultor123', gen_salt('bf', 10)), 'Cañada Real 33, Huelva',         600606606, 'foto-agri-huertadelsur'),
    ('agri-ecofruit',       'ecofruit@example.com',       'EcoFruit',         crypt('agricultor123', gen_salt('bf', 10)), 'Polígono Sur 5, Valencia',       600707707, 'foto-agri-ecofruit'),
    ('agri-huertaviva',     'huertaviva@example.com',     'Huerta Viva',      crypt('agricultor123', gen_salt('bf', 10)), 'Carretera del Mar 8, Castellón', 600808808, 'foto-agri-huertaviva'),
    ('agri-jaume',          'jaume@example.com',          'Jaume',            crypt('agricultor123', gen_salt('bf', 10)), 'Camino del Olivar 15, Xátiva',   600909909, 'foto-agri-jaume')
ON CONFLICT (email) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3) Fotos de los productos. URLs reales del CDN público de Spoonacular
-- (img.spoonacular.com/ingredients_500x500/<ingrediente>.jpg) que sirve fotos
-- de cada ingrediente. Los ids coinciden con mockProducts.js para que el merge
-- en HomeScreen.jsx pueda priorizar la imagen local cuando el cliente entra
-- desde el cliente; pero también se ven bien al consumirlas crudas.
-- -----------------------------------------------------------------------------
INSERT INTO public.fotos (id, path) VALUES
    ('foto-naranjas-valencianas', 'https://img.spoonacular.com/ingredients_500x500/orange.jpg'),
    ('foto-aguacates-granada',    'https://img.spoonacular.com/ingredients_500x500/avocado.jpg'),
    ('foto-pimenton-vera',        'https://img.spoonacular.com/ingredients_500x500/paprika.jpg'),
    ('foto-brocoli-fresco',       'https://img.spoonacular.com/ingredients_500x500/broccoli.jpg'),
    ('foto-canela-molida',        'https://img.spoonacular.com/ingredients_500x500/cinnamon.jpg'),
    ('foto-fresas-temporada',     'https://img.spoonacular.com/ingredients_500x500/strawberries.jpg'),
    ('foto-lechuga-romana',       'https://img.spoonacular.com/ingredients_500x500/romaine.jpg'),
    ('foto-zanahorias-huerta',    'https://img.spoonacular.com/ingredients_500x500/carrots.jpg'),
    ('foto-manzanas-jaume',       'https://img.spoonacular.com/ingredients_500x500/apple.jpg'),
    ('foto-tomates-jaume',        'https://img.spoonacular.com/ingredients_500x500/tomato.jpg'),
    ('foto-pimienta-negra-jaume', 'https://img.spoonacular.com/ingredients_500x500/black-pepper.jpg')
ON CONFLICT (id) DO UPDATE SET path = EXCLUDED.path;

-- -----------------------------------------------------------------------------
-- 4) Productos. Los datos están alineados con mockProducts.js.
-- -----------------------------------------------------------------------------
INSERT INTO public.producto (id, nombre, descripcion, precio, cantidad, email_agricultor, foto, categoria, valoracion) VALUES
    ('naranjas-valencianas',  'Naranjas Valencianas',  'Naranjas de cultivo ecológico, jugosas y con sabor natural intenso. Recolectadas directamente del productor para garantizar frescura y comercio justo.', 1.7,  86, 'granjasjaume@example.com',   'foto-naranjas-valencianas',  'Frutas',   4.9),
    ('aguacates-granada',     'Aguacates de Granada',  'Aguacates de temporada cultivados en la costa tropical. Perfectos para ensaladas, tostadas y pedidos semanales.',                                       3.2,  42, 'illoverdu@example.com',      'foto-aguacates-granada',     'Frutas',   4.8),
    ('pimenton-vera',         'Pimentón de la Vera',   'Pimentón de molienda fina con aroma profundo. Ideal para guisos, arroces y elaboraciones artesanas.',                                                  6.4,  25, 'antonio@example.com',        'foto-pimenton-vera',         'Especias', 4.7),
    ('brocoli-fresco',        'Brócoli fresco',        'Brócoli fresco de huerta local, seleccionado por tamaño y punto de maduración para mantener textura y sabor.',                                         2.95, 34, 'verdevivo@example.com',      'foto-brocoli-fresco',        'Verduras', 4.6),
    ('canela-molida',         'Canela molida',         'Canela molida con aroma dulce e intenso. Buena para repostería, infusiones y platos especiados.',                                                      4.2,  18, 'esenciasdelsur@example.com', 'foto-canela-molida',         'Especias', 4.5),
    ('fresas-temporada',      'Fresas de temporada',   'Fresas de temporada con color vivo y textura firme. Recomendadas para consumir en pocos días.',                                                        5.1,  29, 'huertadelsur@example.com',   'foto-fresas-temporada',      'Frutas',   4.8),
    ('lechuga-romana',        'Lechuga romana',        'Lechuga romana fresca, ideal para ensaladas y acompañamientos. Se entrega limpia y seleccionada.',                                                     1.5,  51, 'ecofruit@example.com',       'foto-lechuga-romana',        'Verduras', 4.4),
    ('zanahorias-huerta',     'Zanahorias',            'Zanahorias frescas de huerta, perfectas para cocinar, cremas o consumir en crudo.',                                                                    1.9,  47, 'huertaviva@example.com',     'foto-zanahorias-huerta',     'Verduras', 4.6),
    ('manzanas-jaume',        'Manzanas Fuji',         'Manzanas Fuji de cultivo ecológico, recogidas en el punto exacto de maduración para máxima dulzura y textura.',                                        2.1,  68, 'jaume@example.com',          'foto-manzanas-jaume',        'Frutas',   4.7),
    ('tomates-jaume',         'Tomates Raff',          'Tomates Raff de cultivo local, con sabor intenso y aroma natural. Perfectos para ensaladas y gazpachos.',                                              2.5,  56, 'jaume@example.com',          'foto-tomates-jaume',         'Verduras', 4.8),
    ('pimienta-negra-jaume',  'Pimienta Negra Molida', 'Pimienta negra de primera calidad, molida en el momento para conservar su aroma y sabor incomparables.',                                               8.5,  12, 'jaume@example.com',          'foto-pimienta-negra-jaume',  'Especias', 4.9)
ON CONFLICT (id) DO NOTHING;
