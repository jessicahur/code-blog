
// /* calling functions to generate website*/
// blog.index();

/*Page Implementation*/
page.base('/');
page('', blog.home);
page('about',reposController.index);
page(':page', blog.share);
page();
