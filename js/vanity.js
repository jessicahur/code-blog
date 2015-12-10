$(function(){
  var get_ajax = function(){
    return $.ajax({
      type: 'HEAD',
      url: 'js/Data/blogArticles1.json',
    });//end of $.ajax
  };

  var get_json = function(){
    sessionStorage.setItem('eTagVanity',eTag);
    $.getJSON('js/Data/blogArticles1.json', function(articlesData){
      console.log(accumulateInfo(articlesData));
      vanityStats = accumulateInfo(articlesData);
      sessionStorage.setItem('vanityStats',JSON.stringify(vanityStats));
      fillInTemplate();
    });//end of $.getJson
  };//end of get_json

  var fillInTemplate = function(){
    var vanityStats = JSON.parse(sessionStorage.getItem('vanityStats'));
    console.log(vanityStats);
    var rawScriptTemplate = $('#handlebarsTemplate').html();
    var compiledScriptTemplate = Handlebars.compile(rawScriptTemplate);
    var $statsSection = $('#blogStats');
    var html = compiledScriptTemplate(vanityStats);
    $statsSection.append(html);
  };

  function articleWordCount(article){
    var articleBodyWordCount = $(article.body).text().split(/\s+/).length;
    // console.log(articleBodyWordCount);
    return articleBodyWordCount;
  };
  function convertMarkdown(elem){
    if (elem.markdown){
      elem.body = marked(elem.markdown);
    }
    return elem;
  };
  function sum (previousValue, currentValue){
    return previousValue+currentValue;
  }
  function wordLength(word){
    return word.length;
  }
  function articleTotalWordLength(article){
    var articleBodyWordSplit = $(article.body).text().split(/\s+/);
    var articleWordLengthArray = articleBodyWordSplit.map(wordLength);
    return articleWordLengthArray.reduce(sum);
  }
  function makeAuthorObj (authorName, authorAvgWordLength){
    var authorObj = {};
    authorObj.author = authorName;
    authorObj.avgWordLength = authorAvgWordLength;
    return authorObj;
  }

  function accumulateInfo(articlesData){
    var vanity = vanity || {};
    var articles = articlesData;
    var articlesWithAllHTML;
    var articlesWordsCount;
    var totalWordLength;
    var authorNames = Util.uniqueItem(articles, 'author');
    vanity.numArticles = articles.length;
    vanity.numAuthors = authorNames.length;
    //Counting total words across all articles
    articlesWithAllHTML = articlesData.map(convertMarkdown);
    articlesWordsCountArray = articlesWithAllHTML.map(articleWordCount);
    vanity.totalWordsCount = articlesWordsCountArray.reduce(sum);
    //Calculating avg word length across all articles
    blogTotalWordLengths = articlesWithAllHTML.map(articleTotalWordLength);
    console.log(blogTotalWordLengths);
    vanity.avgWordLength = Math.round(blogTotalWordLengths.reduce(sum)/(vanity.totalWordsCount));
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
      authorWordLengthArray = authorWithMatchedArticles.map(articleTotalWordLength);
      console.log(authorWordLengthArray);
      authorWordCountArray = authorWithMatchedArticles.map(articleWordCount);
      authorAvgWordLength = Math.round(authorWordLengthArray.reduce(sum)/(authorWordCountArray.reduce(sum))*100)/100;
      console.log(authorAvgWordLength);
      vanity.authorAndAvgWordLength.push(makeAuthorObj(authorName,authorAvgWordLength));
    });
    console.log(vanity.authorAndAvgWordLength);
    return vanity;
  };

  get_ajax().done(function(data,textStatus,xhr){
    eTag = xhr.getResponseHeader('eTag');
    console.log(eTag);
    sessionStorageETag = sessionStorage.getItem('eTagVanity');
    if(sessionStorageETag){
      if(sessionStorageETag!==eTag){
        console.log('cache miss');
        get_json();
      }
      else{
        console.log('cache hit');
        fillInTemplate();
      }
    }
    else{
      console.log('cache miss');
      get_json();
    }
  });

});//end of ready
