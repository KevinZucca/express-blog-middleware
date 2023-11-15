const express = require("express");
const fs = require("fs");
const path = require("path");
const loadNav = require("../utilities/loadNav");
const jsonPosts = require("../db.json");
const { kebabCase, update } = require("lodash");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function index(req, res) {
  res.format({
    html: () => {
      const homePage = fs.readFileSync(
        path.resolve(__dirname, "../layouts/posts/posts.html"),
        "utf-8"
      );
      const htmlContent = [];

      htmlContent.push("<h1>Ricette</h1>");
      htmlContent.push('<div id="container" class="container">');

      for (const post of jsonPosts) {
        if (post.image.originalname) {
          post.image = post.image.originalname;
        }
        htmlContent.push(
          `<div class="card">
            <img id="card-img" src='/imgs/posts/${post.image}'>
              <div class="card-body">
                  <h2>${post.title} </h2>
                  <p class="card-text">${post.content} </p>
                  <strong>${post.tags} </strong>
                  <button id="recipe-button">
                    <a id="recipe-link" href="/posts/${post.slug}">Vai alla ricetta!</a>
                  </button>
              </div>
          </div>`
        );
      }

      htmlContent.push("</div>");
      const joinedHtml = htmlContent.join("");

      const navbar = loadNav();
      const finalHome = homePage
        .replace("@navbar", navbar)
        .replace("@content", joinedHtml);

      res.type("html").send(finalHome);
    },
  });
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function show(req, res) {
  res.format({
    json: () => {
      const post = findOrFail(req, res);

      const postSlug = req.params.slug;
      const searchedPost = jsonPosts.find((post) => post.slug == postSlug);
      searchedPost.image_url = "/imgs/posts/" + post.image;

      if (post.image.destination) {
        searchedPost.image_url =
          post.image.destination + "/" + post.image.originalname;
      }

      if (!searchedPost) {
        res.status(404).send(`Post con slug ${postSlug} non trovato`);
        return;
      }
      res.type("json").send(searchedPost);
    },
  });
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function create(req, res) {
  res.format({
    html: () => {
      const html = "<h1>Creazione nuovo post</h1>";
      res.type("html").send(html);
    },
    default: () => {
      res.status(406).send("impossibile creare nuovo post");
    },
  });
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function store(req, res) {
  res.format({
    html: () => {
      res.redirect(301, "/");
    },
    default: () => {
      let newPost = req.body;
      const newPostTitle = jsonPosts.find(
        (post) => post.title == req.body.title
      );

      if (!newPostTitle) {
        newPost = {
          ...req.body,
          slug: kebabCase(newPost.title),
          image: req.file,
        };

        jsonPosts.push(newPost);

        const updatedJsonList = JSON.stringify(jsonPosts, null, 2);
        fs.writeFileSync(
          path.resolve(__dirname, "..", "db.json"),
          updatedJsonList
        );

        res.type("json").send(newPost);
      } else {
        res.status(406).send("Il post esiste già");
      }
    },
  });
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function destroy(req, res) {
  res.format({
    html: () => {
      res.redirect(301, "/");
    },
    default: () => {
      const postSlug = req.params.slug;
      const post = jsonPosts.find((post) => post.slug == postSlug);
      if (post) {
        res.type("html").send("<strong>Post eliminato</strong>");
        return;
      } else {
        res.status(404).send("Post non trovato");
        return;
      }
    },
  });
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function download(req, res) {
  const post = findOrFail(req, res);
  const filePath = path.resolve(
    __dirname,
    "..",
    "public",
    "imgs",
    "posts",
    post.image
  );

  res.download(filePath, post.image);
}

function findOrFail(req, res) {
  const postSlug = req.params.slug;

  const post = jsonPosts.find((post) => post.slug == postSlug);

  if (!post) {
    res.status(404).send(`Post con slug '${postSlug}' non trovato`);
    return;
  }

  return post;
}

module.exports = { index, show, create, download, store, destroy };
