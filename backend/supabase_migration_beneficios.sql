-- =============================================================================
-- Migración Supabase: tabla `beneficio_mensual`
-- Acumulado por agricultor / año / mes de los pedidos marcados como
-- "entregado". El backend llama a la función `add_beneficio_mensual` cada vez
-- que un pedido pasa a "entregado", de modo que esta tabla siempre refleja la
-- realidad sin necesidad de recalcular en cada lectura.
-- Idempotente.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabla
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.beneficio_mensual (
    farmer_email text         NOT NULL,
    anio         int          NOT NULL,
    mes          int          NOT NULL,
    total        numeric(12, 2) NOT NULL DEFAULT 0,
    pedidos      int          NOT NULL DEFAULT 0,
    updated_at   timestamptz  NOT NULL DEFAULT now(),

    CONSTRAINT beneficio_mensual_pk PRIMARY KEY (farmer_email, anio, mes),
    CONSTRAINT beneficio_mensual_anio_check CHECK (anio BETWEEN 2000 AND 2100),
    CONSTRAINT beneficio_mensual_mes_check  CHECK (mes  BETWEEN 1    AND 12),
    CONSTRAINT beneficio_mensual_farmer_fk
        FOREIGN KEY (farmer_email) REFERENCES public.agricultor(email)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS beneficio_mensual_farmer_idx
    ON public.beneficio_mensual (farmer_email, anio DESC, mes DESC);

-- -----------------------------------------------------------------------------
-- Función de acumulación atómica.
-- INSERT ... ON CONFLICT DO UPDATE para que dos pedidos del mismo mes no
-- sobreescriban la cuenta. Se llama desde el backend en pedido.service.ts.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.add_beneficio_mensual(
    p_farmer_email text,
    p_anio         int,
    p_mes          int,
    p_monto        numeric
) RETURNS void
LANGUAGE sql
AS $$
    INSERT INTO public.beneficio_mensual (farmer_email, anio, mes, total, pedidos, updated_at)
    VALUES (p_farmer_email, p_anio, p_mes, p_monto, 1, now())
    ON CONFLICT (farmer_email, anio, mes) DO UPDATE
        SET total      = public.beneficio_mensual.total   + EXCLUDED.total,
            pedidos    = public.beneficio_mensual.pedidos + 1,
            updated_at = now();
$$;

-- -----------------------------------------------------------------------------
-- Backfill: agrega los pedidos ya entregados al histórico mensual.
-- Sobreescribe (no suma) para no duplicar si el script se ejecuta dos veces.
-- -----------------------------------------------------------------------------
INSERT INTO public.beneficio_mensual (farmer_email, anio, mes, total, pedidos, updated_at)
SELECT
    farmer_email,
    EXTRACT(YEAR  FROM fecha)::int AS anio,
    EXTRACT(MONTH FROM fecha)::int AS mes,
    COALESCE(SUM(total), 0)::numeric(12, 2)         AS total,
    COUNT(*)::int                                    AS pedidos,
    now()                                            AS updated_at
FROM public.pedido
WHERE estado = 'entregado'
GROUP BY farmer_email,
         EXTRACT(YEAR  FROM fecha),
         EXTRACT(MONTH FROM fecha)
ON CONFLICT (farmer_email, anio, mes) DO UPDATE
    SET total      = EXCLUDED.total,
        pedidos    = EXCLUDED.pedidos,
        updated_at = now();
