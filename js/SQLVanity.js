$(function(){
  var blog = blog || {};
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
    var vanityStats = webDB.execute('SELECT * FROM articles BY ORDER publishedOn;');
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

  blog.accumulateInfo = function(articlesData){
    var vanity = vanity || {};
    var articles = articlesData;
    var articlesWithAllHTML;
    var articlesWordsCount;
    var totalWordLength;
    var authorNames = Util.uniqueItem(articles, 'author');
    vanity.numArticles = articles.length;
    vanity.numAuthors = authorNames.length;
    //Counting total words across all articles
    articlesWithAllHTML = articlesData.map(blog.convertMarkdown);
    articlesWordsCountArray = articlesWithAllHTML.map(blog.articleWordCount);
    vanity.totalWordsCount = articlesWordsCountArray.reduce(blog.sum);
    //Calculating avg word length across all articles
    blogTotalWordLengths = articlesWithAllHTML.map(blog.articleTotalWordLength);
    console.log(blogTotalWordLengths);
    vanity.avgWordLength = Math.round(blogTotalWordLengths.reduce(blog.sum)/(vanity.totalWordsCount)*100)/100;
    console.log(vanity.avgWordLength);
    //Calculating avg word length for each author
    vanity.authorAndAvgWordLength = [];
    var authorsWithMatchedArticles = [];
    authorNames.forEach(function (author){
      var authorToMatch = author;
      var matchedArticles = articlesWithAllHTML.filter(function(article){
        if(article.author==authorToMatch){
          return true;
        }
        else{
          return false;
        }
      });
      authorsWithMatchedArticles.push(matchedArticles);
    });
    console.log(authorsWithMatchedArticles);
    authorsWithMatchedArticles.forEach(function (authorWithMatchedArticles){
      var authorName = authorWithMatchedArticles[0].author;
      console.log(authorName);
      authorWordLengthArray = authorWithMatchedArticles.map(blog.articleTotalWordLength);
      console.log(authorWordLengthArray);
      authorWordCountArray = authorWithMatchedArticles.map(blog.articleWordCount);
      authorAvgWordLength = Math.round(authorWordLengthArray.reduce(blog.sum)/(authorWordCountArray.reduce(blog.sum))*100)/100;
      console.log(authorAvgWordLength);
      vanity.authorAndAvgWordLength.push(blog.makeAuthorObj(authorName,authorAvgWordLength));
    });
    console.log(vanity.authorAndAvgWordLength);
    return vanity;
  };

  blog.get_ajax().done(function(data,textStatus,xhr){
    eTag = xhr.getResponseHeader('eTag');
    console.log(eTag);
    localStorageETag = localStorage.getItem('eTag');
    if(localStorageETag){
      if(localStorageETag!==eTag){
        console.log('cache miss');
        blog.get_json();
      }
      else{
        console.log('cache hit');
        webDB.connect('blogDB', 'Blog Database', 5*1024*1024);
        blog.fillInTemplate();
      }
    }
    else{
      console.log('cache miss');
      blog.get_json();
    }
  });

});//end of ready
