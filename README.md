# ASCII Text Component

<img src="https://cdn.discordapp.com/attachments/142745451207065600/1111618318743380058/image.png" />
<br/>
Ever wanted to recreate the retro feel of the late 90s and early 2000s or are you looking for a little something to spice up that boring page? <br/>
If so you have come to the right place, this 'simple' react component combines the <a href="https://www.npmjs.com/package/figlet" alt="Link to figlet npm package" >figlet package</a> together with a text fader script 
from <a href="https://patorjk.com/text-color-fader/" alt="Link to patorjk.com" >patorjk</a> to achieve impressive looking result in a slim and easy to use package.<br/>
<br/>
Note: This project is still being worked on and is not yet feature complete

## Setup 

### Adding to an existing project
  1.  Add the folder with the <a href="https://github.com/MaybeFreak/Text_to_ASCII_React_Component/tree/master/src/Components/ASCII-Text" >ASCII-Text</a> component to your project.
  2.  Depending on how your project is structured you might need to modify the import path for the fonts in the `ASCII-Text.jsx` at <a href="https://github.com/MaybeFreak/Text_to_ASCII_React_Component/blob/master/src/Components/ASCII-Text/ASCIIText.jsx#L20" > line 20. </a>
    The image below show the structure the component expects.<br/>
    <img src="https://cdn.discordapp.com/attachments/142745451207065600/1111627548061880340/image.png" />
  3.  Run `npm i figlet` to install the figlet package, this is used to convered plain text input to ASCII text.

### Running the preview project
  1. Run `npm i` to install necessary dependencies.
  2. Run `npm run dev` and got to the link shown in the terminal.
  3. **Explore** play around and see what is do able. 

## How to use
  You would use it the same as any other react component, the magic happens once we pass some props to the component.
  ```jsx
    <ASCIIText
    message={"replace me!"}
    font={"Standard"}
    fadeType={"vertical"}
    colors={["#fb6630", "#ff748d", "#c554f3", "#6f6ff4"]}
  />
  ```
  - `message` : The text you want to convert to ASCII text as string.
  - `font` : The name of the font you want to use, check `node_modules/figlet/fonts` or checkout <a target="_blank" href="https://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20" >patorjks converter</a>. <br/>(note: AOL Marco Fonts are not yet supported)
  - `fadeType` : The type of color fade you want to use, to see the available options checkout <a target="_blank" href="http://patorjk.com/text-color-fader/">patorjks color fader</a>.
  - `colors` : Takes a array of Hex color values to use as the colors for the fade, presets can be found in the `presets.js`. If you want to use a single color simply pass in a array with with the same color twice e.g: `["#FFFFFF", "#FFFFFF"]`

## Planned features
  - Imporve the way colors get used to make it easier to use presets and single colors.
  - Build a web app to make it easy to build the look you want by previewing the component and outputing it with the props already set so you can simply copy past it into your code.
