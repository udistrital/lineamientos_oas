-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.9.2-alpha1
-- PostgreSQL version: 10.0
-- Project Site: pgmodeler.io
-- Model Author: ---


-- Database creation must be done outside a multicommand file.
-- These commands were put in this file only as a convenience.
-- -- object: new_database | type: DATABASE --
-- -- DROP DATABASE IF EXISTS new_database;
-- CREATE DATABASE new_database;
-- -- ddl-end --
-- 

-- object: public.usurio | type: TABLE --
-- DROP TABLE IF EXISTS public.usurio CASCADE;
CREATE TABLE public.usurio (
	id serial NOT NULL,
	nombre varchar,
	CONSTRAINT pk_usuario PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.usurio OWNER TO postgres;
-- ddl-end --


