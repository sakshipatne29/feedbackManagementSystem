const express = require("express");
const router = express.Router();
const {
  getFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedback,
} = require("../controllers/feedbackController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getFeedbacks).post(createFeedback);
router.route("/:id").get(getFeedback).put(updateFeedback).delete(deleteFeedback);

module.exports = router;
