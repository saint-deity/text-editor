let keywords = [
  {
    'local': '#ff0000',
  }
]

// wrap every word in a span
function wrapWords() {
  let text = document.getElementById('text').innerHTML
  let words = text.split(' ')
  let output = ''
  for (let i = 0; i < words.length; i++) {
    let word = words[i]
    let color = getColor(word)
    if (color) {
      output += `<span style="color: ${color};">${word}</span>`
    } else {
      output += word
    }
    output += ' '
  }
  document.getElementById('text').innerHTML = output
}

// get color based on word
function getColor(word) {
  for (let i = 0; i < keywords.length; i++) {
    let keyword = keywords[i]
    if (keyword.hasOwnProperty(word)) {
      return keyword[word]
    }
  }
  return null
}

// call wrapWords() when the user stops typing
let typingTimer
let doneTypingInterval = 500

document.getElementById('text').addEventListener('keyup', function () {
  clearTimeout(typingTimer)
  typingTimer = setTimeout(wrapWords, doneTypingInterval)
})

// call wrapWords() when the user starts typing
document.getElementById('text').addEventListener('keydown', function () {
  clearTimeout(typingTimer)
})

// call wrapWords() when the page loads
wrapWords()