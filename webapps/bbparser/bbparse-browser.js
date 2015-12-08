var BBPARSE = (function(){
  "use strict";
  
  function text_node(text){
    return {
      type: "text",
      value: text,
      attribute: null
    };
  }
  function tag_start_node(tag, attribute){
    return {
      type: "tagstart",
      value: tag,
      attribute: attribute
    }
  }
  function tag_end_node(tag){
    return {
      type: "tagend",
      value: tag,
      attribute: null
    }
  }
  function parse(bbcode){
    var TAG_START = /^\[(\w+?)(?:(?:=| )(\w+?))?\]/;
    var TAG_END   = /^\[\/(\w+?)\]/;
    var parsed = [];
    var match;
    var start = bbcode.search(TAG_START);
    
    if (start > 0){
      parsed.push(text_node(bbcode.slice(0,start)));
      bbcode = bbcode.slice(start);
    }
    while (bbcode){
      //console.log(bbcode);
      if (match = TAG_START.exec(bbcode)){
        //console.log("tagstart",match);
        bbcode = bbcode.slice(match[0].length);
        var node = tag_start_node(match[1], match[2]);
        parsed.push(node);
      }
      else if (match = TAG_END.exec(bbcode)){
        //console.log("tagend",match);
        bbcode = bbcode.slice(match[0].length);
        var node = tag_end_node(match[1]);
        parsed.push(node);
      }
      else {
        //console.log("text");
        //Can't use tag start or end regexs because they only match at the begining of the string.
        var ts = bbcode.search(/\[(\w+?)(?:(?:=| )(\w+?))?\]/);
        var te = bbcode.search(/\[\/(\w+?)\]/)
        if ((ts == -1) && (te == -1)){
          var node = text_node(bbcode);
          parsed.push(node);
          break;
        }
        if (ts==-1) ts = te;
        if (te==-1) te = ts;
        var i = Math.min(ts,te);
        var node = text_node(bbcode.slice(0,i));
        parsed.push(node);
        //console.log(i)
        bbcode = bbcode.slice(i);
      }
    }
    return parsed
  }
  
  return {
    parse: parse
  }
})();