const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/posts");
});

router.get("/posts", async (req, res) => {
  const query = `SELECT
    posts.id AS post_id,
    posts.title AS title,
    posts.summary AS summary,
    posts.body AS body,
    posts.date AS date,
    authors.name AS author_name
    FROM posts
    JOIN authors ON posts.author_id = authors.id
    ORDER BY date DESC
    LIMIT 10;`;
  const result = await db.query(query);
  if (result.rows.length === 0) {
    res.redirect("/new-post");
    return;
  }
  res.render("posts-list", { posts: result.rows });
});

router.get("/new-post", async (req, res) => {
  const result = await db.query("SELECT * FROM authors");
  res.render("create-post", { authors: result.rows });
});

router.post("/posts", async (req, res) => {
  const query = `INSERT INTO posts
    (title, summary, body, author_id)
    VALUES
    ($1, $2, $3, $4)`;
  const values = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query(query, values);
  res.redirect("/posts");
});

router.get("/post/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    return res.status(404).render("404");
  }

  const query = `SELECT
    posts.id AS post_id,
    posts.title AS title,
    posts.summary AS summary,
    posts.body AS body,
    posts.date AS date,
    authors.name AS author_name,
    authors.email AS author_email
    FROM posts
    JOIN authors ON posts.author_id = authors.id
    WHERE posts.id = $1`;
  const values = [postId];
  const result = await db.query(query, values);
  if (result.rows.length !== 1) {
    return res.status(404).render("404");
  }
  res.render("post-detail", { post: result.rows[0] });
});

router.get("/update-post/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    return res.status(404).render("404");
  }

  const query = `SELECT
    posts.id AS post_id,
    posts.title AS title,
    posts.summary AS summary,
    posts.body AS body
    FROM posts
    WHERE posts.id = $1`;
  const values = [postId];
  const result = await db.query(query, values);
  if (result.rows.length !== 1) {
    return res.status(404).render("404");
  }
  res.render("update-post", { post: result.rows[0] });
});

router.post("/update-post/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    return res.status(404).render("404");
  }

  const query = `UPDATE posts
    SET
      title = $1,
      summary = $2,
      body = $3
    WHERE
      id = $4
  `;
  const values = [req.body.title, req.body.summary, req.body.content, postId];
  await db.query(query, values);
  res.redirect("/posts");
});

router.get("/delete-post/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    return res.status(404).render("404");
  }

  await db.query("DELETE FROM posts WHERE id = $1", [postId]);

  res.redirect("/posts");
});

module.exports = router;
