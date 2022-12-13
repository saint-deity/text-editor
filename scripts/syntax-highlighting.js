let keywords = [
  {
    "local": "hsl(258, 60%, 66%)",
  }
]

// color the keywords
function colorKeywords() {
  let text = document.getElementById('text');
  // wrap the keywords in spans
  for (let i = 0; i < keywords.length; i++) {
    let keyword = keywords[i];
    let keywordName = Object.keys(keyword)[0];
    let keywordColor = keyword[keywordName];
    let keywordRegex = new RegExp(keywordName, 'g');
    text.innerHTML = text.innerHTML.replace(keywordRegex, `<span style="color: ${keywordColor}">${keywordName}</span>`);
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