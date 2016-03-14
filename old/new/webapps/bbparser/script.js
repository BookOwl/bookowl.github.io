 document.getElementById("button").onclick = function(){
  var input = document.getElementById("input").value;
  var parsed = BBPARSE.parse(input);
  var v;
  var out = "<pre>";
  for(v of parsed){
    out += ("{<br>" +
            "  type     : " + v.type + "<br>" +
            "  value    : " + v.value + "<br>" +
            "  attribute: " + v.attribute + "<br>}<br>")
  }
  out += "<pre>"
  document.getElementById("out").innerHTML = out;
};