import React from "react";
import "./AboutUs.scss";
import { DecoratedHeader } from "../DecoratedHeader/DecoratedHeader";

export function AboutUs() {
  return (
    <div className="AboutUs">
      <div className="AboutUs-description">
        <DecoratedHeader text2="About us" />
        <p>
        "Your donation nourishes lives—providing fresh meals with broccoli, lentils, potatoes, and more.
         Every contribution brings hope, care, and a brighter future for those in need."
        </p>
      </div>
      <div className="AboutUs-image"></div>
    </div>
  );
}
