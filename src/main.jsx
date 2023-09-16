import React from "react";
import ReactDOM from "react-dom/client";
import ASCIIText from "./Components/ASCII-Text/ASCIIText";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ASCIIText
    message={" Hello World !"}
    font={"Larry 3D"}
    fadeType={"horizontal-line-by-line"}
    colors={["#fb6630", "#ff748d", "#c554f3", "#6f6ff4"]}
    htmlClassname="preview"
  />
);
