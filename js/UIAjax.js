var UI = UI || {};
$(function(){
  var myObj = {};
  var $author = $('#author');
  var $authorUrl = $('#authorUrl');
  var $title = $('#title');
  var $articleBody = $('#articleBody');
  var $category = $('#category');
  var $submitButton = $('#entrySubmit');
  var $pJson = $('#jsonOutput');
  var date = getDate();
  // var $timeInsert = $('#insertTime');

  UI.render = function render(){
    var userInput = {
      title:     $title,
      category:  $category,
      author:    $author,
      authorUrl: $authorUrl,
      body:      $articleBody
    };
    var userInputVal = {};
    var date = getDate();

    for(item in userInput){
      userInputVal[item] = userInput[item].val();
    }

    userInputVal.body = marked(userInputVal.body);
    console.log(userInputVal.body);
    userInputVal.publishedOn = date;
    return userInputVal;
  };

  UI.insert = function insert(){
    myObj = UI.render();
    var date = getDate();
    myObj.publishedOn = date;

    console.log(JSON.stringify(myObj));
    $pJson.text(JSON.stringify(myObj));

    //handlebars here
    var $articleOutput = $('#articles');
    $.get('templates/template.html', function(template){
      var rawScriptTemplate = template;
      var compiledScriptTemplate = Handlebars.compile(rawScriptTemplate);
      var $articlesSection = $('#articles');
      var $htmlOutput = $(compiledScriptTemplate(myObj)); //passing data into htmlOutput and make it a jQuery obj
      $articleOutput.children().remove();
      $htmlOutput.find('time').text(' ('+parseInt((new Date() - new Date(myObj.publishedOn))/60/60/24/1000) + ' days ago)');
      $articleOutput.append($htmlOutput);
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
    });//end $.get method
    console.log(myObj);

  };

  //Function to get current date while typing or decide to finalize article
  function getDate(){
    var dString = new Date();
    var date = JSON.stringify(dString).slice(1,11);
    return date;
  }

  //Function to send article to DB
  UI.send = function(){
    myObj = UI.render();
    var date = getDate();
    myObj.publishedOn = date;
    console.log(myObj);
    webDB.init();
    webDB.insertRecord(myObj);
  };

  UI.setTeaser = function(){
    $articleBody=$('.articleBody');
    console.log($articleBody);
    var $articleHide=$articleBody.children(':not(:first-child)');
    $imgHide=$articleBody.find('img');
    $imgHide.hide();
    $articleHide.addClass('hidden');
    $('.hidden').css('display','none');
    $articleBody.each(function(){
      $(this).append('<a class="readOn halfOpac">read on...</a>');
      console.log('setTeaser ran');
      $(this).append('<a class="less halfOpac">less...</a>');
    });
    $('.less').hide();
    //Event listener for clicking on Read On
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
      console.log('1');
      var $less = $(this);
      var $imgHide = $less.parent().find('img');
      $less.hide();
      $imgHide.hide();
      $less.prev().show();
      $less.parent().children('.hidden').removeClass('tempAvail');
      $('.hidden').css('display','none');
    });
  };

  //Event listeners for changes
  console.log($author);
  $author.on('input', UI.insert);
  $authorUrl.on('input', UI.insert);
  $title.on('input', UI.insert);
  $articleBody.on('input', UI.insert);
  $category.on('input', UI.insert);

  //Event listener for submit button in order to finalize the publish date
  $submitButton.on('click', function(e){
    e.preventDefault();
    UI.send();
    UI.setTeaser();
  });

  UI.insert();


});
