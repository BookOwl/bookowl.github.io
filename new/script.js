banner = 'Welcome to\n______             ______                 ______        ________________        ______    _____      ______\n___  /________________  /__________      ____  /_______ ___(_)_  /___  /_____  ____  /_   ___(_)________  /\n__  __ \\  __ \\  __ \\_  //_/  __ \\_ | /| / /_  / __  __ `/_  /_  __/_  __ \\  / / /_  __ \\  __  /_  __ \\_  / \n_  /_/ / /_/ / /_/ /  ,<  / /_/ /_ |/ |/ /_  /___  /_/ /_  / / /_ _  / / / /_/ /_  /_/ /___  / / /_/ //_/  \n/_.___/\\____/\\____//_/|_| \\____/____/|__/ /_/_(_)\\__, / /_/  \\__/ /_/ /_/\\__,_/ /_.___/_(_)_/  \\____/(_)   \n                                                /____/                                                     \n';

(window.addEventListener("load", function(){
  console.log(banner)
  //Add a spacer to the body content so that it starts out under the banner.
  var header = document.getElementById("header");
  var spacer = document.getElementById("spacer");
  var height = header.clientHeight
  spacer.style.height = height - 15 + "px"
}))
