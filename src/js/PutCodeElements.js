/*
    https://github.com/cademirci/ghost-code

    Author: Caglayan Demirci
    GitHub: cademirci
*/

window.addEventListener('load', () => {
    var codeBlocks = document.querySelectorAll("pre.highlight");

    for (var each = 0; each < codeBlocks.length; each++) {
        let self = codeBlocks[each].children[0], // code inside pre in the array
            highlighterClassName = codeBlocks[each].parentElement.parentElement.className,
            languageName = highlighterClassName
            .substring(0, highlighterClassName.indexOf(" "))
            .replace("language-", "")
            .toUpperCase()
        ;
        var code = self.innerHTML,
            lines = code.split('\n')
        ;
        if (languageName == "TERMINAL") {
            // if language is terminal (shell), put dollar signs instead numbers
            // and its symbol (>_) as pre::before content.
            self.parentElement.setAttribute("data-before", ">_");
            self.innerHTML = putShellDollarSigns(lines);
        } else {
            // put the language name as pre::before content
            // put line nummbers
            self.parentElement.setAttribute("data-before", languageName);
            if (lines.length > 5) {
                // if number of lines is less than 5, code numbers are unnecessary
                self.innerHTML = putLineNumbers(lines);
            }
        }
    }
})

function putLineNumbers(lines) { // parameter: code lines, array
    var numberAndSpace = "",
        lineWithNumber = "",
        codeWithLineNumbers = ""
    ;
    for (var i = 0; i < lines.length; i++) {
        if (i != lines.length - 1) { // if this is not the last line
            var number = i + 1;
            if (number < 10) {
                /* &ensp is a HTML entity that represents a single whitespace character.
                   I use them for the code to behavior as a single block,
                   otherwise when digit numbers increase, the current code line would
                   be shifted one character.
                */
                numberAndSpace = "<span class='ln'>" + number + "&ensp;&ensp;&ensp;</span>";
            }
            else if (number < 100) {
                // 9   x
                // 10  x
                numberAndSpace = "<span class='ln'>" + number + "&ensp;&ensp;</span>";
            }
            else {
                // 99  x
                // 100 x
                numberAndSpace = "<span class='ln'>" + number + "&ensp;</span>";
                // I assume users do not put over 1000-line code on their page.
                // this would be odd.
            }
            lineWithNumber = numberAndSpace + lines[i];
            codeWithLineNumbers += lineWithNumber + "\n";
        }
    }
    return codeWithLineNumbers;
}

function putShellDollarSigns(lines) {
    var lineWithSign = "",
        codeWithSigns = "";

    for (var i = 0; i < lines.length; i++) {
        if (i != lines.length - 1) {
            lineWithSign = "<span class='ln'>~$&ensp;&ensp;</span>" + lines[i];
            codeWithSigns += lineWithSign + "\n";
        }
    }
    return codeWithSigns;
}
