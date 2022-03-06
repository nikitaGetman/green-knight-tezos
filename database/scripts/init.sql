-- Table: public.secure_access

-- DROP TABLE IF EXISTS public.secure_access;

CREATE TABLE IF NOT EXISTS public.secure_access
(
    id serial NOT NULL,
    title text,
    code character(8) NOT NULL,
    token_id numeric NOT NULL,
    PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.secure_access
    OWNER to admin;


-- Table: public.links

-- DROP TABLE IF EXISTS public.links;

CREATE TABLE IF NOT EXISTS public.links
(
    id serial NOT NULL,
    type text NOT NULL,
    token_id numeric NOT NULL,
    min_balance bigint,
    link text NOT NULL,
    PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.links
    OWNER to admin;


-- Table: public.sa_to_link_map

-- DROP TABLE IF EXISTS public.sa_to_link_map;

CREATE TABLE IF NOT EXISTS public.sa_to_link_map
(
    sa_id bigint NOT NULL REFERENCES public.secure_access (id) MATCH SIMPLE ON DELETE CASCADE,
    link_id bigint REFERENCES public.links (id) MATCH SIMPLE ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sa_to_link_map
    OWNER to admin;