$(function(){

  var get_ajax = function(){
    return $.ajax({
      type: 'HEAD',
      url: 'js/blogArticles.json',
    });//end of $.ajax
  };

  var convertMarkdown = function(arrayOfObj){
    for (ii = 0; ii<arrayOfObj.length; ii++){
      if(arrayOfObj[ii].markdown){
        arrayOfObj[ii].body = marked(arrayOfObj[ii].markdown);
      }
    }
    return arrayOfObj;
  };

  var get_template = function(){
    articlesArray = JSON.parse(sessionStorage.getItem('articlesData'));
    articlesArray.sort(Util.compareTimeStamps);
    articlesArray = convertMarkdown(articlesArray);
    $.get('template.html', function(template){
      var rawScriptTemplate = template;
      var compiledScriptTemplate = Handlebars.compile(rawScriptTemplate);
      var $articlesSection = $('#articles');
      for (var ii=0; ii<articlesArray.length; ii++){
        var $htmlOutput = $(compiledScriptTemplate(articlesArray[ii])); //passing data into htmlOutput and make it a jQuery obj
        $htmlOutput.find('time').text(' ('+parseInt((new Date() - new Date(articlesArray[ii].publishedOn))/60/60/24/1000) + ' days ago)');
        $articlesSection.append($htmlOutput);
      }
      console.log('getting template was run');
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
      blog.setTeaser();
      blog.setFilters();
      blog.setEventListeners();
    });//end $.get method
  }; //end get_template

  var get_json = function(){
    sessionStorage.setItem('eTag',eTag);
    $.getJSON('js/blogArticles1.json', function(articlesData){
      console.log('getJSON is running');
      sessionStorage.setItem('articlesData',JSON.stringify(articlesData));
      console.log('after sorting articlesArray is:');
      get_template();
    });//end of getJSON
  };//end of get_json

  get_ajax().done(function(data,textStatus,xhr){
    console.log('ajax successfully runs');
    eTag = xhr.getResponseHeader('eTag');
    console.log(eTag);
    sessionStorageETag = sessionStorage.getItem('eTag');
    if(sessionStorageETag){
      if(sessionStorageETag!==eTag){
        console.log('cache miss');
        get_json();
      }
      else{
        console.log('cache hit');
        get_template();
      }
    }
    else{
      console.log('cache miss');
      get_json();
    }
  });//end of chaining get_ajax


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
});//end ready
