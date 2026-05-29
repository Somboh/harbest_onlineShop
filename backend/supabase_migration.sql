-- =============================================================================
-- Migración Supabase: tablas para Pedidos y Favoritos
-- Ejecuta este script en SQL Editor de Supabase.
-- Es idempotente: usa IF NOT EXISTS donde puede.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabla: pedido
-- Cabecera del pedido. Las líneas viven en pedido_producto.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pedido (
    id              text PRIMARY KEY,
    user_email      text NOT NULL,
    farmer_email    text NOT NULL,
    fecha           timestamptz NOT NULL DEFAULT now(),
    estado          text NOT NULL DEFAULT 'pendiente',
    total           numeric(10, 2) NOT NULL DEFAULT 0,
    direccion_envio text,

    CONSTRAINT pedido_estado_check
        CHECK (estado IN ('pendiente', 'preparando', 'enviado', 'entregado', 'cancelado')),

    CONSTRAINT pedido_user_email_fk
        FOREIGN KEY (user_email) REFERENCES public.usuario(email)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT pedido_farmer_email_fk
        FOREIGN KEY (farmer_email) REFERENCES public.agricultor(email)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS pedido_user_email_idx   ON public.pedido (user_email);
CREATE INDEX IF NOT EXISTS pedido_farmer_email_idx ON public.pedido (farmer_email);
CREATE INDEX IF NOT EXISTS pedido_fecha_idx        ON public.pedido (fecha DESC);

-- -----------------------------------------------------------------------------
-- Tabla: pedido_producto
-- Una fila por producto dentro de un pedido. Guarda precio_unitario congelado
-- en el momento de la compra para que cambios futuros de precio no afecten al
-- histórico del pedido.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pedido_producto (
    id              text PRIMARY KEY,
    pedido_id       text NOT NULL,
    product_id      text NOT NULL,
    cantidad        numeric(10, 3) NOT NULL,
    precio_unitario numeric(10, 2) NOT NULL,

    CONSTRAINT pedido_producto_pedido_fk
        FOREIGN KEY (pedido_id) REFERENCES public.pedido(id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT pedido_producto_product_fk
        FOREIGN KEY (product_id) REFERENCES public.producto(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT pedido_producto_cantidad_check  CHECK (cantidad > 0),
    CONSTRAINT pedido_producto_precio_check    CHECK (precio_unitario >= 0)
);

CREATE INDEX IF NOT EXISTS pedido_producto_pedido_idx  ON public.pedido_producto (pedido_id);
CREATE INDEX IF NOT EXISTS pedido_producto_product_idx ON public.pedido_producto (product_id);

-- -----------------------------------------------------------------------------
-- Tabla: favorito
-- Producto guardado por un usuario. PK compuesta (user_email, product_id) para
-- evitar duplicados sin necesidad de gestionarlo en código.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorito (
    user_email  text NOT NULL,
    product_id  text NOT NULL,
    fecha       timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT favorito_pk PRIMARY KEY (user_email, product_id),

    CONSTRAINT favorito_user_email_fk
        FOREIGN KEY (user_email) REFERENCES public.usuario(email)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT favorito_product_id_fk
        FOREIGN KEY (product_id) REFERENCES public.producto(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS favorito_user_email_idx ON public.favorito (user_email);

-- =============================================================================
-- NOTAS:
--  · Si tu tabla `usuario` o `agricultor` no tiene un UNIQUE/PK sobre `email`,
--    los FK por email fallarán. Si es tu caso, ejecuta antes:
--      ALTER TABLE public.usuario   ADD CONSTRAINT usuario_email_key   UNIQUE (email);
--      ALTER TABLE public.agricultor ADD CONSTRAINT agricultor_email_key UNIQUE (email);
--  · Si prefieres no usar email como FK (por si un cliente cambia de email),
--    cambia los CHECKs por columnas user_id / farmer_id apuntando a usuario.id
--    y agricultor.id, y replica el cambio en pedido.dto.ts y pedido.service.ts.
-- =============================================================================
