
// /* calling functions to generate website*/
blog.index();

/*Page Implementation*/
page.base('/');
// page('home', blog.index);
page('/qqqq',blog.print);
// page('/about',blog.about);
page();

blog.about = function (){
  console.log('about page runs');
  $('#aboutMe').show();
  $('.article').hide();
  $('form').hide();
};
blog.print = function (){
  console.log('qqq printed');
};
