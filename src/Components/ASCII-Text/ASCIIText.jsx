import { useEffect, useState } from "react";
import figlet from "figlet";
import TextFader from "./fader";

const ASCIIText = ({
  message = "REPLACE ME",
  font = "Standard",
  colors = ["#00ff00"],
  fadeType = "vertical",
  htmlClassname = "asciiTextComp",
}) => {
  const [output, setOutput] = useState("");
  const [final, setFinal] = useState("");
  const [loadedFont, setLoadedFont] = useState(null);

  useEffect(() => {
    loadFont();
  }, []);

  const loadFont = async () => {
    await import(`../../../node_modules/figlet/importable-fonts/${font}.js`)
      .then((res) => res.default)
      .then((flt) => setLoadedFont(flt));
  };

  useEffect(() => {
    if (loadedFont) {
      figlet.parseFont("Standard", loadedFont);
      figlet.text(message, { font: "Standard" }, (err, data) => {
        if (err) {
          console.log("Oh no");
        }
        setOutput(data);
      });
    }
  }, [loadedFont]);

  useEffect(() => {
    const config = {
      colors: colors.length === 1 ? [colors[0], colors[0]] : colors, // ["#fb6630", "#ff748d", "#c554f3", "#6f6ff4"]
      txt: output,
      type: fadeType,
      output: "html-font",
    };
    setFinal(TextFader.fade(config));
  }, [output]);

  return (
    <>
      <div
        className={htmlClassname}
        dangerouslySetInnerHTML={{ __html: final }}
      ></div>
    </>
  );
};

export default ASCIIText;
