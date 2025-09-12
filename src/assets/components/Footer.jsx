// src/components/Footer.jsx
import React from "react";

const Footer = () => {
    return (
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-5 border-top">
            <div className="col-md-4 d-flex align-items-center">
                <a
                    href="/"
                    className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
                    aria-label="Bootstrap"
                >
                    <svg className="bi" width="30" height="24" aria-hidden="true">
                        <use xlinkHref="#bootstrap"></use>
                    </svg>
                </a>
                <span className="mb-3 mb-md-0 text-body-secondary">
                    © 2025 Manganui, Inc

                </span>
            </div>

        </footer>
    );
};

export default Footer;
