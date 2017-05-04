CREATE TABLE IF NOT EXISTS projects (
	project_id BIGINT UNIQUE,
	name TEXT,
	description TEXT
);

CREATE TABLE IF NOT EXISTS gradings (
	id BIGINT UNIQUE AUTO_INCREMENT,
	project_id BIGINT,
	juror TEXT,
	creativity FLOAT,
	original FLOAT,
	technical FLOAT,
	useful FLOAT,
	cool FLOAT,
	social FLOAT,
	pitch FLOAT
);

CREATE TABLE IF NOT EXISTS public_gradings (
	id BIGINT UNIQUE AUTO_INCREMENT,
	project_id BIGINT,
	phone_number TEXT
);