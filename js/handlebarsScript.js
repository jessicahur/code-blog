$(function(){

  var articlesArray = blog.rawData.slice();
  articlesArray.sort(Util.compareTimeStamps);
  console.log(articlesArray);

  //Grab template in html file
  var rawScriptTemplate = $('#handlebars-template').html();
  //Complile the rawScriptTemplate
  var compiledScriptTemplate = Handlebars.compile(rawScriptTemplate);
  //Inserting content into compiledScriptTemplate
  var $articlesSection = $('#articles');
  var $thisArticle;
  for (var ii=0; ii<articlesArray.length; ii++){
    var $htmlOutput = $(compiledScriptTemplate(articlesArray[ii])); //passing data into htmlOutput and make it a jQuery obj
    $htmlOutput.find('time').text(' ('+parseInt((new Date() - new Date(articlesArray[ii].publishedOn))/60/60/24/1000) + ' days ago)');
    $articlesSection.append($htmlOutput);
  }

  blog.setTeaser = function(){
    $articleBody=$('.article-body');
    var $articleHide=$articleBody.children(':not(:first-child)');
    $imgHide=$articleBody.find('img');
    $imgHide.hide();
    $articleHide.addClass('hidden');
    $('.hidden').css('display','none');
    $articleBody.each(function(){
      $(this).append('<a class="readOn">read on...</a>');
      $(this).append('<a class="less">less...</a>');
    });
    $('.less').hide();
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
  };
  blog.setTeaser();
  blog.setFilters();
  Util.setHeightLHeader();
  //Event listener for clicking on Read On
  $('.readOn').on('click', function(){
    var $readOn = $(this);
    $readOn.hide();
    $imgHide.show();
    $readOn.parent().children('.hidden').addClass('tempAvail');
    $('.tempAvail').fadeIn();
    $readOn.next().show();
  });


  //Event listener for clicking on less...
  $('.less').on('click', function(){
    console.log('1');
    var $less = $(this);
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
    var $categories = $('.category');
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
});
