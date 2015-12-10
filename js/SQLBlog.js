var blog = blog || {};
$(function(){

  blog.convertMarkdown = function(elem){
    if (elem.markdown){
      elem.body = marked(elem.markdown);
    }
    if(!elem.authorUrl){
      elem.authorUrl = '';
    }
    return elem;
  };//end of blog.convertMarkdown

  blog.get_ajax = function(){
    return $.ajax({
      type: 'HEAD',
      url: 'js/Data/blogArticles1.json',
    });//end of $.ajax
  };//end of blog.get_ajax

  blog.updateDB = function(articles){
    // webDB.execute('DELETE FROM articles', function(){
    //   console.log('sucessflly wiped articles DB clean');
    // });
    console.log(articles);
    var columns = '(title, author, authorUrl, category, publishedOn,body)';
    console.log(columns);
    articles.forEach(function(article){
      console.log(article);
      console.log(article.authorUrl);
      article.body = article.body.replace(/(\r\n|\n|\r)/g,'');
      console.log(article.body);
      var values = ' VALUES ("'+article.title+'","'+article.author+'","'+article.authorUrl+'","'+article.category+'","'+article.publishedOn+'",'+'"'+article.markdown+'"'+');';
      // var values = 'VALUES ("title", "author", "URL","testing","2015-01-01","body")';
      console.log(values);
      var sql = 'INSERT INTO articles '+columns+values;
      console.log(sql);
      html5sql.process(sql, function(){
        console.log('got it');
      });
      // webDB.execute(sql, console.log);//end of webDB.execute
    });//end of articles.forEach
  };//end of blog.updateDB

  blog.get_json = function(){
    $.getJSON('js/Data/DBTest.json', function(articlesData){
      console.log(articlesData);
      // var articles = articlesData.map(blog.convertMarkdown);
      var articles = articlesData;
      articles.sort(Util.compareTimeStamps);
      console.log(articles);
      blog.updateDB(articles);
    });//end of $.getJSON
  };//end of blog.get_json

  blog.get_ajax().done(function(data,textStatus,xhr){
    eTag = xhr.getResponseHeader('eTag');
    console.log(eTag);
    sessionStorageETag = sessionStorage.getItem('eTag');
    console.log(sessionStorageETag);
    if (sessionStorageETag){
      if (sessionStorageETag !== eTag){
        console.log('cache miss');
      }
      else{
        console.log('cache hit');
      }
    }
    else{
      console.log('cache miss');
      webDB.init();
      blog.get_json();
    }
  });//end of blog.get_ajax().done()

});//end of ready
