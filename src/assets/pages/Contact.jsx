import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    const response = await fetch("https://formspree.io/f/xnngvqbk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setSubmitted(true);            // show success message
      setFormData({ name: "", email: "", message: "" }); // clear form
    } else {
      alert("There was an error. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F0E5DA",
        minHeight: "100vh",
        padding: "4rem 1rem",
      }}
    >
      <div className="container" style={{ maxWidth: "600px" }}>
        <h1 className="text-center fw-bold mb-4" style={{ color: "#5A3E36" }}>
          Contact Us
        </h1>
        <p className="text-center mb-4" style={{ color: "#6b4b43" }}>
          We’d love to hear from you! Reach out to us for enquiries or to set up
          your personalized wedding page.
        </p>

        <div className="mb-4 text-center">
          <p style={{ marginBottom: "0.5rem" }}>
            📧 Email: <a href="mailto:ridwanyusoff93@gmail.com">ridwanyusoff93@gmail.com</a>
          </p>
          <p>
            📞 Phone: +65 91198614
          </p>
        </div>

        <h5 className="mb-3" style={{ color: "#5A3E36" }}>Or send us a message directly:</h5>

        {submitted && (
          <div className="alert alert-success" role="alert">
            Thank you! Your message has been sent.
          </div>
        )}

        {/* <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Your Email"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              rows="5"
              placeholder="Your Message"
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-dark btn-lg">
              Send Message
            </button>
          </div>
        </form> */}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Your Email"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              rows="5"
              placeholder="Your Message"
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-dark btn-lg">
              Send Message
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Contact;
