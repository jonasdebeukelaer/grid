CREATE TABLE matrix (
	coordinates INTEGER NOT NULL,
	colour CHAR(6) NOT NULL,
	date_set TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	user VARCHAR(255)
);