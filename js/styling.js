$(function(){
  var width = $(window).width();
  var $menu = $('#menuIcon').parent().siblings();
  var $lHeader = $('.l-header');
  var $layoutNavigation = $('.l-navigation');
  var $listNavigation = $('#list-navigation');
  console.log('window width is '+width);
  if(width<=480){
    var cw = $('.l-header').width()*2/3;
    $lHeader.css('height',cw+'px');
    $menu.hide();
  }
  $('#menuIcon').on('click', function(){
    $menu.toggle(500);
    $('#blogTitle').toggle();
  });
  $(window).on('resize',function(){
    width = $(window).width();
    if(width<=480){
      $listNavigation.children().css('display','block');
      console.log('menuIcon siblings are '+$menu);
      var cw = $lHeader.width()*2/3;
      $lHeader.css('height',cw+'px');
      $menu.hide();
      //Event listener to animate menu bar
    }
    else{
      $lHeader.css('height','auto');
      $listNavigation.css('height','auto');
      $listNavigation.children().css({
        'display':'inline-block',
        'padding-left':'2em',
        'padding-right':'2em'
      });
      $menu.show();
      console.log('1');

    }
  });
});
