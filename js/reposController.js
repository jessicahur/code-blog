var reposController = {};

reposController.index = function() {
  repos.requestRepos(blog.about);
};
