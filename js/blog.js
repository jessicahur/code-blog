
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
    var articlesArray = [];
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

  blog.authorFilter = function(){
    var $
  };

  blog.makeArticle();
  blog.setTeaser();

  //Event listener for clicking on Read On
  $('.readOn').on('click', function(){
    var $readOn = $(this);
    $readOn.hide();
    $readOn.parent().children('.hidden').addClass('tempAvail');
    $('.tempAvail').fadeIn();
    //$readOn.parent().append('<a class="less">less..</a>');
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
