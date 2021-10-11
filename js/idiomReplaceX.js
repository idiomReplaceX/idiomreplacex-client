/*
 * use like e.g.:
 *
    document.addEventListener("DOMContentLoaded", (event) => {
      idiomReplaceXUI("https://idiomReplaceX.de/client/");
      console.log('DOM is ready.')
    });
 *
 */

idiomReplaceXUI = function(baseURL) {
  var styleEl = document.createElement('link');
  styleEl.setAttribute("rel", "stylesheet");
  styleEl.setAttribute("type", "text/css");
  styleEl.setAttribute("href", baseURL + "/css/style.css");
  document.head.appendChild(styleEl);
  var bar = document.createElement('div');
  bar.setAttribute('id', 'idiomReplaceXUI')
  bar.innerHTML = '<h3>IdiomReplaceX</h3>';
  document.body.appendChild(bar);
}

walkDOM = function (node,func) {
  node = node.firstChild;
  while(node) {
    if(walkDOM(node, func)){
      break;
    }
    node = node.nextSibling;
  }
  return func(node);  //this will invoke the functionToInvoke from arg
};

function countWords(str) {
  str = str.replace(/(^\s*)|(\s*$)/gi,"");
  str = str.replace(/[ ]{2,}/gi," ");
  str = str.replace(/\n /,"\n");
  return str.split(' ').length;
}

processTextContainer = function(node) {
  if(node.tagName == 'DIV' || node.tagName == 'P'){
  	console.log(node.tagName + ": " + node.innerText);
    if(node.innerText && countWords(node.innerText) > 5) {
      console.log(" >> GOTCHA!!!")
      node.style.backgroundColor = 'yellow';
      return true;
    }
  }
};

idiomReplaceXUI('https://test.e-taxonomy.eu/test');
walkDOM(document.body, processTextContainer);


