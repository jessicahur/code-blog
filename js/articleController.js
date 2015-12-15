var blog = blog || {};
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
  articles.forEach(webDB.insertRecord);
};//end of blog.updateDB

blog.makeArticlesFromDB = function(){
  webDB.execute('SELECT * FROM articles ORDER BY publishedOn DESC', blog.get_template);
};

blog.get_template = function(articlesInput){
  var articles = articlesInput;
  console.log(articles);
  $.get('templates/template.html', function(template){
    var rawScriptTemplate = template;
    var compiledScriptTemplate = Handlebars.compile(rawScriptTemplate);
    var $articlesSection = $('#articles');
    articles.forEach(function(article){
      var $htmlOutput = $(compiledScriptTemplate(article));
      $htmlOutput.find('time').text(' ('+parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000) + ' days ago)');
      $articlesSection.append($htmlOutput);
    });//end of articles.forEach
    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
    blog.setTeaser();
    webDB.execute('SELECT DISTINCT author FROM articles ORDER BY author;',blog.setAuthorFilter);
    webDB.execute('SELECT DISTINCT category FROM articles ORDER BY category;',blog.setCategoryFilter);
    blog.setEventListeners();
  });//end of $.get()

};
blog.get_json = function(){
  $.getJSON('js/Data/blogArticles1.json', function(articlesData){
    localStorage.setItem('eTag',eTag);//move to line 60
    console.log(articlesData);
    var articles = articlesData.map(blog.convertMarkdown);
    articles.sort(Util.compareTimeStamps);
    console.log(articles);
    blog.updateDB(articles);
    blog.makeArticlesFromDB();//Should just use articles here instead of going into DB
  });//end of $.getJSON
};//end of blog.get_json

blog.index = function(){
  blog.get_ajax().done(function(data,textStatus,xhr){
    eTag = xhr.getResponseHeader('eTag');
    console.log(eTag);
    localStorageETag = localStorage.getItem('eTag');
    console.log(localStorageETag);
    if (localStorageETag){
      if (localStorageETag !== eTag){
        console.log('cache miss');
        // webDB.init();
        blog.get_json();
      }
      else{
        console.log('cache hit');
        webDB.connect('blogDB', 'Blog Database', 5*1024*1024);
        blog.makeArticlesFromDB();
      }
    }
    else{
      console.log('cache miss');
      webDB.init();
      blog.get_json();
    }
  });//end of blog.get_ajax().done()
};

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

blog.setAuthorFilter = function(authorsArray){
  var authors = [];
  authorsArray.forEach(function(authorObj){
    authors.push(authorObj.author);
  });
  //Creates authors list for author filter
  console.log(authors);
  var $authorSelect=$('#authorFilter');
  authors.forEach(function(author){
    $authorSelect.append('<option>'+author+'</option>');
  });
};
blog.setCategoryFilter = function(categoriesArray){
  //Create categories list for category filter
  var categories = [];
  categoriesArray.forEach(function(categoryObj){
    categories.push(categoryObj.category);
  });
  console.log(categories);
  var $categorySelect=$('#categoryFilter');
  categories.forEach(function(category){
    $categorySelect.append('<option>'+category+'</option>');
  });
  console.log('setFilters was run');
};

//Event listeners
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
};
blog.about = function(){
  console.log('about page runs');
  localStorage.setItem('about','aboutrun');
  $('#aboutMe').show();
  $('.article').hide();
  $('form').hide();
};
blog.home = function(){
  $('#aboutMe').hide();
  $('.article').show();
  $('form').show();
};
blog.index();
/*Functions definitions for page.js */
