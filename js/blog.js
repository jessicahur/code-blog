
  //Declare blog obj variable
$(function(){
  //Contructor for article objects
  function article(obj){
    this.title = obj.title;
    this.category = obj.category;
    this.author = obj.author;
    this.authorURL = obj.authorUrl;
    this.timeStamp = obj.publishedOn;
    this.body = obj.body;
  };

  //function to insert article obj content into index.html
  article.prototype.toHtml = function (){
    $blogAr = $('.arTemplate').clone();
    $blogAr.removeClass('arTemplate');
    $blogAr.find('h1').text(this.title);
    $blogAr.find('.author').html('<b>Author:</b> '+this.author);
    $blogAr.find('.URL').html('<a href=\'this.authorURL\'>'+this.authorURL+'</a>');
    $blogAr.find('.category').text('category: '+this.category);
    $blogAr.find('time').text('Published on: '+this.timeStamp + ' ('+
    parseInt((new Date() - new Date(this.timeStamp))/60/60/24/1000) + ' days ago)');
    $blogAr.find('.article-body').html(this.body);
    return $blogAr;
  };

  //function to go through blogArticles.js, pick out article, create objs, sort and call toHTML()
  blog.makeArticle = function (){
    var tempArticlesArray = [];
    var articlesArray = [];
    var timeStampArray = [];
    //creating article obj and push them in tempArticlesArray
    for (var ii =0; ii<this.rawData.length; ii++){
      var newArticle = new article(this.rawData[ii]);
      tempArticlesArray.push(newArticle);
      timeStampArray.push(this.rawData[ii].publishedOn);
    }
    timeStampArray.sort();
    //sorting articles based on sorted timeStamp array
    for (var jj=0; jj<timeStampArray.length;jj++){
      for (var kk=0; kk<tempArticlesArray.length; kk++){
        if (timeStampArray[jj]===tempArticlesArray[kk].timeStamp){
          articlesArray.push(tempArticlesArray[kk]);
          tempArticlesArray.splice(kk,1);
          break;
        }
      }
    }
    //Inserting articles into blog
    for (var nn=0; nn<articlesArray.length; nn++){
      $('#articles').prepend(articlesArray[nn].toHtml());
    }
  };
  blog.makeArticle();
});
