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

function Blink (n) {
  let row = document.getElementById('row' + selection_row)
  let children = row.children;

  if (n) {
    for (let i = 0; i < children.length; i++) {
      if (children[i].id.includes('thin')) {
        children[i].style.visibility = 'hidden';
      }
    }
    return;
  }

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

function position_tracker() {
  let pos = document.getElementById('poshint');
  pos.innerHTML = 'Ln ' + selection_row + ', Col ' + selection_col;
}

function height_fix() {
  // fix height according to the wrap of the elements
  let height = 0;
  let row = document.getElementById('row' + selection_row);
  let children = row.children;
  for (let i = 0; i < children.length; i++) {
    if (children[i].offsetHeight > height) {
      height = children[i].offsetHeight;
    }
  }

  row.style.height = height + 'px';
}

window.addEventListener('keydown', (e) => {  
  if (e.keyCode === 32 && e.target === document.body) {  
    e.preventDefault();  
  }
});

document.body.addEventListener('keydown', function (key) {
  let ignored = [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 16, 17, 18, 20, 91, 92, 93, 144, 145, 19, 36, 33, 34, 44, 27, 38, 40]
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
        if (node.id.includes('col')) {
          carried.push(node.innerHTML);
        }

        //.. node :: remove
        node.parentNode.removeChild(node);
        node = thin.nextSibling;
      }
    }
    
    //.. node :: new row
    let new_row = document.createElement('div');
    new_row.id = 'row' + (selection_row + 1);
    new_row.className = 'row';
    document.getElementById('text').appendChild(new_row);
    
    //.. node :: new thin
    let new_thin = document.createElement('span');
    new_thin.id = 'thin0';
    new_thin.className = 'thin caret';
    new_thin.innerHTML = thinSpace;
    new_row.appendChild(new_thin);

    //.. node :: append carried
    for (let i = 0; i < carried.length; i++) {
      //.. node :: new col
      let new_col = document.createElement('span');
      new_col.id = 'col' + (i + 1);
      new_col.className = 'col';
      new_col.innerHTML = carried[i];
      new_row.appendChild(new_col);

      //.. node :: new thin
      let new_thin = document.createElement('span');
      new_thin.id = 'thin' + (i + 1);
      new_thin.className = 'thin caret';
      new_thin.innerHTML = thinSpace;
      new_row.appendChild(new_thin);
    }

    //.. caret :: disable
    Blink(true);

    //.. caret :: move
    selection_row += 1;
    selection_col = 0;

    //.. redraw linecount
    let linecount = document.getElementById('linecount');
    linecount.innerHTML = '';
    for (let i = 1; i <= selection_row; i++) {
      let line = document.createElement('li');
      line.id = 'line' + i;
      
      //.. line :: styles :: offsets to be below the previous row
      let offset = 0;
      for (let j = 1; j < i; j++) {
        let row = document.getElementById('row' + j);
        offset += (row.offsetHeight - 26)
        console.log(row.offsetHeight);
      }

      line.style.marginTop = offset + 'px';

      line.innerHTML = i;
      linecount.appendChild(line);
    }

    //.. caret :: toggle
    Blink();
    position_tracker();
  } else if (ignored.includes(key.keyCode)) {
    //.. inputs :: igored
    return;
  } else if (key.keyCode == 8) {
    //.. post-nodes
    console.log(selection_col);
    let row = document.getElementById('row' + selection_row)
    let thin = row.querySelector('#thin' + selection_col);

    //.. node :: move range
    let node = thin.previousSibling;
    let thins = '';
    if (node && node.previousSibling) {
      thins = node.previousSibling;
    } else {
      if (row.children.length == 1 || selection_col == 0) {
        //.. caret :: move
        let new_row = document.getElementById('row' + (selection_row-1));
        selection_col = 0;

        //.. row :: final id
        let last = new_row.children[new_row.children.length-1];
        last = last.id;
        last = last.replace('thin', '');
        selection_col = parseInt(last);

        //.. cols :: carry
        let carried = [];
        if (row.children.length > 1) {
          for (let i = 0; i < row.children.length; i++) {
            if (row.children[i].id.includes('col')) {
              carried.push(row.children[i]);
            }
          }

          let max_range = 0;
          for (let i = 0; i < new_row.children.length; i++) {
            if (new_row.children[i].id.includes('thin')) {
              max_range += 1;
            }
          }

          for (let i = 0; i < carried.length; i++) {
            //.. node :: new col
            let new_col = document.createElement('span');
            new_col.id = 'col' + max_range;
            new_col.className = 'col';
            new_col.innerHTML = carried[i].innerHTML;
            new_row.appendChild(new_col);

            //.. node :: new thin
            let new_thin = document.createElement('span');
            new_thin.id = 'thin' + (max_range + 1)
            new_thin.className = 'thin caret';
            new_thin.innerHTML = thinSpace;
            new_row.appendChild(new_thin);

            max_range += 1;
          }

          //.. insert linecount indicator
        let linecount = document.getElementById('linecount');
        linecount.innerHTML = '';
        for (let i = 0; i < document.getElementById('text').children.length; i++) {
          let line = document.createElement('li');
          line.innerHTML = i + 1;
          
          let height = document.getElementById('text').children[i].offsetHeight;
          line.style.height = (height +4) + 'vh';

          linecount.appendChild(line);
        }

          //.. caret :: disable
          Blink(true);
        }

        //.. row :: remove
        row.parentNode.removeChild(row);

        selection_row -= 1;
        //.. caret :: toggle
        Blink();
        position_tracker();

        return
      }
    }


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

    //.. caret :: toggle
    Blink();
    position_tracker();
    
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
    position_tracker();

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
    position_tracker();
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
    position_tracker();

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

    //.. caret :: toggle
    Blink();
    position_tracker();
  } else if (key.keyCode == 35) {
    //.. post-nodes
    let row = document.getElementById('row' + selection_row)

    //.. node :: end range
    let children = row.children;
    let last = children[children.length - 1];
    
    //.. node :: fix selection_col
    selection_col = last.id.replace('thin', '');
    Blink();
    position_tracker();
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
    let t0 = [];
    let t1 = [];

    for (let i = 0; i < children.length; i++) {
      if (children[i].id.includes('thin')) {
        t0.push(children[i]);
      } else if (children[i].id.includes('t1')) {
        t1.push(children[i]);
      }
    }

    for (let i = 0; i < t0.length; i++) {
      //.. node :: thin :: id set
      t0[i].id = 'thin' + i;
    }

    for (let i = 0; i < t1.length; i++) {
      //.. node :: col :: id set
      t1[i].id = 'col' + i;
    }

    //.. caret :: toggle
    Blink();
    position_tracker();
  }

  //.. handle ctrl + key
  if (key.ctrlKey) {
    if (key.keyCode == 90) {
      //.. undo :: toggle
      undo();
    } else if (key.keyCode == 89) {
      //.. redo :: toggle
      redo();
    }
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
