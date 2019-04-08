-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.9.2-alpha1
-- PostgreSQL version: 11.0
-- Project Site: pgmodeler.io
-- Model Author: ---


-- Database creation must be done outside a multicommand file.
-- These commands were put in this file only as a convenience.
-- -- object: new_database | type: DATABASE --
-- -- DROP DATABASE IF EXISTS new_database;
-- CREATE DATABASE new_database;
-- -- ddl-end --
-- 

-- object: public.usuario | type: TABLE --
-- DROP TABLE IF EXISTS public.usuario CASCADE;
CREATE TABLE public.usuario (
	id serial NOT NULL,
	nombre varchar NOT NULL,
	apellido varchar,
	CONSTRAINT pk_usuario PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.usuario OWNER TO postgres;
-- ddl-end --

-- object: public.rol | type: TABLE --
-- DROP TABLE IF EXISTS public.rol CASCADE;
CREATE TABLE public.rol (
	id serial NOT NULL,
	aplicacion varchar NOT NULL,
	usuario_id integer NOT NULL,
	CONSTRAINT pk_rol PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.rol OWNER TO postgres;
-- ddl-end --

-- object: fk_rol_usuario | type: CONSTRAINT --
-- ALTER TABLE public.rol DROP CONSTRAINT IF EXISTS fk_rol_usuario CASCADE;
ALTER TABLE public.rol ADD CONSTRAINT fk_rol_usuario FOREIGN KEY (usuario_id)
REFERENCES public.usuario (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --


