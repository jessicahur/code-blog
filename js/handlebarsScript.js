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
  for (var ii=0; ii<articlesArray.length; ii++){
    var $htmlOutput = $(compiledScriptTemplate(articlesArray[ii])); //passing data into htmlOutput
    $articlesSection.append($htmlOutput);
    var $thisArticle = $('#articles').children(':nth-child(2)');
    $thisArticle.find('time').text(' ('+parseInt((new Date() - new Date(articlesArray[ii].publishedOn))/60/60/24/1000) + ' days ago)');
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
});
