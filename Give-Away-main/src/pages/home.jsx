import React from "react";
import { Link } from "react-router-dom";
import { NavHeader } from "../components/NavHeader/NavHeader.jsx";
import { ThreeColumns } from "../components/ThreeColumns/ThreeColumns.jsx";
import { WhatsItAbout } from "../components/WhatsItAbout/WhatsItAbout.jsx";
import { AboutUs } from "../components/AboutUs/AboutUs.jsx";
import { Foundation } from "../components/Foundation/Foundation.jsx";
import { Contact } from "../components/Contact/Contact.jsx";
import { Footer } from "../components/Footer/Footer.jsx";

export function Home() {
  return (
    <> 
      <NavHeader />
      <ThreeColumns />
      <WhatsItAbout />
      <AboutUs />
      <Foundation />
      <Contact />
      
      {/* Navigation Button to Give Away Page */}
      <div style={{ textAlign: "center", margin: "20px" }}>
        <Link to="/give-away">
          <button style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
            Go to Give Away
          </button>
        </Link>
      </div>

      <Footer />
    </>
  );
}
