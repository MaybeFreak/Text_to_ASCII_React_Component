import React from "react";
import ReactDOM from "react-dom/client";
import ASCIIText from "./Components/ASCII-Text/ASCIIText";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ASCIIText
    message={"what is object destructuring ?"}
    colors={["#fb6630", "#ff748d", "#c554f3", "#6f6ff4"]}
  />
);
