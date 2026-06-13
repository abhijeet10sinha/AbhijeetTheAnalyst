const ContactMessage = require("../models/ContactMessage");

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, reason, message } = req.body;

    if (!name || !email || !reason || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields."
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || "",
      reason,
      message
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      contactId: contactMessage._id
    });
  } catch (error) {
    console.error("Contact form error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later."
    });
  }
};

module.exports = {
  submitContactMessage
};