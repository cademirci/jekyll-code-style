/*
    https://github.com/cademirci/ghost-code

    Author: Caglayan Demirci
    GitHub: cademirci
*/

window.addEventListener('load', () => {
    var codeBlocks = document.querySelectorAll("pre.highlight");

    for (var each = 0; each < codeBlocks.length; each++) {
        let self = codeBlocks[each],
            firstParentDiv = self.parentElement,
            highlighter = firstParentDiv.parentElement,
            ground = highlighter.parentElement, // the platform (div or body) that self (highlighted pre) stands on
            newBgColor = "";

        let gColor = window.getComputedStyle(ground).getPropertyValue("background-color"), // g: ground
            sbgColor = window.getComputedStyle(self).getPropertyValue("background-color"), // sbg: self background
            textColor = window.getComputedStyle(document.body).getPropertyValue("color")
        ;

        if (gColor === "rgba(0, 0, 0, 0)") {
            /* if this boolean expression returns true, that means author of the webpage did not set
               any background color for the parent platform. Most of the browsers set default backgrounds as
               white. So I will pretend like it has been set as solid white (rgb(255,255,255) or = #fff)
            */
            ground.style.backgroundColor = "#fff";
        }
        gColor = window.getComputedStyle(ground).getPropertyValue("background-color"); // again to be certain
        var gColors = gColor.replace("rgb(", "").replace(")", "").replace(" ", "").split(","),
            red = parseInt(gColors[0]),
            green = parseInt(gColors[1]),
            blue = parseInt(gColors[2]),
            addition = 15
        ;
        gColors = [red, green, blue];

        if (sbgColor == "rgba(0, 0, 0, 0)") {
            /* background color for code blocks has not been set.
               If they do, I will not override their background color.
            */
            if (red + green + blue > 128*3) {
                /* if sum of the values of the three color is greater than 128*3 which means multiple of
                   half of a maximum color value (255) with 3, I assume that this color is lighter. The
                   opposite situation shows that darker is the color. So if the color is darker, ghostization
                   should follow a way that increase the color values. Otherwise, decrease.
                */
                addition *= -1;
                for (var i = 0; i < gColors.length; i++) {
                    gColors[i] += addition;
                    if (gColors[i] < 0) { // if any color value got negative, rewind this adjustment.
                        gColors[i] *= -1;
                    }
                }
            }
            else {
                for (var i = 0; i < gColors.length; i++) {
                    gColors[i] += addition;
                    if (gColors[i] > 255) { // if any color value got over 255, fix it to 255.
                        gColors[i] = 255;
                    }
                }
            }
            newBgColor = "rgb(" + gColors[0] + ", " + gColors[1] + ", " + gColors[2] + ")";
            self.style.backgroundColor = newBgColor;
        }
        else {
            // if user implemented code background color, leave it be.
            newBgColor = sbgColor;
        }
        if (textColor == "rgba(0, 0, 0, 0)") {
            // if user did not implement text color,
            // let it be default browser text color (black).
            textColor = "rgb(0,0,0)";
        }

        let lns = document.getElementsByClassName("ln");
        for (var i = 0; i < lns.length; i++) {
            lns[i].style.color = mixColors(newBgColor, textColor, "name");
        }

        let commentLines = document.querySelectorAll(".c, .c1, .cm, .cs, .cp ");
        for (var i = 0; i < commentLines.length; i++) {
            commentLines[i].style.color = mixColors(newBgColor, textColor, "name");
        }
    }
})

function mixColors(x, y, type) {
    var xComponents = x.replace("rgb(", "").replace(")", "").replace(" ", "").split(","),
        yComponents = y.replace("rgb(", "").replace(")", "").replace(" ", "").split(","),
        newRed = 0,
        newGreen = 0,
        newBlue = 0
    ;

    newRed = Math.floor( // if number is double, floor it.
        (parseInt(xComponents[0]) + parseInt(yComponents[0])) / 2);
    newGreen = Math.floor(
        (parseInt(xComponents[1]) + parseInt(yComponents[1])) / 2);
    newBlue = Math.floor(
        (parseInt(xComponents[2]) + parseInt(yComponents[2])) / 2);

    if (type == "intValues") {
        return [newRed, newGreen, newBlue];
    }
    if (type == "name") {
        return "rgb(" + newRed + ", " + newGreen + ", " + newBlue + ")";
    }
}
