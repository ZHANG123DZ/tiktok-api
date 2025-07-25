const express = require("express");
const postsController = require("@/controllers/post.controller");
const authJWT = require("@/middlewares/authJWT");

const router = express.Router();

router.get("/", postsController.index);
router.get("/latest", postsController.latest);
router.get("/featured", postsController.featured);
router.post("/related", postsController.related);
router.get("/:key", postsController.show);
router.post("/", authJWT, postsController.store);
router.put("/:key", authJWT, postsController.update);
router.patch("/:key", authJWT, postsController.update);
router.delete("/:key", authJWT, postsController.destroy);

module.exports = router;
