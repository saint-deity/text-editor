// text editor

// save text
const thinSpace = ' ';

function saveText() {
  var text = document.getElementById('text').innerHTML;
  localStorage.setItem('text', text);
}

//.. inputs
let selection_col = 0;
let selection_row = 1;

let insert_enabled = false;

function Blink () {
  let row = document.getElementById('row' + selection_row)
  let children = row.children;

  //.. caret :: toggle
  for (let i = 0; i < children.length; i++) {
    if (children[i].id.includes('thin')) {
      //.. caret :: styles :: check
      if (children[i].style.visibility == 'hidden') {
        if (children[i].id == 'thin' + selection_col) {
          children[i].style.visibility = 'visible';
        }
      } else {
        if (children[i].id == 'thin' + selection_col) {
          children[i].style.visibility = 'hidden';
        } else {
          children[i].style.visibility = 'hidden';
        }
      }
    }
  }
}

document.body.addEventListener('keydown', function (key) {
  let ignored = [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 16, 17, 18, 20, 91, 92, 93, 144, 145, 19, 36, 33, 34, 44, 27]
  //.. inputs :: debug
  if (key.keyCode == 13) {
    //.. post-nodes
    let row = document.getElementById('row' + selection_row);
    let thin = row.querySelector('#thin' + selection_col);

    //.. node :: check postive ranges
    let node = thin.nextSibling;

    let carried = [];
    if (node) {
      while (node) {
        //.. node :: carry :: exception; last
        carried.push(node.innerHTML);
        node.parentNode.removeChild(node);
        node = node.nextSibling;
      }
    }
      //.. node :: thin space
      
  } else if (ignored.includes(key.keyCode)) {
    //.. inputs :: igored
    return;
  } else if (key.keyCode == 8) {
    //.. if backspace, fix linecount, fix text
    //.. post-nodes
    console.log(selection_col);
    let row = document.getElementById('row' + selection_row)
    let thin = row.querySelector('#thin' + selection_col);

    //.. node :: move range
    if (selection_col == 0) {
      //.. node :: end range :: exception
      return;
    }

    let node = thin.previousSibling;
    if (!node) {
      //.. node :: end range :: exception
      return;
    }

    let thins = node.previousSibling;

    //.. node :: remove
    if (node.id == 'thin0') {
      return;
    }

    if (node.id == 'row' + selection_row) {
      return;
    }

    node.parentNode.removeChild(node);
    thins.parentNode.removeChild(thins);

    //.. node :: move caret
    selection_col -= 1;
    if (selection_col < 0) {
      if (selection_row == 1) {
        //.. node :: end range :: exception
        return;
      }

      selection_row -= 1;
      selection_col = document.getElementById('row' + selection_row).children.length - 1;
    }

    //.. caret :: toggle
    Blink();
    
    //.. node :: fix postive ranges
    for (let i = 0; i < row.children.length; i++) {
      let id = 0;
      if (row.children[i].id.includes('thin')) {
        id = row.children[i].id.replace('thin', '');
        if (id > selection_col) {
          //.. node :: children :: fix range
          row.children[i].id = 'thin' + (id - 1);
        }
      } else if (row.children[i].id.includes('col')) {
        id = row.children[i].id.replace('col', '');
        if (id > selection_col) {
          //.. node :: children :: fix range
          row.children[i].id = 'col' + (id - 1);
        }
      }
    }
  } else if (key.keyCode == 32) {
    //.. post-nodes
    let row = document.getElementById('row' + selection_row)
    let thin = row.querySelector('#thin' + selection_col);

    //.. node :: thin space
    let thins = document.createElement('span');
    thins.id = 'thin' + (selection_col + 1);
    thins.className = 'char caret';
    thins.innerHTML = thinSpace;

    //.. node :: space
    let node = document.createElement('span');
    node.id = 'col' + selection_col;
    node.className = 'char';
    node.innerHTML = "&#8200;";

    //.. node :: insert
    thin.parentNode.insertBefore(node, thin.nextSibling);
    thin.parentNode.insertBefore(thins, node.nextSibling);

    //.. caret :: toggle
    Blink();

    //.. node :: fix selection_col
    selection_col++;
  } else if (key.keyCode == 37){
    //.. post-nodes
    let row = document.getElementById('row' + selection_row)
    let thin = row.querySelector('#thin' + selection_col);

    //.. node :: move range
    let node = thin.previousSibling;
    if (!node) {
      //.. node :: end range :: exception
      return;
    }

    let thins = node.previousSibling;

    //.. caret :: toggle
    Blink();
    //.. node :: fix selection_col
    selection_col = node.id.replace('col', '');
  } else if (key.keyCode == 45) {
    //.. insert :: toggle
    insert_enabled = !insert_enabled;
  } else if (key.keyCode == 39) {
    //.. post-nodes
    let row = document.getElementById('row' + selection_row)
    let thin = row.querySelector('#thin' + selection_col);

    //.. node :: move range
    let node = thin.nextSibling;
    if (!node) {
      //.. node :: end range :: exception
      return;
    }

    let thins = node.nextSibling;

    //.. caret :: toggle
    Blink();

    //.. node :: fix selection_col
    selection_col = thins.id.replace('thin', '');
  } else if (key.keyCode == 9) {
    //.. if tab, add span with thin space
  } else if (key.keyCode == 46) {
    //.. post-nodes
    let row = document.getElementById('row' + selection_row)
    let thin = row.querySelector('#thin' + selection_col);

    //.. node :: identify
    let node = thin.nextSibling;
    if (!node) {
      //.. node :: end range :: exception
      return;
    }

    let thins = node.nextSibling;

    //.. node :: remove
    node.parentNode.removeChild(node);
    thins.parentNode.removeChild(thins);

    //.. node :: fix postive ranges
    for (let i = 0; i < row.children.length; i++) {
      let id = 0;
      if (row.children[i].id.includes('thin')) {
        id = row.children[i].id.replace('thin', '');
        if (id > selection_col) {
          //.. node :: children :: fix range
          row.children[i].id = 'thin' + (id - 1);
        }
      } else if (row.children[i].id.includes('col')) {
        id = row.children[i].id.replace('col', '');
        if (id > selection_col) {
          //.. node :: children :: fix range
          row.children[i].id = 'col' + (id - 1);
        }
      }
    }
  } else if (key.keyCode == 35) {
    //.. post-nodes
    let row = document.getElementById('row' + selection_row)

    //.. node :: end range
    let children = row.children;
    let last = children[children.length - 1];
    
    //.. node :: fix selection_col
    selection_col = last.id.replace('thin', '');
    Blink();
  } else if (key.keyCode == 36) {

  } else {
    //.. post-nodes
    let row = document.getElementById('row' + selection_row)
    let thin = row.querySelector('#thin' + parseInt(selection_col));

    //.. node :: key
    let node = document.createElement('span');
    node.id = 'col' + selection_col;

    let time_node = Date.now();
    node.setAttribute('data-time', Date.now());

    node.className = 'char';
    node.innerHTML = key.key;
    
    //.. node :: thin space
    let thins = document.createElement('span');
    thins.id = 'thin' + (parseInt(selection_col) + 1);
    
    let time_thins = Date.now();
    thins.setAttribute('data-time', Date.now());

    thins.className = 'char caret';
    thins.innerHTML = thinSpace;

    //.. node :: insert
    thin.parentNode.insertBefore(node, thin.nextSibling);
    node.parentNode.insertBefore(thins, node.nextSibling);

    selection_col++;
    
    //.. node :: range fix :: following nodes
    let children = row.children;
    for (let i = 0; i < children.length; i++) {
      let id = children[i].id;
      if (id.includes('thin')) {
        id = id.replace('thin', '');

        if (id >= selection_col) {
          if (children[i].getAttribute('data-time')) {
            if ((Date.now() - children[i].getAttribute('data-time')) > (Date.now() - time_thins)) {
              children[i].id = 'thin' + (parseInt(id) + 1);
            }
          }
        }
      } else if (id.includes('col')) {
        id = id.replace('col', '');

        if (id >= (selection_col-1)) {
          if (children[i].getAttribute('data-time') & children[i].innerHTML != key) {
            if ((Date.now() - children[i].getAttribute('data-time')) > (Date.now() - time_node)) {
              children[i].id = 'col' + (parseInt(id) + 1);
            }
          }
        }
      }
    }

    //.. caret :: toggle
    Blink();
  }
});

// read input from mouse on class 'char'
document.body.addEventListener('click', function (e) {
  if (e.target && e.target.className == 'char') {
    console.log(e.target);
    // ranges :: row & col
    let row = e.target.parentNode.id;
    let col = e.target.id;

    selection_row = row.replace('row', '');
    selection_col = col.replace('col', '');

    //.. caret :: toggle
    Blink();
  }
});

//.. caret :: blink
setInterval(function () {
  Blink();
}, 500);

// scroll to bottom on load
window.onload = function () {
  var text = document.getElementById('text');
  text.scrollTop = text.scrollHeight;

  var lineCount = document.getElementById('linecount');
  lineCount.scrollTop = lineCount.scrollHeight;
}
