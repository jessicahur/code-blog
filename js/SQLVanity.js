$(function(){
  var vanity = {};
  var blog = blog || {};
  var call1 = $.Deferred();
  var call2 = $.Deferred();
  var call3 = $.Deferred();
  var call4 = $.Deferred();
  var call5 = $.Deferred();
  blog.get_ajax = function(){
    return $.ajax({
      type: 'HEAD',
      url: 'js/Data/blogArticles1.json',
    });//end of $.ajax
  };

  blog.get_json = function(){
    $.getJSON('js/Data/blogArticles1.json', function(articlesDataObj){
      var articles = articlesDataObj.map(blog.convertMarkdown);
      articles.sort(Util.compareTimeStamps);
      console.log(articles);
      blog.updateDB(articles);
      localStorage.setItem('eTag',eTag);
    });//end of $.getJson
  };//end of get_json

  blog.updateDB = function(articles){
    webDB.execute('DELETE FROM articles', function(){
      console.log('sucessflly wiped articles DB clean');
    });
    articles.forEach(webDB.insertRecord);
  };//end of blog.updateDB

  blog.fillInTemplate = function(){
    var vanityStats = JSON.parse(localStorage.getItem('vanityStats'));
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
  blog.getTotalNumOfArticles = function(returnedArray){
    vanity.totalNumberOfArticles = returnedArray.length;
    console.log(vanity.totalNumberOfArticles);
    call1.resolve();
    console.log('call1 getTotalNumOfArticles');
  };
  blog.getNumDistAuthors = function(returnedArray){
    vanity.totalNumberOfAuthors = returnedArray.length;
    vanity.distinctAuthors = returnedArray.map(function(obj){
      return obj.author;
    });
    console.log(vanity.totalNumberOfAuthors);
    call2.resolve();
    console.log('call2 getNumDistAuthors');
  };
  blog.getTotalNumWordsAndAvgWordLength = function (returnedArray){
    arrayOfArticlesAndAuthors = returnedArray;
    var totalWordLength=[];
    var bodyArray = returnedArray.map(function(obj){
      var numberOfWordsPerArt = $(obj.body).text().split(/\s+/);
      var articleWordLengths = numberOfWordsPerArt.map(blog.wordLength);
      totalWordLength.push(articleWordLengths.reduce(blog.sum));
      return numberOfWordsPerArt.length;
    });
    vanity.totalNumberOfWordsInBlog = bodyArray.reduce(blog.sum);
    vanity.avgWordLengthAcrossBlog = Math.round(totalWordLength.reduce(blog.sum)/vanity.totalNumberOfWordsInBlog*100)/100;
    call3.resolve();
    console.log('call3 getTotalNumWordsAndAvgWordLength');
  };

  blog.getAllAvgWordLengthPerAuthor = function(returnedArray){
    vanity.authorsWithAvgWordLength = [];
    var authors = vanity.distinctAuthors;
    var arraysOfAuthorsAndArticles = returnedArray;
    console.log(authors);
    authors.forEach(function(author){
      var authorToMatch = author;
      var matchedArticles = arraysOfAuthorsAndArticles.filter(function(article){
        if(article.author==authorToMatch){
          return true;
        }
        else{
          return false;
        }
      });
      var articlesTotalWordLength = matchedArticles.map(blog.articleTotalWordLength);
      var articlesTotalWordCount = matchedArticles.map(blog.articleWordCount);
      var articlesAvgWordLength = Math.round(articlesTotalWordLength.reduce(blog.sum)/articlesTotalWordCount.reduce(blog.sum)*100)/100;
      var author = blog.makeAuthorObj(authorToMatch,articlesAvgWordLength);
      vanity.authorsWithAvgWordLength.push(author);
    });
    console.log(vanity.authorsWithAvgWordLength);
    call4.resolve();
    console.log('call 4 getAllAvgWordLengthPerAuthor');
  };

  blog.accumulateInfo = function(){
    var arrayOfArticlesAndAuthors = [];
    webDB.execute('SELECT title FROM articles',blog.getTotalNumOfArticles);//Call1
    webDB.execute('SELECT DISTINCT author FROM articles ORDER BY author;',blog.getNumDistAuthors);//call2
    webDB.execute('SELECT body FROM articles;',blog.getTotalNumWordsAndAvgWordLength);//call3
    $.when(call2).done(function(){
      webDB.execute('SELECT author,body FROM articles', blog.getAllAvgWordLengthPerAuthor);//call4
    });

    $.when(call1,call2,call3,call4).done(function(){
      console.log(vanity);
      localStorage.setItem('vanityStats',JSON.stringify(vanity));
      call5.resolve();
      console.log('call 5 finished running accumulateInfo');
    });
  };//end of blog.accumulateInfo

  blog.get_ajax().done(function(data,textStatus,xhr){
    eTag = xhr.getResponseHeader('eTag');
    console.log(eTag);
    localStorageETag = localStorage.getItem('eTag');
    if(localStorageETag){
      if(localStorageETag!==eTag){
        console.log('cache miss');
        webDB.connect('blogDB', 'Blog Database', 5*1024*1024);
        blog.get_json();
        blog.accumulateInfo();
        $.when(call1,call2,call3,call4,call5).done(function(){
          blog.fillInTemplate();
        });

      }
      else{
        console.log('cache hit');
        blog.fillInTemplate();
      }
    }
    else{
      console.log('cache miss');
      webDB.connect('blogDB', 'Blog Database', 5*1024*1024);
      blog.get_json();
      blog.accumulateInfo();
      $.when(call1,call2,call3,call4,call5).done(function(){
        blog.fillInTemplate();
      });
    }
  });

});//end of ready
