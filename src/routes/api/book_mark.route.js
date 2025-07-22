const express = require("express");
const bookmarkController = require("@/controllers/book_mark.controller");
const authJWT = require("@/middlewares/authJWT");

const router = express.Router();

router.get("/book-marked-by/:type/:id", bookmarkController.getBookMarks);
router.get("/list/:type/:id", bookmarkController.getBookMarkedUserId);
router.post("/:type/:id", authJWT, bookmarkController.bookmark);
router.delete("/:type/:id", authJWT, bookmarkController.unBookMark);
router.get("/check/:type/:id", authJWT, bookmarkController.check);
router.delete(
  "/delete-all/:type/:id",
  authJWT,
  bookmarkController.deleteAllBookMark
);

module.exports = router;
