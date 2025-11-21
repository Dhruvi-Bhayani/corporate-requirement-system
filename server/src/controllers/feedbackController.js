import Feedback from "../models/Feedback.js";

export const submitFeedback = async (req, res) => {
  try {
    const { rating, message } = req.body;
    const userId = req.user?.id || null; // if logged in

    if (!rating || !message) {
      return res.status(400).json({ error: "Rating and message are required" });
    }

    const saved = await Feedback.create({
      rating,
      message,
      user_id: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
      data: saved,
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.findAll({
      order: [["created_at", "DESC"]],  // FIXED
    });

    return res.status(200).json({
      success: true,
      data: feedbackList,
    });
  } catch (error) {
    console.error("Fetch feedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getLatestFeedback = async (req, res) => {
  try {
    const latest = await Feedback.findAll({
      limit: 2,
      order: [["created_at", "DESC"]],
    });

    return res.json({ success: true, data: latest });
  } catch (error) {
    console.error("Latest feedback error:", error);
    return res.status(500).json({ success: false });
  }
};

