import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div style={{ backgroundColor: "#F0E5DA", minHeight: "100vh" }}>
            {/* Hero Section */}
            <section
                className="text-center d-flex flex-column justify-content-center align-items-center"
                style={{
                    minHeight: "80vh",
                    background: "linear-gradient(135deg, #fffaf6, #f6e4d8)",
                    padding: "3rem 1rem",
                }}
            >
                <h1 className="fw-bold display-4" style={{ color: "#5A3E36" }}>
                    Capture Every Wedding Memory in One Place
                </h1>
                <p className="lead mt-3" style={{ maxWidth: "600px", color: "#6b4b43" }}>
                    Let your guests share photos, videos, and heartfelt wishes easily.
                    With just a QR code, everything is collected into a beautiful digital
                    album for the couple to cherish forever.
                </p>
                <Link to="/contact" className="btn btn-dark btn-lg mt-4">
                    Book Your Page
                </Link>
            </section>

            {/* Features Section */}
            <section className="container py-5">
                <div className="row text-center">
                    <div className="col-md-4 mb-4">
                        <h3>🎉 Simple & Fun</h3>
                        <p>No app downloads needed. Guests scan a QR code and start posting instantly.</p>
                    </div>
                    <div className="col-md-4 mb-4">
                        <h3>💌 Heartfelt Messages</h3>
                        <p>Friends and family can leave personal notes alongside photos and videos.</p>
                    </div>
                    <div className="col-md-4 mb-4">
                        <h3>📸 All in One Album</h3>
                        <p>Every post is collected in a single event page — the couple’s own wedding wall.</p>
                    </div>
                </div>
            </section>

            {/* Call To Action Section */}
            <section
                className="text-center py-5 px-3"
                style={{ background: "#5A3E36", color: "#fff" }}
            >
                <h2 className="fw-bold">Make Your Wedding Memories Last Forever</h2>
                <p className="mt-3">
                    Let us set up a personalized wedding page for you.
                    Your guests will be able to share photos, videos, and heartfelt wishes with ease.
                </p>
                <Link to="/contact" className="btn btn-light btn-lg mt-3">
                    Get in Touch
                </Link>
            </section>
        </div>
    );
};

export default Home;
