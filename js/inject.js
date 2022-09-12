(function(d, clientScriptsBaseUrl, filterServiceBaseUrl) {
  let script = d.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = function(){
    // idiomReplaceX.minWordThreshold = 2;
    idiomReplaceX.filterServiceBaseUrl = filterServiceBaseUrl;
    idiomReplaceX.ui(clientScriptsBaseUrl);
    var debug = false;
    idiomReplaceX.extractTextBlocks(debug);
    // idiomReplaceX.requestForReplaceX(); // now called in idiomReplaceX.fetchMethodOptions()
  };
  script.src = clientScriptsBaseUrl + 'js/idiomReplaceX.js';
  d.getElementsByTagName('head')[0].appendChild(script);
// }(document, 'https://bgbm14463lap/', 'https://bgbm14463lap/service/src/'));
}(document, 'https://idiomreplacex.de/client/', 'https://idiomreplacex.de/service/src/'));