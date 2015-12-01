
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
    $articleBody=$('.article').children(':not(header)');
    $articleHide=$articleBody.children(':not(:first-child)');
    $articleHide.addClass('hidden');
    $('.hidden').css('display','none');
    $articleBody.each(function(){
      $(this).append('<a class="readOn">read on ...</a>');
    });
    $('.readOn').css({
      'font-size':'1em',
      'opacity':'0.5'
    });
  };

  blog.makeArticle();
  blog.setTeaser();

  $('.readOn').on('click', function(){
    $(this).hide();
    $(this).parent().children('.hidden').addClass('tempAvail');
    $('.tempAvail').show();
  });
});
