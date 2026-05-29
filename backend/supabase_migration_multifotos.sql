-- =============================================================================
-- Migración Supabase: soporte de varias fotos por producto.
-- Crea la tabla intermedia producto_fotos, migra la foto actual de cada
-- producto al nuevo modelo (orden=0) y elimina la columna producto.foto.
-- Ejecutar en SQL Editor de Supabase. Idempotente.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabla: producto_fotos
-- Cada fila es una foto de un producto. `orden` decide cuál es la principal
-- (la que se muestra en tarjetas y en la primera posición del carrusel).
-- Limitamos a 5 fotos por producto vía CHECK.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.producto_fotos (
    producto_id  text NOT NULL,
    foto_id      text NOT NULL,
    orden        int  NOT NULL DEFAULT 0,

    CONSTRAINT producto_fotos_pk PRIMARY KEY (producto_id, foto_id),

    CONSTRAINT producto_fotos_producto_fk
        FOREIGN KEY (producto_id) REFERENCES public.producto(id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT producto_fotos_foto_fk
        FOREIGN KEY (foto_id) REFERENCES public.fotos(id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT producto_fotos_orden_check
        CHECK (orden >= 0 AND orden < 5)
);

CREATE INDEX IF NOT EXISTS producto_fotos_producto_orden_idx
    ON public.producto_fotos (producto_id, orden);

-- -----------------------------------------------------------------------------
-- Backfill: cada producto que ya tenía una foto pasa a tener un registro
-- en producto_fotos con orden=0. Solo se hace si la columna producto.foto
-- todavía existe (idempotencia para re-ejecuciones).
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = 'producto'
          AND column_name  = 'foto'
    ) THEN
        INSERT INTO public.producto_fotos (producto_id, foto_id, orden)
        SELECT id, foto, 0
        FROM public.producto
        WHERE foto IS NOT NULL
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- Eliminar la columna antigua producto.foto. A partir de ahora todas las
-- fotos de un producto se leen y escriben a través de producto_fotos.
-- -----------------------------------------------------------------------------
ALTER TABLE public.producto DROP COLUMN IF EXISTS foto;
