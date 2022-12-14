// version is *not* viable for production use
let keywords = [
  {
    "local": "hsl(258, 60%, 66%)",
    "let": "hsl(258, 60%, 66%)",
  }
]

var code = []

// start of credit 
// to Tim Down
function getCaretPosition(editableDiv) {
  var caretPos = 0,
    sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == editableDiv) {
      var tempEl = document.createElement("span");
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}
// end of credit

// color the keywords
function colorKeywords(key) {
  let text = document.getElementById('text');
  // wrap the keywords in spans
  let cursorStart = getCaretPosition(text);
  for (let i = 0; i < keywords.length; i++) {

    // get text cursor position
    console.log(cursorStart);

    // check if the keyword is in the text
    let textContent = text.innerHTML;
    let keyword = Object.keys(keywords[i])[0];
    let keywordIndex = textContent.indexOf(keyword);
    if (keywordIndex > -1) {
      // get the keyword color
      let keywordColor = keywords[i][keyword];

      // add font color to the keyword
      let keywordStart = keywordIndex;
      let keywordEnd = keywordIndex + keyword.length;
      let keywordStartText = textContent.substring(0, keywordStart);
      let keywordText = textContent.substring(keywordStart, keywordEnd);
      let keywordEndText = textContent.substring(keywordEnd);
      textContent = keywordStartText + '<span style="color: ' + keywordColor + '">' + keywordText + '</span>' + keywordEndText;

      // fix the text cursor position
      if (cursorStart > keywordStart) {
        cursorStart += 27;
      }
    }

    // set the text
    text.innerHTML = textContent;

    // set the text cursor position
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(text.childNodes[0], cursorStart);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

// color the keywords on input
document.getElementById('text').addEventListener('input', colorKeywords);

// color the keywords on load
colorKeywords();
