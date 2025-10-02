import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        // <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 border-top">
        //     <div className="col-md-4 d-flex align-items-center">
        //         <a
        //             href="/"
        //             className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
        //             aria-label="Bootstrap"
        //         >
        //             <svg className="bi" width="30" height="24" aria-hidden="true">
        //                 <use xlinkHref="#bootstrap"></use>
        //             </svg>
        //         </a>
        //         <span className="mb-3 mb-md-0 text-body-secondary">
        //             © 2025 Ridwan Yusoff
        //         </span>
        //         <div className="text-muted">
        //             Enquiry <Link to="/contact">Here</Link>
        //         </div>
        //     </div>

        // </footer>

        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 border-top bg-light container">
            {/* Left side: logo + copyright */}
            <div className="col-md-4 d-flex align-items-center">
                <span className="mb-md-0 text-muted">
                    © 2025 Ridwan Yusoff
                </span>
            </div>

            {/* Right side: links */}
            <ul className="nav">
                <li className="nav-item">
                    <Link to="/contact" className="btn btn-outline-primary btn-sm">
                        Enquire Here
                    </Link>
                </li>
            </ul>
        </footer>

    );
};

export default Footer;
