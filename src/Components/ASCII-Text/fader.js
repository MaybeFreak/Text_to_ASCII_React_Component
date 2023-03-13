/*
    Module to encapsule fading
    by patorjk 
    http://patorjk.com/text-color-fader
    File licenced under Creative Commons Attribution 3.0 with Link to http://patorjk.com/text-color-fader

    This file creates two global JavaScript objects:
    * Fader -> General purpose color fading utility
    * TextFader -> For fading text. See interface below.

    Example usage:

    var retHtml = TextFader.fade({
        colors: ['#ff0000', '#0000ff'],
        txt: 'this is a test message',
        type: 'horizontal',
        output: 'html-span'
    });

    console.log( retHtml );

*/

"use strict";

var Fader =
  Fader ||
  (function () {
    var me = {};

    // ----------------------------------------------------------------------
    // Private functions
    // ----------------------------------------------------------------------

    var hexToDec = function (hex) {
      return parseInt(hex, 16);
    };
    var decToHex = function (dec) {
      var hex = Math.round(dec).toString(16);
      hex = hex.length < 2 ? "0" + hex : hex;
      return hex;
    };

    var twoColorFade = function (color1, color2, length) {
      var rIncr = (color2.r - color1.r) / (length - 1),
        gIncr = (color2.g - color1.g) / (length - 1),
        bIncr = (color2.b - color1.b) / (length - 1),
        colors = [],
        r = color1.r,
        g = color1.g,
        b = color1.b,
        ii;

      for (ii = 0; ii < length; ii++) {
        colors.push({ r: r, b: b, g: g });
        r = r + rIncr;
        g = g + gIncr;
        b = b + bIncr;
      }

      return colors;
    };

    var multiColorFade = function (colors, length) {
      var colorIncr = (length - 1) / (colors.length - 1),
        ii,
        len = Math.min(colors.length - 1, length),
        startPos = 0,
        endPos = 1,
        retColors = [],
        tmpColors,
        dist;

      for (ii = 0; ii < len; ii++) {
        endPos = Math.max(startPos + 2, endPos + colorIncr);
        dist = Math.round(endPos) - Math.round(startPos);

        tmpColors = twoColorFade(colors[ii], colors[ii + 1], dist);
        retColors.pop(); // remove last color
        retColors = retColors.concat(tmpColors);

        startPos = Math.round(endPos) - 1;
      }
      return retColors;
    };

    // ----------------------------------------------------------------------
    // Public functions
    // ----------------------------------------------------------------------

    /*
        config
        * colors - An array of colors. Colors objects can be either objects with 
            r, g, and b properties (between 0 and 255) or 6 digit hex strings.
        * length - Number of colors to return
        * returnType - 'rgb' or 'hex'
            'rgb' - return color objects with r, g, and b properties
            'hex' - return color objects that are 6 digit hex strings with a # in front
    */
    me.fade = function (config) {
      var ii,
        len = config.colors.length,
        colors,
        color,
        r,
        g,
        b;

      // convert hex colors to objects r,g,b properties
      for (ii = 0; ii < len; ii++) {
        color = config.colors[ii];
        if (typeof color === "string") {
          if (color.substr(0, 1) === "#") {
            color = color.substr(1);
          }

          // if using 3 char string, convert to 6 char strings
          if (color.length === 3) {
            color =
              color.substr(0, 1) +
              color.substr(0, 1) +
              color.substr(1, 1) +
              color.substr(1, 1) +
              color.substr(2, 1) +
              color.substr(2, 1);
          }

          r = hexToDec(color.substring(0, 2));
          g = hexToDec(color.substring(2, 4));
          b = hexToDec(color.substring(4, 6));
          config.colors[ii] = { r: r, g: g, b: b };
        }
      }

      // fade
      colors = multiColorFade(config.colors, config.length);

      // convert colors to hex if desired
      if (config.returnType === "hex") {
        len = colors.length;
        var numSign = config.numSign === false ? "" : "#"; // default to true
        for (ii = 0; ii < len; ii++) {
          color = colors[ii];
          colors[ii] =
            numSign + decToHex(color.r) + decToHex(color.g) + decToHex(color.b);
        }
      }

      return colors;
    };

    me.hexToDec = hexToDec;
    me.decToHex = decToHex;

    return me;
  })();

var TextFader =
  TextFader ||
  (function (fader) {
    var me = {};

    me.createFadeStr = function (
      output,
      openTagStart,
      color,
      openTagEnd,
      str,
      closeTag
    ) {
      var ret = "";
      switch (output) {
        case "carrd":
          ret = "[" + str + "]{#" + color + "}";
          break;
        default:
          ret = openTagStart + color + openTagEnd + str + closeTag;
      }
      return ret;
    };

    /*
        config
        * colors - an array of colors
        * txt - text to fade
        * type - type of fade ('vertical', 'horizontal', 'horizontal-line-by-line', 
            'horizontal-line-by-line-uniform', 'horizontal-spin-back', 'horizontal-spin-forward')
        * output - 'html-span', 'html-font', 'ezboard', 'vbulletin', 'forum', 'minecraft'
    */
    me.fade = function (config) {
      var colors = config.colors,
        txt = config.txt.replace(/\r\n/g, "\n").replace(/\r/g, "\n"), // normalize return character,
        type = config.type,
        output = config.output,
        txtLines = txt.split("\n"),
        openTagStart,
        openTagEnd,
        closeTag,
        lineStart,
        lineEnd,
        numSign = true,
        ii,
        jj,
        cIndex,
        elm,
        len,
        len2,
        fadeLen = 0,
        retColors,
        ret = "",
        spinForward,
        spinSpeed =
          typeof config.spinSpeed !== "undefined"
            ? parseInt(config.spinSpeed, 10)
            : 1;
      console.log(output);
      switch (output) {
        case "html-span":
          openTagStart = '<span style="color: ';
          openTagEnd = '">';
          closeTag = "</span>";
          lineStart = "<div>";
          lineEnd = "</div>";
          break;
        case "html-font":
          openTagStart = '<font color="';
          openTagEnd = '">';
          closeTag = "</font>";
          lineStart = "<div>";
          lineEnd = "</div>";
          break;
        case "ezboard":
          openTagStart = "[font color=";
          openTagEnd = "]";
          closeTag = "[/font]";
          lineStart = "";
          lineEnd = "\n";
          break;
        case "vbulletin":
        case "forum":
          openTagStart = "[color=";
          openTagEnd = "]";
          closeTag = "[/color]";
          lineStart = "";
          lineEnd = "\n";
          break;
        case "hex-text":
          openTagStart = "";
          openTagEnd = "";
          closeTag = "";
          lineStart = "";
          lineEnd = "\n";
          break;
        case "minecraft":
          openTagStart = "{";
          openTagEnd = "}";
          closeTag = "";
          lineStart = "";
          lineEnd = "\n";
          break;
        case "armagetron":
          openTagStart = "";
          openTagEnd = "";
          closeTag = "";
          lineStart = "";
          lineEnd = "\n";
          break;
        case "sc2mafia":
          openTagStart = '<c val="';
          openTagEnd = '">';
          closeTag = "</c>";
          lineStart = "";
          lineEnd = "\n";
          numSign = false;
          break;
        case "gemsOfWars":
          openTagStart = "[";
          openTagEnd = "]";
          closeTag = "";
          lineStart = "";
          lineEnd = "\n";
          numSign = false;
          break;
        case "carrd":
          openTagStart = "";
          openTagEnd = "";
          closeTag = "";
          lineStart = "";
          lineEnd = "\n";
          numSign = false;
          break;
      }

      switch (type) {
        case "vertical":
          len = txtLines.length;
          fadeLen = len;

          retColors = Fader.fade({
            colors: colors,
            length: fadeLen,
            returnType: "hex",
            numSign: numSign,
          });

          for (ii = 0; ii < len; ii++) {
            //ret += lineStart + openTagStart + retColors[ii] + openTagEnd + txtLines[ii] + closeTag + lineEnd;
            ret +=
              lineStart +
              me.createFadeStr(
                output,
                openTagStart,
                retColors[ii],
                openTagEnd,
                txtLines[ii],
                closeTag
              ) +
              lineEnd;
          }

          break;
        case "horizontal":
          len = txtLines.length;
          fadeLen = 0;
          for (ii = 0; ii < len; ii++) {
            fadeLen += txtLines[ii].length;
          }

          retColors = Fader.fade({
            colors: colors,
            length: fadeLen,
            returnType: "hex",
            numSign: numSign,
          });

          cIndex = 0;
          for (ii = 0; ii < len; ii++) {
            len2 = txtLines[ii].length;
            ret += lineStart;
            for (jj = 0; jj < len2; jj++) {
              if (
                txtLines[ii].substr(jj, 1) === " " &&
                (output === "vbulletin" || output === "forum")
              ) {
                ret += txtLines[ii].substr(jj, 1);
              } else {
                //ret += openTagStart + retColors[cIndex] + openTagEnd + txtLines[ii].substr(jj,1) + closeTag;
                ret += me.createFadeStr(
                  output,
                  openTagStart,
                  retColors[cIndex],
                  openTagEnd,
                  txtLines[ii].substr(jj, 1),
                  closeTag
                );
              }
              cIndex++;
            }
            ret += lineEnd;
          }

          break;
        case "horizontal-line-by-line":
          len = txtLines.length;

          for (ii = 0; ii < len; ii++) {
            fadeLen = txtLines[ii].length;

            retColors = Fader.fade({
              colors: colors,
              length: fadeLen,
              returnType: "hex",
              numSign: numSign,
            });

            cIndex = 0;
            len2 = txtLines[ii].length;
            ret += lineStart;
            for (jj = 0; jj < len2; jj++) {
              if (
                txtLines[ii].substr(jj, 1) === " " &&
                (output === "vbulletin" || output === "forum")
              ) {
                ret += txtLines[ii].substr(jj, 1);
              } else {
                //ret += openTagStart + retColors[cIndex] + openTagEnd + txtLines[ii].substr(jj,1) + closeTag;
                ret += me.createFadeStr(
                  output,
                  openTagStart,
                  retColors[cIndex],
                  openTagEnd,
                  txtLines[ii].substr(jj, 1),
                  closeTag
                );
              }
              cIndex++;
            }
            ret += lineEnd;
          }

          break;
        case "horizontal-line-by-line-uniform":
          len = txtLines.length;
          fadeLen = 0;
          for (ii = 0; ii < len; ii++) {
            fadeLen = Math.max(txtLines[ii].length, fadeLen);
          }

          retColors = Fader.fade({
            colors: colors,
            length: fadeLen,
            returnType: "hex",
            numSign: numSign,
          });

          cIndex = 0;
          for (ii = 0; ii < len; ii++) {
            len2 = txtLines[ii].length;
            ret += lineStart;
            for (jj = 0; jj < len2; jj++) {
              if (
                txtLines[ii].substr(jj, 1) === " " &&
                (output === "vbulletin" || output === "forum")
              ) {
                ret += txtLines[ii].substr(jj, 1);
              } else {
                //ret += openTagStart + retColors[cIndex] + openTagEnd + txtLines[ii].substr(jj,1) + closeTag;
                ret += me.createFadeStr(
                  output,
                  openTagStart,
                  retColors[cIndex],
                  openTagEnd,
                  txtLines[ii].substr(jj, 1),
                  closeTag
                );
              }
              cIndex++;
            }
            ret += lineEnd;
            cIndex = 0;
          }

          break;
        case "horizontal-spin-back":
          spinForward = false;
        case "horizontal-spin-forward":
          /*
                    TODO: This is a mess, refactor it
                */

          spinForward = typeof spinForward === "undefined" ? true : false;
          spinSpeed = typeof spinSpeed === "undefined" ? 1 : spinSpeed;

          len = txtLines.length;
          fadeLen = 0;
          retColors = [];
          for (ii = 0; ii < len; ii++) {
            fadeLen = Math.max(txtLines[ii].length, fadeLen);
          }

          for (ii = 0; ii < len; ii++) {
            while (txtLines[ii].length < fadeLen) {
              txtLines[ii] += " ";
            }

            retColors.push(
              Fader.fade({
                colors: colors,
                length: txtLines[ii].length,
                returnType: "hex",
                numSign: numSign,
              })
            );

            var extraSpinColors = Fader.fade({
              colors: [colors[colors.length - 1], colors[0]],
              length: Math.round(txtLines[ii].length / (colors.length - 1)), // so the added color doesn't look like an extra color
              returnType: "hex",
              numSign: numSign,
            });

            extraSpinColors.shift();
            extraSpinColors.pop();

            retColors[ii] = retColors[ii].concat(extraSpinColors);
            retColors[ii].jumpLength = spinSpeed; //(spinSpeed === 'fast') ? Math.max(Math.round(extraSpinColors.length/3),1) : 1;
          }

          cIndex = 0;
          for (ii = 0; ii < len; ii++) {
            len2 = txtLines[ii].length;
            ret += lineStart;
            for (jj = 0; jj < len2; jj++) {
              if (
                txtLines[ii].substr(jj, 1) === " " &&
                (output === "vbulletin" || output === "forum")
              ) {
                ret += txtLines[ii].substr(jj, 1);
              } else {
                //ret += openTagStart + retColors[ii][cIndex] + openTagEnd + txtLines[ii].substr(jj,1) + closeTag;
                ret += me.createFadeStr(
                  output,
                  openTagStart,
                  retColors[ii][cIndex],
                  openTagEnd,
                  txtLines[ii].substr(jj, 1),
                  closeTag
                );
              }

              cIndex++;
            }
            ret += lineEnd;

            if (spinForward) {
              for (var kk = 0; kk < retColors.length; kk++) {
                for (var ll = 0; ll < retColors[kk].jumpLength; ll++) {
                  elm = retColors[kk].pop();
                  retColors[kk].unshift(elm);
                }
              }
            } else {
              for (var kk = 0; kk < retColors.length; kk++) {
                for (var ll = 0; ll < retColors[kk].jumpLength; ll++) {
                  elm = retColors[kk].shift();
                  retColors[kk].push(elm);
                }
              }
            }

            cIndex = 0;
          }

          break;
      }

      if (output === "gemsOfWars") {
        ret = ret.replace(/\[[0-9a-fA-F]+\] /g, " ");
      }
      if (output === "armagetron") {
        ret = ret.replace(/#([0-9a-fA-F]{6})/g, function (match, group) {
          return "0x" + group;
        });
      }

      return ret;
    };

    return me;
  })(Fader);

export default TextFader;
