CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author_id INTEGER NOT NULL
);

INSERT INTO authors (
  name,
  email
)
VALUES (
  'Max Cat',
  'max@cat.cats'
), (
  'Mini Kitten',
  'mini@kitten.cats'
);
