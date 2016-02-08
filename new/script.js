(window.addEventListener("load", function(){
  console.log("Welcome to bookowl.github.io!");
  var header = document.getElementById("header");
  var spacer = document.getElementById("spacer");
  var height = header.clientHeight
  console.log(height);
  spacer.style.height = height - 15 + "px"
}))
