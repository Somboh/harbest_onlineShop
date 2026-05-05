-- =============================================================================
-- Migración Supabase: añade `cantidad_inicial` a producto.
-- Sirve como "máximo histórico" para que el botón Reponer pueda volver a
-- llenar el stock al valor original. Se actualiza también al editar el
-- producto si la nueva cantidad es mayor que la inicial guardada.
-- Idempotente.
-- =============================================================================
ALTER TABLE public.producto
    ADD COLUMN IF NOT EXISTS cantidad_inicial int8;

-- Para los productos ya existentes asumimos que la cantidad actual es el
-- "lleno". Si más tarde el agricultor edita y sube la cantidad, el backend
-- actualiza cantidad_inicial al nuevo máximo.
UPDATE public.producto
    SET cantidad_inicial = cantidad
    WHERE cantidad_inicial IS NULL;
