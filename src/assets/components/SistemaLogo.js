import React from "react";
import "../../App.css";
import logo from "../../img/Sistema.png";

export default function Logo() {
  return (
    <a href={window.location.origin}>
      <img className="logo" src={logo} alt="Sistema logo"></img>
    </a>
  );
}
