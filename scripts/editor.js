// text editor
// save text
  function saveText() {
    var text = document.getElementById('text').innerHTML;
    localStorage.setItem('text', text);
  }

// save text on input
  document.getElementById('text').addEventListener('input', saveText);

// textarea
  // change textarea height on input
  document.getElementById('text').addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

// line count
  // get line count
    let first = true;
    function getLineCount() {
      var text = document.getElementById('text').innerHTML;
      var lineCount = text.split('<div>').length;

      if (lineCount > 2) {
        if (first) {
          lineCount--;
          first = false;
          console.log('first false');
        }
      } else if (lineCount == 1) {
        if (first) {
          first = true;
          console.log('first true');
        }
      }
      return lineCount;
    }

  // set line count
    function setLineCount() {
      var lineCount = getLineCount();
      var lineCountList = document.getElementById('linecount');
      var lineCountListItems = lineCountList.getElementsByTagName('li');
      var lineCountListItemsLength = lineCountListItems.length;

      if (lineCountListItemsLength < lineCount) {
        for (var i = lineCountListItemsLength; i < lineCount; i++) {
          var li = document.createElement('li');
          li.appendChild(document.createTextNode(i + 1));
          lineCountList.appendChild(li);
        }
      } else if (lineCountListItemsLength > lineCount) {
        for (var i = lineCountListItemsLength; i > lineCount; i--) {
          lineCountList.removeChild(lineCountList.lastChild);
        }
      }
    }

  // set line count on input
    document.getElementById('text').addEventListener('input', setLineCount);

  // set line count on load
    setLineCount();

// scroll to bottom on load
  window.onload = function () {
    var text = document.getElementById('text');
    text.scrollTop = text.scrollHeight;

    var lineCount = document.getElementById('linecount');
    lineCount.scrollTop = lineCount.scrollHeight;
  }