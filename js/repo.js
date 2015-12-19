var repos = {};


repos.requestRepos = function(callback) {
  $.ajax({
    url: '/github/users/jessicahur/repos' +
    '?per_page=100' +
    '&sort=updated',
    type: 'GET',
    success: function(data, message, xhr) {
      var github = data;
      console.log(github);
      $.get('templates/github.html', function(template){
        var rawScriptTemplate = template;
        var compiledScriptTemplate = Handlebars.compile(rawScriptTemplate);
        var $githubSection = $('#github');
        var htmlOutput = compiledScriptTemplate(github);
        $githubSection.append(htmlOutput);
      });//end of $.get
    }
  }).done(callback);
};
