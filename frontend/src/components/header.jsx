import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/header.css";
export default function Header() {
  return (
    <section>
      <header id="header">
        <div className="logo">

        </div>
        <div className="bar"></div>
        <div className="action"></div>
      </header>
      <div className="temp">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </section>
  );
}
