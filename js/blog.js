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
  blog.makeArticle = function (article){
    var blogAr = $('#articles').clone();
    blogAr.find('h1').text(article.title);
  };

});
