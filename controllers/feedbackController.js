const asyncHandler = require("express-async-handler");
const Feedback = require("../models/feedbackModel");

//@desc Get all Feedback
//@route GET /api/feedback
//@access private
const getFeedbacks = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({ user_id: req.user.id });
  // res.status(200).json({ message: "Get all Feedback" });
  res.status(200).json(feedbacks);
});

//@desc Create new Feedback
//@route POST /api/feedback
//@access private
const createFeedback = asyncHandler(async (req, res) => {
  console.log("The request body is : ", req.body);
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const feedback = await Feedback.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  // res.status(201).json({ message: "Create Feedback" });
  res.status(201).json(feedback);
});

//@desc Get a Feedback
//@route GET /api/feedback/:id
//@access private
const getFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) {
    res.status(404);
    throw new Error("Feedback not found");
  }

  // res.status(200).json({ message: `Get Feedback for ${req.params.id}` });
  res.status(200).json(feedback);
});

//@desc Update Feedback
//@route PUT /api/feedback/:id
//@access private
const updateFeedback = asyncHandler(async (req, res) => {
  const feedbackId = req.params.id;

  try {
    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      res.status(404);
      throw new Error("Feedback not found");
    }

    if (feedback.user_id.toString() !== req.user.id) {
      res.status(403);
      throw new Error(
        "User doesn't have permission to update other user's Feedbacks"
      );
    }

    const updateFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      req.body,
      { new: true }
    );

    res.status(200).json({ message: `Feedback with ID ${feedbackId} has been updated`, updateFeedback });

  } catch (error) {
    console.error("Error updating Feedback:", error);
    res.status(500).json({ message: "An error occurred while updating the Feedback" });
  }
});


//@desc Delete Feedback
//@route DELETE /api/feedback/:id
//@access private
const deleteFeedback = asyncHandler(async (req, res) => {
  const feedbackId = req.params.id;
  try {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      res.status(404);
      throw new Error("Feedback not found");
    }

    if (feedback.user_id.toString() !== req.user.id) {
      res.status(403);
      throw new Error(
        "User doesn't have permission to delete other user's Feedbacks"
      );
    }
    await Feedback.findByIdAndDelete(feedbackId);
    console.log("Feedback successfully deleted");
    res
      .status(200)
      .json({ message: `Feedback with ID ${feedbackId} has been deleted` });
  } catch (error) {
    console.error("Error deleting Feedback:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the Feedback" });
  }
});

module.exports = {
  getFeedbacks,
  createFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
};
