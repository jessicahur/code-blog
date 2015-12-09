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
    var rawUserPreviewTemplate = $('#UserPreview').html();
    var compiledUserPreviewTemplate = Handlebars.compile(rawUserPreviewTemplate);
    var $htmlOutput = $(compiledUserPreviewTemplate((myObj)));
    $articleOutput.children(':not(:first-child)').remove();
    $htmlOutput.find('time').text(' ('+parseInt((new Date() - new Date(myObj.publishedOn))/60/60/24/1000) + ' days ago)');
    $articleOutput.append($htmlOutput);
    console.log(myObj);

  };

  //Function to get current date while typing or decide to finalize article
  function getDate(){
    var dString = new Date();
    var date = JSON.stringify(dString).slice(1,11);
    return date;
  }

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
    UI.insert();
    Util.setTeaser();
  });

  UI.insert();


});
