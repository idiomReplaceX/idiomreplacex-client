(function(d, clientScriptsBaseUrl) {
  script = d.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = function(){
    idiomReplaceXUI(clientScriptsBaseUrl);
  };
  script.src = clientScriptsBaseUrl + 'js/idiomReplaceX.js';
  d.getElementsByTagName('head')[0].appendChild(script);
}(document, 'https://bgbm14463lap/'));