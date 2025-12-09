import React, { useState } from "react";
import "./ContactUs.css";
import api from "../../services/api";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await api.post("/contact/send", form);

      if (res.data.success) {
        setStatus("Message sent successfully! We will contact you soon.");
      } else {
        setStatus("Something went wrong. Try again!");
      }

      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Try again!");
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h2>Contact Us</h2>
        <p className="sub-text">We’d love to hear from you! Send us a message.</p>

        <form onSubmit={handleSubmit}>
          <div className="contact-row">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="contact-row">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="message"
            placeholder="Write your message..."
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>

          {status && <p className="status-text">{status}</p>}

          <button type="submit" className="contact-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
}
