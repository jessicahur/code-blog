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
    webDB.execute('DELETE FROM articles', function(){
      console.log('sucessflly wiped articles DB clean');
    });
    console.log(articles);
    var columns = '(title, author, authorUrl, category, publishedOn,body)';
    console.log(columns);
    articles.forEach(webDB.insertRecord);
  };//end of blog.updateDB

  blog.get_json = function(){
    $.getJSON('js/Data/blogArticles1.json', function(articlesData){
      localStorage.setItem('eTag',eTag);
      console.log(articlesData);
      var articles = articlesData.map(blog.convertMarkdown);
      articles.sort(Util.compareTimeStamps);
      console.log(articles);
      blog.updateDB(articles);
    });//end of $.getJSON
  };//end of blog.get_json

  blog.get_ajax().done(function(data,textStatus,xhr){
    eTag = xhr.getResponseHeader('eTag');
    console.log(eTag);
    localStorageETag = localStorage.getItem('eTag');
    console.log(localStorageETag);
    if (localStorageETag){
      if (localStorageETag !== eTag){
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

  blog.setTeaser = function(){
    $articleBody=$('.articleBody');
    var $articleHide=$articleBody.children(':not(:first-child)');
    $imgHide=$articleBody.find('img');
    $imgHide.hide();
    $articleHide.addClass('hidden');
    $('.hidden').css('display','none');
    $articleBody.each(function(){
      $(this).append('<a class="readOn halfOpac">read on...</a>');
      $(this).append('<a class="less halfOpac">less...</a>');
    });
    $('.less').hide();
    console.log('setTeaser was run');
  };

  blog.setFilters = function(){
    var tempArticlesArray = articlesArray.slice();
    //Creates authors list for author filter
    tempArticlesArray.sort(Util.compareAuthor);
    var authors = Util.uniqueItem(tempArticlesArray,'author');
    console.log(authors);
    var $authorSelect=$('#authorFilter');
    for (var ii=0; ii<authors.length;ii++){
      $authorSelect.append('<option>'+authors[ii]+'</option>');
    }
    //Create categories list for category filter
    tempArticlesArray.sort(Util.compareCategory);
    var categories = Util.uniqueItem(tempArticlesArray,'category');
    console.log(categories);
    var $categorySelect=$('#categoryFilter');
    for (var ii=0; ii<categories.length;ii++){
      $categorySelect.append('<option>'+categories[ii]+'</option>');
    }
    console.log('setFilters was run');
  };
  // blog.setTeaser();
  // blog.setFilters();
  //Event listener for clicking on Read On
  blog.setEventListeners = function(){
    $('.readOn').on('click', function(){
      var $readOn = $(this);
      var $imgHide = $readOn.parent().find('img');
      $readOn.hide();
      $imgHide.show();
      $readOn.parent().children('.hidden').addClass('tempAvail');
      $('.tempAvail').fadeIn();
      $readOn.next().show();
    });


    //Event listener for clicking on less...
    $('.less').on('click', function(){
      console.log('less event listener was added');
      var $less = $(this);
      var $imgHide = $less.parent().find('img');
      $less.hide();
      $imgHide.hide();
      $less.prev().show();
      $less.parent().children('.hidden').removeClass('tempAvail');
      $('.hidden').css('display','none');
    });

    //Event listener for author selection
    $('#authorFilter').on('change', function(){
      var author = $(this).val();
      var $article = $('.article');
      console.log(author);
      $article.hide();
      var $authors = $('.author');
      $authors.each(function(){
        var text = $(this).text();
        if(text===author){
          $(this).closest('.article').show();
          //$this.parent('.article').show();
        }
      });

    });

    //Event listener for category selection
    $('#categoryFilter').on('change',function(){
      var category = $(this).val();
      var $articles = $('.article');
      console.log(category);
      $articles.hide();
      var $categories = $('.category').find('span');
      console.log($categories);
      $categories.each(function(){
        var text = $(this).text();
        if(text===category){
          $(this).closest('.article').show();
        }
      });

    });

    //Event listener for clear filter button
    $('button').on('click', function(e){
      e.preventDefault();
      $('#authorFilter').val('--Author--');
      $('#categoryFilter').val('--Category--');
      $('.article').show();
    });
    //Event listener for About The Author
    $('#about').on('click', function(){
      $('#aboutMe').show();
      $('.article').hide();
      $('form').hide();
    });

    //Event listener for clicking Articles
    $('#arHome').on('click', function(){
      $('#aboutMe').hide();
      $('.article').show();
      $('form').show();
    });
  };
});//end of ready
