$(function(){
  //Declare blog obj variable
  var blog = blog ||{};

  //Contructor for article objects
  function article(title, category, author, authorURL, publishedOn, body){
    this.title = title;
    this.category = category;
    this.author = author;
    this.authorURL = authorURL;
    this.timeStamp = publishedOn;
    this.content = body;
  };

  //function to insert article obj content into index.html
  article.prototype.toHtml = function (){
    var $blogAr = $('#articles').clone();
    $blogAr.find('h1').text(this.title);
    $blogAr.find('.author').text(this.author);
    $blogAr.find('.URL').text(this.authorURL);
    $blogAr.find('.category').text(this.category);
    $blogAr.find('time').text('exactly ' + parseInt((new Date() - new Date(this.timeStamp))/60/60/24/1000) + ' days ago');
  };

  //function to go through blogArticles.js, pick out article, create objs, sort and call toHTML()
  blog.makeArticle = function (){

  };
});
