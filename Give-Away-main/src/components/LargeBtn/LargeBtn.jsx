import React from "react";
import './LargeBtn.scss';
import { Link } from "react-router-dom";

// Existing LargeBtn component
export function LargeBtn({ link, text }) {
  return <Link className='LargeBtn' to={link}>{text}</Link>;
}


