// ==UserScript==
// @name         Phosphorus Link
// @namespace    http://bookowl.github.io
// @version      0.1
// @description  Adds a link to Phosphorus
// @author       BookOwl
// @match        https://scratch.mit.edu/projects/*/
// @grant        none
// ==/UserScript==
(function(){
  var status = document.getElementById('stats');
  var s = window.location.href;
  var id = s.slice(33,s.length-1);
  var buttonhtml = '<div class="action tooltip bottom" style="" id="bookowl-phosphorus-link">' +
    '<span class="hovertext"><span class="arrow"></span>View project in phosphorus.</span>' +
    '<span><a class="text black" href="http://phosphorus.github.io/app.html?id=' + id +'&turbo=true&full-screen=true">Phosphorus</a></span>' +
    '</div>';
  status.innerHTML += buttonhtml;
})();