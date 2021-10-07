idiomReplaceXHeader = function() {
  var bar = document.createElement('div');
  bar.innerHTML = '<h1 style="margin-top: 10px; text-align: center;">IdiomReplaceX</h1>';
  bar.style.position = "absolute";
  bar.style.top = "0";
  bar.style.left = "0";
  bar.style.height = "50px";
  bar.style.width = "100%";
  bar.style.backgroundColor = "green"
  document.body.style.margin.top = "30px";
  document.body.appendChild(bar);
}

document.addEventListener("DOMContentLoaded", (event) => {
  console.log('DOM is ready.')
  idiomReplaceXHeader();
});
