
/** Jessica Hur **/
/***  Code 301 **/

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
    $blogAr.addClass('article');
    $blogAr.find('h1').text(this.title);
    $blogAr.find('.author').html('<b>Author:</b> '+this.author);
    $blogAr.find('.URL').html('<a href=\'this.authorURL\'>'+this.authorURL+'</a>');
    $blogAr.find('.category').text('category: '+this.category);
    $blogAr.find('time').text('Published on: '+this.timeStamp + ' ('+
    parseInt((new Date() - new Date(this.timeStamp))/60/60/24/1000) + ' days ago)');
    $blogAr.find('.article-body').html(this.body);
    return $blogAr;
  };

  //function that go through blogArticles.js, pick out article,
  //create article objs, sort and call toHTML()
  blog.makeArticle = function (){
    articlesArray = [];
    for (var ii =0; ii<this.rawData.length; ii++){
      var newArticle = new article(this.rawData[ii]);
      articlesArray.push(newArticle);
    }
    var compare = function(a,b){   //New sorting algorithm
      if (a.timeStamp > b.timeStamp){return 1;};
      if (a.timeStamp < b.timeStamp){return -1;};
      return 0;
    };
    articlesArray.sort(compare);

    for (var nn=0; nn<articlesArray.length; nn++){   //Inserting articles into blog
      $('#articles').prepend(articlesArray[nn].toHtml());
    }
  };

  //function setTeaser that hide all paragraphs after the
  //first one and add read on to the end of the article
  blog.setTeaser = function(){
    var $articleBody=$('.article').children(':not(header)');
    var $articleHide=$articleBody.children(':not(:first-child)');
    $articleHide.addClass('hidden');
    $('.hidden').css('display','none');
    $articleBody.each(function(){
      $(this).append('<a class="readOn">read on...</a>');
      $(this).append('<a class="less">less...</a>');
    });
    $('.less').hide();
  };

  //function Filter create filter lists for both author and category
  blog.filters = function(){
    //Filter out authors
    var compareAuthor = function(a,b,prop){
      if (a.author < b.author){return -1;};
      if (a.author > b.author){return 1;};
      return 0;
    };
    var tempArticlesArray = articlesArray.slice();
    tempArticlesArray.sort(compareAuthor);
    var authors = Util.uniqueItem(tempArticlesArray,"author");
    console.log(authors);
    var $authorSelect=$('.authorFilter');
    for (var ii=0; ii<authors.length;ii++){
      $authorSelect.append("<option>"+authors[ii]+"</option>");
    }
    //filter out category
    var compareCategory = function(a,b){
      if (a.category < b.category){return -1;};
      if (a.category > b.category){return 1;};
      return 0;
    };
    tempArticlesArray.sort(compareCategory);
    var categories = Util.uniqueItem(tempArticlesArray,"category");
    console.log(categories);
    var $categorySelect=$('.categoryFilter');
    for (var ii=0; ii<categories.length;ii++){
      $categorySelect.append("<option>"+categories[ii]+"</option>");
    }
  };

  //function authorFilter grabbing articles of same author
  blog.authorFilter = function(){
  };

  blog.makeArticle();
  blog.setTeaser();
  blog.filters();

  //Event listener for clicking on Read On
  $('.readOn').on('click', function(){
    var $readOn = $(this);
    $readOn.hide();
    $readOn.parent().children('.hidden').addClass('tempAvail');
    $('.tempAvail').fadeIn();
    $readOn.next().show();
  });


  //Event listener for clicking on less...
  $('.less').on('click', function(){
    console.log("1");
    var $less = $(this);
    $less.hide();
    $less.prev().show();
    $less.parent().children('.hidden').removeClass('tempAvail');
    $('.hidden').css('display','none');
  });
});

  //Event listener for author selection
  $('.authorFilter').on('change', function(){
    var author = $(this).val();
    var $article = $('.article');
    console.log(author);
    if (author==="--None--"){
      $article.show();
    }
    else{
      $article.hide();
    }
  });
