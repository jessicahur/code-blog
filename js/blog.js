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
  article.prototype.toHtml = function (article){
    var $blogAr = $('#articles').clone();
    $blogAr.find('h1').text(article.title);
    $blogAr.find('.author').text(article.author);
    $blogAr.find('.URL').text(article.authorURL);
    $blogAr.find('.category').text(article.category);
  };

});
