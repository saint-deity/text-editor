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
  // get index of users selection
  let selectionIndex = text.selectionStart;
  let letterbefore = true;
  // wrap the keywords in spans
  for (let i = 0; i < keywords.length; i++) {

    // get user selection position
    // wrap every word in a span
    for (let word in keywords[i]) {
      let regex = new RegExp(word, 'g');
      text.innerHTML = text.innerHTML.replace(regex, '<font color="' + keywords[i][word] + '">' + word + '</font>');
    }

    // send user select to last position
    if (letterbefore) {
      // create range
      let range = document.createRange();
      let sel = window.getSelection();

      // transform selection index to
      let selectionIndex = selectionIndex + 1;

      // set range to last letter
      range.setStart(text.childNodes[0], selectionIndex);
      range.setEnd(text.childNodes[0], selectionIndex);

      // set selection
      sel.removeAllRanges();
      sel.addRange(range);
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