const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: 80
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      maxlength: 120
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: ""
    },

    reason: {
      type: String,
      required: [true, "Reason for contact is required"],
      trim: true,
      maxlength: 100
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 2000
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);