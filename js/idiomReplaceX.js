/*
 *
 *
 */
;
(function(document, window, undefined) {

  let bindTo = window;

  bindTo.idiomReplaceX = {};

  bindTo.idiomReplaceX.minWordThreshold = 5;
  bindTo.idiomReplaceX.filterServiceBaseUrl = null;
  bindTo.idiomReplaceX.relevantTextBlocks = {};
  bindTo.idiomReplaceX.revertDataList = [];

  const FILTERS_DISABLED = '-- disabled --';

  bindTo.idiomReplaceX.TextBlock = function(node){
    this.htmlChecksum = b_crc32(node.innerHTML);
    this.innerText = node.innerText.slice(); // assure the string is copied and not passed by reference
    this.node = node;
    this.children = [];
    this.toString = function () {
      return "<" + this.node.tagName + " : " + this.htmlChecksum + ">";
    };
  }

  let serviceBaseURL = null;
  let cookieName= "idiomReplaceXMethod";
  let methodSelectElement = null;
  let defaultFilter = undefined;
  let metadataDiv = null;
  let methodDataList = [];

  /**
   * Global function to add the idiomReplaceX UI to a web page.
   *
   * @param baseURL the base URLs of the location where the idiomreplacex-client scripts are hosted
   */
  bindTo.idiomReplaceX.ui = function(baseURL) {
    serviceBaseURL = baseURL;
    var styleEl = document.createElement('link');
    styleEl.setAttribute("rel", "stylesheet");
    styleEl.setAttribute("type", "text/css");
    styleEl.setAttribute("href", baseURL + "/css/style.css");
    document.head.appendChild(styleEl);
    var bar = document.createElement('div');
    bar.setAttribute('id', 'idiomReplaceXUI')
    // bar.innerHTML = '<h3>IdiomReplaceX</h3>';
    bar.innerHTML = '<section><div id="idiomreplacex-logo-container" class="logo-container"><img class="irx-logo" src="' + baseURL + '/image/irx-logo100px.png" /></div><div class="form-container">' +
      '<label for="idiomreplacex-method"><a href="https://idiomreplacex.de">IdiomReplaceX</a> method:</label>' +
      '<form><select id="idiomreplacex-method" name="method">' +
      '<option value="" selected>initializing ...</option>' +
      '</select><div id="idiomreplacex-metadata"></div></form></div></section>';
    bar.querySelector("#idiomreplacex-logo-container").addEventListener('click', function(event){
      bar.style.left = bar.style.left == '-80px' ? '-300px' : '-80px';
    });
    document.body.appendChild(bar);
    methodSelectElement = bar.querySelector("#idiomreplacex-method");
    metadataDiv = bar.querySelector("#idiomreplacex-metadata");
    // TODO use bindTo.idiomReplaceX.filterServiceBaseUrl instead of baseURL ???
    fetchMethodOptions(baseURL, methodSelectElement);
    methodSelectElement.addEventListener('change', function(event){
      if(getCookie(cookieName) !== event.target.value){
        setCookie(cookieName, event.target.value, 10);
        bindTo.idiomReplaceX.requestForReplaceX();
      }
    })
  }

  let fetchMethodOptions = function(baseURL, selectElement){
    jsonQuery("GET",  "v2/methods", null, function(jsonData){

      methodDataList = jsonData;
      selectElement.innerHTML = "";

      let option = document.createElement("option");
      option.setAttribute('name', FILTERS_DISABLED);
      option.innerText = FILTERS_DISABLED;
      selectElement.appendChild(option);

      methodDataList.forEach(function(methodData){
        let methodName = methodData.name;
        if(defaultFilter == undefined){
          defaultFilter = methodName;
        }
        let option = document.createElement("option");
        option.setAttribute('name', methodName);
        option.innerText = methodName;
        selectElement.appendChild(option);
      });
      let defaultOption = getCookie(cookieName);
      if(defaultOption){
        selectElement.value = defaultOption;
      }
      bindTo.idiomReplaceX.requestForReplaceX();
    })
  }

  function setCookie(name,value,days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
  function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }


  /**
   * Calculates a crc32 checksum for the given text
   *
   * @param text
   * @returns {number}
   */
  let b_crc32 = function (text) {
    const a_table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
    const b_table = a_table.split(' ').map(function(s){ return parseInt(s,16) });
    let crc = -1;
    for(let i=0, iTop=text.length; i<iTop; i++) {
      crc = ( crc >>> 8 ) ^ b_table[( crc ^ text.charCodeAt( i ) ) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  let countWords = function(str) {
    str = str.replace(/(^\s*)|(\s*$)/gi,"");
    str = str.replace(/[ ]{2,}/gi," ");
    str = str.replace(/\n /,"\n");
    return str.split(' ').length;
  }

  function jsonQuery(httpMethod, serviceMethod, payload, successCallBack) {
    let xmlHttp = new XMLHttpRequest();
    // see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
    xmlHttp.open(httpMethod, bindTo.idiomReplaceX.filterServiceBaseUrl + serviceMethod, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.onload = function (e) {
      if (xmlHttp.readyState === 4) {
        if(xmlHttp.status === 200) {
        try {
          let jsonData = JSON.parse(xmlHttp.responseText);
          successCallBack(jsonData);
        } catch (syntaxError) {
          console.error(syntaxError + ' DATA: ' + xmlHttp.responseText);
        }
        } else {
          console.error("ERROR xmlHttp.status: " + xmlHttp.status);
        }
      }
    }
    xmlHttp.onerror = function (e) {
      console.error(xmlHttp.statusText);
    };
    xmlHttp.send(payload);
  }

  /**
   * Matches nodes which are ELEMENT_NODE and displayed with an outer display type of 'block'.
   *
   * @param node
   * @returns {boolean}
   */
  let isTextBlock = function (node){
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    if(node.nodeType == Node.ELEMENT_NODE && node.innerText != undefined){ // e.g. svg nodes have no innerText
      let computedStyle = window.getComputedStyle(node);
      return (computedStyle.display.indexOf('block') >= 0);
    }
    return false;
  }

  /**
   * See https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
   *
   * @param node
   * @returns {Window.idiomReplaceX.TextBlock}
   *
   *   {
   *     htmlChecksum:
   *     textLength:
   *     node:
   *     children: [] // array of TextBlockData
   *   }
   */
  let textContainerData = function(node) {
    if(node) {
      if (isTextBlock(node)) {
        //console.log(node.tagName + ": " + node.innerText);
          return new bindTo.idiomReplaceX.TextBlock(node);
      }
    }
    return null;
  };

  /**
   * Collects the non empty innerTexts of the tree contained in subTextBlocks
   * and returns them as flat list.
   *
   * @param subTextBlocks
   * @returns {*[]}
   */
  let collectSubTreeInnerTexts = function(subTextBlocks){
  const innerTexts = [];
  subTextBlocks.forEach(function(subBlock){
    if(subBlock.innerText.length > 0) {
      innerTexts.push(subBlock.innerText.trim());
    }
    innerTexts.push(...collectSubTreeInnerTexts(subBlock.children));
  });
  return innerTexts;
}

  /**
   * Compares both texts so that longer texts will come before shorter texts.
   *
   * @param textA
   * @param textB
   * @returns {number}
   */
  var compareByTextLength = function(textA, textB) {
    if(textA.length === textB.length){
      return 0;
    } else if (textA.length > textB.length){
      return -1;
    } else {
      return 1;
    }
  }

  /**
   * This is the core text block extraction method. It walks the dom tree, descends first into its depths.
   *
   * @param siblingNodes
   * @returns {*[]}
   */
  let findTextBlockElements = function (siblingNodes) {

    let siblingTextBlocks = [];
    siblingNodes.forEach(function(siblingNode) {
      // 1. descend into children
      let childrenTexBlocks = [];
      if(siblingNode.nodeName == 'IFRAME'){
        // Can not yet properly handle DOM errors in case of cross domain origin access to the iframe document
        // therefore below code is commented:
        // -----------------------------------------------------------------------------------------------------
        // console.log("IFRAME.document:" + siblingNode.contentWindow.document.childNodes);
        // let iframeDocument = siblingNode.contentWindow.document.catch(function(error) {
        //   console.error("Can't access IFRAME content: " + error);
        // });
        // if(iframeDocument){
        //   let iframeBodyChildNodes = siblingNode.contentWindow.document.body.childNodes;
        //   if(!iframeBodyChildNodes) {
        //     console.warn("IFRAME.document.childNodes is empty");
        //   } else {
        //     childrenTexBlocks = findTextBlockElements(iframeBodyChildNodes);
        //   }
        // }
      } else {
        childrenTexBlocks = findTextBlockElements(siblingNode.childNodes);
      }
      // console.log("--------------> childrenTexBlocks has " + childrenTexBlocks.length + " items");
      // 2. process the sibling node
      let siblingTextBlock = textContainerData(siblingNode);
      if(siblingTextBlock) {
        let childTextLength = 0;
        childTextLength = childrenTexBlocks.reduce((sum, subTextBlock) => sum + subTextBlock.innerText.length, childTextLength);
        if(siblingTextBlock.innerText === undefined){
          console.warn("siblingTextBlock.innerText is undefined!" + siblingTextBlock);
        } else if(siblingTextBlock.innerText.length >= childTextLength){
          let debugSearchText = "XXXDas protokollarisch zweithöchste";
          let debugThisSibling = siblingTextBlock.innerText.indexOf(debugSearchText) == 0;
          collectSubTreeInnerTexts(childrenTexBlocks)
            .sort(compareByTextLength)
            .forEach(function(subBlockText) {
              let debugThisSubBlockText = debugThisSibling && subBlockText.indexOf(debugSearchText) == 0;
              if(debugThisSubBlockText){
                console.log("siblingText " + siblingTextBlock.toString() + "[" + siblingTextBlock.innerText.length + "]:" + siblingTextBlock.innerText);
                console.log("subBlockText [" + subBlockText.length + "]:" + subBlockText);
              }
              siblingTextBlock.innerText = siblingTextBlock.innerText.replace(subBlockText, '');
              if(debugThisSubBlockText) {
                console.log("replaced siblingText " + siblingTextBlock.toString() + "[" + siblingTextBlock.innerText.length + "]:" + siblingTextBlock.innerText);
              }
            });
          siblingTextBlock.innerText = siblingTextBlock.innerText.trim();
          if(debugThisSibling) {
            console.log("(1) " + siblingTextBlock.toString() + " : " + siblingTextBlock.innerText);
          }
        }
      }
      if( siblingTextBlock && siblingTextBlock.innerText.length > 0) {
        // console.log("(1) adding TextBlock (length= " +siblingTextBlock.innerText.length + ") to siblingTextBlocks");
        siblingTextBlock.children = childrenTexBlocks;
        siblingTextBlocks.push(siblingTextBlock);
      } else {
        if(childrenTexBlocks.length > 0){
          // console.log("(1) adding " + childrenTexBlocks.length + " childrenTexBlocks to  siblingTextBlocks");
          siblingTextBlocks = siblingTextBlocks.concat(childrenTexBlocks);
        }
      }
    });
    // console.log("(1) siblingTextBlocks.length = "+ siblingTextBlocks.length);
    return siblingTextBlocks;
  };

  /**
   *
   * @param rootTextBlocks
   * @param flatList
   * @returns {*}
   */
  let flattenTextBlockTree = function(rootTextBlocks, flatList){
    rootTextBlocks.forEach(function(item){
      flatList.push(item);
      flattenTextBlockTree(item.children, flatList);
    });
    return flatList;
  }

  /**
   * Global function which provides the list of block elements which contain text which is
   * relevant for the transformation through the IdiomReplaceX filters.
   *
   * @param debug
   * @returns {*[]}
   */
  bindTo.idiomReplaceX.extractTextBlocks = function(debug = false){

    let relevantTextBlocks = [];
    let textBlockElements = flattenTextBlockTree(findTextBlockElements(document.body.childNodes), []);
    textBlockElements.forEach(function(textBlockData){
      if (textBlockData.innerText && countWords(textBlockData.innerText) > bindTo.idiomReplaceX.minWordThreshold) {
        bindTo.idiomReplaceX.relevantTextBlocks[textBlockData.htmlChecksum] = textBlockData;
        if(debug){
          console.debug("(2) " + textBlockData.toString() + " : " + textBlockData.innerText );
          textBlockData.node.style.backgroundColor = 'rgba(255,255,0,0.2)'
          textBlockData.node.style.border = '1px dashed red';
          textBlockData.node.style.paddingLeft = '20px';
          textBlockData.node.addEventListener('click', function(event){
            let infoBlock = document.createElement('div');
            infoBlock.innerHTML = 'innerText.length: ' + textBlockData.innerText.length + ', words: ' + countWords(textBlockData.innerText) + '<br>text:<small>' +  textBlockData.innerText + '</small>';
            event.target.appendChild(infoBlock);
            event.stopPropagation();
          });
        }
      }
    });
    return relevantTextBlocks;
  }

  // --------------------------- the request and filter function ---------------------- //

  bindTo.idiomReplaceX.requestForReplaceX = function(){
    // revert the page to original state (if revertDataList is not empty)
    bindTo.idiomReplaceX.revertAllReplaceXments();
    let filter = getCookie(cookieName);
    if(filter === undefined){
      filter = defaultFilter;
    }
    // set author information
    metadataDiv.innerText = '';
    let methodData = methodDataList.find(function(item){
      return item.name == filter;
    });
    if(methodData){
      if (methodData.author){
        metadataDiv.innerText = methodData.author;
      }
      if (methodData.year){
        metadataDiv.innerText += ' ' + methodData.year;
      }
      // set method css
      if(methodData.cssFile){
        let methodCssElement = document.createElement('link');
        methodCssElement.setAttribute('id', 'idiomreplacex-css');
        methodCssElement.setAttribute('rel', 'stylesheet');
        methodCssElement.setAttribute('type', 'text/css');
        methodCssElement.setAttribute('href',  bindTo.idiomReplaceX.filterServiceBaseUrl + 'css/' + methodData.cssFile);
        document.head.appendChild(methodCssElement);
      } else {
        let methodCssElement = document.head.querySelector('#idiomreplacex-css');
        if(methodCssElement){
          methodCssElement.parentNode.removeChild(methodCssElement);
        }
      }
    }
    // apply filter method
    console.info("applying filter method: " + filter);
    if(filter && filter !== FILTERS_DISABLED){
      Object.values(bindTo.idiomReplaceX.relevantTextBlocks).forEach(function (textBlock) {
        let payload = JSON.stringify({'html': textBlock.node.innerHTML.normalize(), 'htmlChecksum' : textBlock.htmlChecksum, 'documentUrlId' : b_crc32(document.URL)});
        let serviceMethod = "filter";
        if(filter){
          serviceMethod += '/' + filter;
        }
        jsonQuery( "POST",  serviceMethod, payload, bindTo.idiomReplaceX.applyReplaceX);
      })
    }
  }

  bindTo.idiomReplaceX.applyReplaceX = function(replaceData, revertMode = false){
    // console.log(JSON.stringify(replaceToken));
    let textBlock = bindTo.idiomReplaceX.relevantTextBlocks[replaceData.htmlChecksum];
    if(textBlock){
      let checksum_match = true;
      if(!revertMode){
        let currentInnerHtmlChecksum = b_crc32(textBlock.node.innerHTML);
        checksum_match = currentInnerHtmlChecksum == textBlock.htmlChecksum;
      }
      if(!checksum_match) {
        console.info("TextBlock.innerHtml has changed meanwhile, skipping ...");
      } else {
        let revertTokens = bindTo.idiomReplaceX.replaceInnerHTML(textBlock, replaceData.replaceTokens);
        if (!revertMode) {
          bindTo.idiomReplaceX.revertDataList.push({
            // htmlChecksum is no longer the checksum of the textBlock as it has just been modified
            // but we are still using it as key to reference the block in the bindTo.idiomReplaceX.relevantTextBlocks
            "htmlChecksum": replaceData.htmlChecksum,
            "replaceTokens": revertTokens
          });
        }
      }
    } else {
      console.warn("Received data for unknown text block: " + JSON.stringify(replaceData));
    }
    }

    bindTo.idiomReplaceX.revertAllReplaceXments = function(){
      // console.log(JSON.stringify(replaceToken));
      bindTo.idiomReplaceX.revertDataList.forEach(function(replaceData, index, array) {
        bindTo.idiomReplaceX.applyReplaceX(replaceData, true);
      });
      bindTo.idiomReplaceX.revertDataList = [];
    }

  /**
   * Apply the replaceTokens to the text block.
   *
   * It is assumed that the replaceTokens are ordered by the start field.
   *
   * @param textBlock
   * @param replaceTokens
   *  array with elements of the following structure:
   *  {
            "replacement": string,
            "start": int,
            "token": string
        }
   * @return array of revertTokens which can be used to restore the original text
   */
  bindTo.idiomReplaceX.replaceInnerHTML = function(textBlock, replaceTokens){
    let revertTokens = [];
    let offset = 0;
    let chars = [...textBlock.node.innerHTML.normalize()]; // covert into unicode character array
    for(let i = 0; i < replaceTokens.length; i++) {
      let rpToken = replaceTokens[i];
      // create the token, which can be used to restore the original text
      revertTokens.push({
        "replacement": rpToken.token,
        "token": rpToken.replacement,
        "start": rpToken.start + offset
      });
      let tokenChars = [...rpToken.token];
      let replacementChars = [...rpToken.replacement];
      let partAChars = chars.slice(0, rpToken.start + offset);
      let partBChars = chars.slice(rpToken.start + offset + tokenChars.length);
      chars = partAChars.concat(replacementChars, partBChars);
      offset = offset + (replacementChars.length - tokenChars.length);
    };
    textBlock.node.innerHTML = chars.join("");
    return revertTokens;
  }

})(document, window);
