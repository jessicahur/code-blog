
  //Declare blog obj variable
$(function(){
  //Contructor for article objects
  function article(obj){
    this.title = obj.title;
    this.category = obj.category;
    this.author = obj.author;
    this.authorURL = obj.authorURL;
    this.timeStamp = obj.publishedOn;
    this.content = obj.body;
  };

  //function to insert article obj content into index.html
  article.prototype.toHtml = function (){
    var $blogAr = $('#articles').clone();
    $blogAr.find('h1').text(this.title);
    $blogAr.find('.author').text(this.author);
    $blogAr.find('.URL').text(this.authorUrl);
    $blogAr.find('.category').text(this.category);
    $blogAr.find('time').text('exactly ' + parseInt((new Date() - new Date(this.timeStamp))/60/60/24/1000) + ' days ago');
  };

  //function to go through blogArticles.js, pick out article, create objs, sort and call toHTML()
  blog.makeArticle = function (){
    var articlesArray=[];
    for (var ii =0; ii<this.rawData.length; ii++){
      var newArticle = new article(this.rawData[ii]);
      articlesArray.push(newArticle);
    }

  };
});
