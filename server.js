const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

const homeController = require("./controllers/home");
const aboutController = require("./controllers/about");
const postRouter = require("./routers/posts");
const authRouter = require("./routers/auth");
const adminRouter = require("./routers/admin");

const notFoundRouteMiddleware = require("./middlewares/notFoundRoute");
const errorHandler = require("./middlewares/errorHandler");

const port = process.env.PORT;

// static files configuration
app.use(express.static("public"));

// client files configurations
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
app.get("/", homeController.index);
app.get("/about", aboutController.index);

app.use("/posts", postRouter);

app.use("/admin", adminRouter);
app.use("/login", authRouter);

// error handler middleware
app.use(errorHandler);

// page not found middleware
app.use(notFoundRouteMiddleware);

//SERVER LISTEN
app.listen(port || 8000, () => {
  console.log(`Server is running on port ${port}`);
});
