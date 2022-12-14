// version is *not* viable for production use
let keywords = [
  {
    "local": "hsl(258, 60%, 66%)",
    "let": "hsl(258, 60%, 66%)",
  }
]

// color the keywords
function colorKeywords() {
  let text = document.getElementById('text');
  // wrap the keywords in spans
  for (let i = 0; i < keywords.length; i++) {

    // get text before and after selection
    let selectionStart = text.selectionStart;
    let selectionEnd = text.selectionEnd;
    let before = text.value.substring(0, selectionStart);
    let after = text.value.substring(selectionEnd, text.value.length);
   
    // wrap every word in a span
    for (let word in keywords[i]) {
      let regex = new RegExp(word, 'g');
      text.innerHTML = text.innerHTML.replace(regex, '<font color="' + keywords[i][word] + '">' + word + '</font>');

      // restore selection with range
      let range = document.createRange();
      range.setStart(text.firstChild, selectionStart);
      range.setEnd(text.firstChild, selectionEnd);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

// color the keywords on input
document.getElementById('text').addEventListener('input', colorKeywords);

// color the keywords on load
colorKeywords();

// scroll to bottom on load
window.onload = function () {
  let text = document.getElementById('text');
  text.scrollTop = text.scrollHeight;
}
