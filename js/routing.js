
// /* calling functions to generate website*/
// blog.index();

/*Page Implementation*/
page.base('/');
page('', blog.home);
page('about',blog.about);
// page('github', blog.showGithub);
page(':page', blog.share);

page();
