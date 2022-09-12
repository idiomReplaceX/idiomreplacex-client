let  clientScriptsBaseUrl = 'https://idiomreplacex.de/client/';
let  filterServiceBaseUrl = 'https://idiomreplacex.de/service/src/';

// idiomReplaceX.minWordThreshold = 2;
idiomReplaceX.filterServiceBaseUrl = filterServiceBaseUrl;
idiomReplaceX.ui(clientScriptsBaseUrl);
let debug = false;
idiomReplaceX.extractTextBlocks(debug);
// idiomReplaceX.requestForReplaceX(); now called in idiomReplaceX.fetchMethodOptions()