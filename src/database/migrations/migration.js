// 1. Import required libraries
const pgPromise = require("pg-promise");
const dotenv = require("dotenv");
const fs = require("fs");

// 2. Load environment variables
dotenv.config();

// 3. Initialize pg-promise
const pgp = pgPromise({});
const cn =
  `${process.env.DATABASE_PROVIDER}://${process.env.DATABASE_USER}` +
  `:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:` +
  `${process.env.DATABASE_PORT}/${process.env.DATABASE}`;
const db = pgp(cn);

// 4. Define the SQL script
const sqlScript = `
-- DROP SCHEMA api;

CREATE SCHEMA api AUTHORIZATION postgres;

-- api.users definition

-- Drop table

-- DROP TABLE api.users;

CREATE TABLE api.users (
	id serial4 NOT NULL,
	login varchar(255) NOT NULL,
	github_id int4 NOT NULL,
	node_id varchar(255) NOT NULL,
	avatar_url varchar(255) NULL,
	gravatar_id varchar(255) NULL,
	url varchar(255) NULL,
	html_url varchar(255) NULL,
	followers_url varchar(255) NULL,
	following_url varchar(255) NULL,
	gists_url varchar(255) NULL,
	starred_url varchar(255) NULL,
	subscriptions_url varchar(255) NULL,
	organizations_url varchar(255) NULL,
	repos_url varchar(255) NULL,
	events_url varchar(255) NULL,
	received_events_url varchar(255) NULL,
	"type" varchar(50) NULL,
	site_admin bool NULL,
	"name" varchar(255) NULL,
	company varchar(255) NULL,
	blog varchar(255) NULL,
	"location" varchar(255) NULL,
	email varchar(255) NULL,
	hireable bool NULL,
	bio text NULL,
	twitter_username varchar(255) NULL,
	public_repos int4 NULL,
	public_gists int4 NULL,
	followers int4 NULL,
	"following" int4 NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT users_github_id_key UNIQUE (github_id),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


-- api.users_languages definition

-- Drop table

-- DROP TABLE api.users_languages;

CREATE TABLE api.users_languages (
	id serial4 NOT NULL,
	user_id int4 NULL,
	"language" varchar(255) NULL,
	CONSTRAINT users_languages_pkey PRIMARY KEY (id),
	CONSTRAINT users_languages_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES api.users(id) ON DELETE CASCADE
);
`;

// 5. Write migration file
const migrationFileName = "migration.sql"; // Change this as needed
fs.writeFileSync(migrationFileName, sqlScript);

// 6. Run the migration
db.any(sqlScript)
  .then(() => {
    console.log("Migration completed successfully.");
    pgp.end();
  })
  .catch((error) => {
    console.error("Error running migration:", error);
    pgp.end();
  });
