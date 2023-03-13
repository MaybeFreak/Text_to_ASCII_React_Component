import { useEffect, useState } from "react";
import figlet from "figlet";
import TextFader from "./fader";
import standard from "figlet/importable-fonts/Slant";

const ASCIIText = ({ message = "REPLACE ME", colors = "ff0000" }) => {
  const [output, setOutput] = useState("");
  const [final, setFinal] = useState("");

  console.log(message);

  useEffect(() => {
    figlet.parseFont("Standard", standard);
    figlet.text(message, { font: "Standard" }, (err, data) => {
      if (err) {
        console.log("Oh no");
      }
      setOutput(data);
    });
  }, []);

  useEffect(() => {
    const config = {
      colors: colors, // ["#fb6630", "#ff748d", "#c554f3", "#6f6ff4"]
      txt: output,
      type: "vertical",
      output: "html-font",
    };
    setFinal(TextFader.fade(config));
  }, [output]);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: final }}></div>
    </>
  );
};

export default ASCIIText;
