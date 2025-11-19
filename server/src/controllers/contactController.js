import Contact from "../models/Contact.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Create contact message
    const newMessage = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message saved successfully!",
      data: newMessage,
    });
  } catch (err) {
    console.error("Contact error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
