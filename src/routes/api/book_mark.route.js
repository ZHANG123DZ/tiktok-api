const express = require("express");
const bookmarkController = require("@/controllers/book_mark.controller");
const auth = require("@/middlewares/auth");

const router = express.Router();

router.get("/book-marked-by/:type/:id", bookmarkController.getBookMarks);
router.get("/list/:type/:id", bookmarkController.getBookMarkedUserId);
router.post("/:type/:id", auth, bookmarkController.bookmark);
router.delete("/:type/:id", auth, bookmarkController.unBookMark);
router.get("/check/:type/:id", auth, bookmarkController.check);
router.delete(
  "/delete-all/:type/:id",
  auth,
  bookmarkController.deleteAllBookMark
);

module.exports = router;
