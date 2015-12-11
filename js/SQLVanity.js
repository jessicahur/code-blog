$(function(){
  var blog = blog || {};
  var vanity = {};
  var call1 = $.Deferred();
  var call2 = $.Deferred();
  var call3 = $.Deferred();
  blog.get_ajax = function(){
    return $.ajax({
      type: 'HEAD',
      url: 'js/Data/blogArticles1.json',
    });//end of $.ajax
  };

  blog.get_json = function(){
    $.getJSON('js/Data/blogArticles1.json', function(articlesDataObj){
      localStorage.setItem('eTag',eTag);
      localStorage.setItem('articlesData', JSON.stringify(articlesDataObj));
      var articlesData = articlesDataObj;
      console.log(blog.accumulateInfo(articlesData));
      blog.fillInTemplate();
    });//end of $.getJson
  };//end of get_json

  blog.fillInTemplate = function(){
    var vanityStats = blog.accumulateInfo(JSON.parse(localStorage.getItem('articlesData')));
    console.log(vanityStats);
    var rawScriptTemplate = $('#handlebarsTemplate').html();
    var compiledScriptTemplate = Handlebars.compile(rawScriptTemplate);
    var $statsSection = $('#blogStats');
    var html = compiledScriptTemplate(vanityStats);
    $statsSection.append(html);
  };

  blog.articleWordCount = function(article){
    var articleBodyWordCount = $(article.body).text().split(/\s+/).length;
    return articleBodyWordCount;
  };
  blog.convertMarkdown = function(elem){
    if (elem.markdown){
      elem.body = marked(elem.markdown);
    }
    return elem;
  };
  blog.sum = function(previousValue, currentValue){
    return previousValue+currentValue;
  };
  blog.wordLength = function(word){
    return word.length;
  };
  blog.articleTotalWordLength = function(article){
    var articleBodyWordSplit = $(article.body).text().split(/\s+/);
    var articleWordLengthArray = articleBodyWordSplit.map(blog.wordLength);
    return articleWordLengthArray.reduce(blog.sum);
  };
  blog.makeAuthorObj = function(authorName, authorAvgWordLength){
    var authorObj = {};
    authorObj.author = authorName;
    authorObj.avgWordLength = authorAvgWordLength;
    return authorObj;
  };


  blog.accumulateInfo = function(){
    var authors;
    html5sql.process(
      'SELECT title FROM articles;',
      function(a,b,returnedArray){
        vanity.totalNumberOfArticles = returnedArray.length;
        console.log(vanity.totalNumberOfArticles);
        call1.resolve();
      }
    );//Calculate total number of articles
    console.log(vanity.totalNumberOfArticles);
    html5sql.process(
      'SELECT DISTINCT author FROM articles ORDER BY author;',
      function(a,b,returnedArray){
        vanity.totalNumberOfAuthors = returnedArray.length;
        vanity.distinctAuthors = returnedArray.map(function(obj){
          return obj.author;
        });
        authors = returnedArray.map(function(obj){
          return obj.author;
        });
        console.log(vanity.totalNumberOfAuthors);
        call2.resolve();
      },
      function(error){
        console.log(error.message);
      }
    );//Calculate total number of distinct authors
    html5sql.process(
      'SELECT body FROM articles;',
      function(a,b,returnedArray){
        var totalWordLength=[];
        var bodyArray = returnedArray.map(function(obj){
          var numberOfWordsPerArt = $(obj.body).text().split(/\s+/);
          var articleWordLengths = numberOfWordsPerArt.map(blog.wordLength);
          totalWordLength.push(articleWordLengths.reduce(blog.sum));
          return numberOfWordsPerArt.length;
        });
        vanity.totalNumberOfWordsInBlog = bodyArray.reduce(blog.sum);
        console.log(vanity.totalNumberOfWordsInBlog);
        vanity.avgWordLengthAcrossBlog = Math.round(totalWordLength.reduce(blog.sum)/vanity.totalNumberOfWordsInBlog*100)/100;
        console.log(vanity.avgWordLengthAcrossBlog);
        call3.resolve();
      }
    );//Calculate total number of words in Blog Body and avg word length across blog
  };//end of blog.accumulateInfo

  blog.get_ajax().done(function(data,textStatus,xhr){
    eTag = xhr.getResponseHeader('eTag');
    console.log(eTag);
    localStorageETag = localStorage.getItem('eTag');
    if(localStorageETag){
      if(localStorageETag!==eTag){
        console.log('cache miss');
        // blog.get_json();
      }
      else{
        console.log('cache hit');
        webDB.connect('blogDB', 'Blog Database', 5*1024*1024);
        blog.accumulateInfo();
        var test = $.when(call1,call2,call3);
        test.done(function(){console.log(vanity);});
        // console.log(vanity);
      }
    }
    else{
      console.log('cache miss');
      // blog.get_json();
    }
  });

});//end of ready
