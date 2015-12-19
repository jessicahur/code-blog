var repos = {};

<<<<<<< HEAD
repos.all = [];
=======
>>>>>>> d233a0553700091b2842b1a5ff8cce9f70a11a36

repos.requestRepos = function(callback) {
  $.ajax({
    url: '/github/users/jessicahur/repos' +
    '?per_page=100' +
    '&sort=updated',
    type: 'GET',
    success: function(data, message, xhr) {
<<<<<<< HEAD
      var github = xhr.responseJSON;
      console.log(github);
      // $.get('templates/github.html', function(template){
      //   var rawScriptTemplate = template;
      //   var compiledScriptTemplate = Handlebars.compile(rawScriptTemplate);
      //   var $githubSection = $('#github');
      //   var htmlOutput = compiledScriptTemplate(github);
      //   $githubSection.append(htmlOutput);
      // });//end of $.get
=======
      var github = data;
      console.log(github);
      $.get('templates/github.html', function(template){
        var rawScriptTemplate = template;
        var compiledScriptTemplate = Handlebars.compile(rawScriptTemplate);
        var $githubSection = $('#github');
        var htmlOutput = compiledScriptTemplate(github);
        $githubSection.append(htmlOutput);
      });//end of $.get
>>>>>>> d233a0553700091b2842b1a5ff8cce9f70a11a36
    }
  }).done(callback);
};
