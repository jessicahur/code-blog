var blogObj;
$(function(){
  function articleWordCount(article){
    var articleBodyWordCount = $(article.body).text().split(' ').length;
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
    var articleBodyWordSplit = $(article.body).text().split(' ');
    var articleWordLengthArray = articleBodyWordSplit.map(wordLength);
    return Math.round(articleWordLengthArray.reduce(sum)/articleWordLengthArray.length);
  }
  function makeAuthorObj (authorName){
    var authorObj = {};
    authorObj.authorName = authorName;
    return authorObj;
  }
  function accumulateInfo(articlesData){
    var vanity = vanity || {};
    var articles = articlesData;
    var articlesWithAllHTML;
    var articlesWordsCount;
    var totalWordLength;
    var authorNames = Util.uniqueItem(articles, 'author');
    var authorsObjArray = authorNames.map(makeAuthorObj);
    console.log(authorNames);
    console.log(authorsObjArray);
    vanity.numArticles = articles.length;
    console.log(vanity.numArticles);
    vanity.numAuthors = authorNames.length;
    console.log(vanity.numAuthors);
    articlesWithAllHTML = articlesData.map(convertMarkdown);
    console.log(articlesWithAllHTML);
    articlesWordsCount = articlesWithAllHTML.map(articleWordCount);
    console.log(articlesWordsCount);
    vanity.totalArticlesWordsCount = articlesWordsCount.reduce(sum);
    console.log(vanity.totalArticlesWordsCount);
    totalWordLength = articlesWithAllHTML.map(articleTotalWordLength);
    console.log(totalWordLength);
    vanity.avgWordLength = Math.round(totalWordLength.reduce(sum)/(totalWordLength.length));
    console.log(vanity.avgWordLength);


    return vanity;
  };

  $.getJSON('js/blogArticles1.json', function(articlesData){
    accumulateInfo(articlesData);
  });//end of getJson
});//end of ready
