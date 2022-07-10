const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/posts");
});

router.get("/posts", async (req, res) => {
  const query = `SELECT * FROM posts
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

module.exports = router;
