$(function(){
  var $menu = $('#menuIcon').parent().siblings();
  $menu.hide();
  //Event listener to animate menu bar
  $('#menuIcon').on('click', function(){
    $menu.toggle(500);
    $('#blogTitle').delay(1000).toggle();
  });
});
