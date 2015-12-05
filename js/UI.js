$(function(){
  var $author = $('#author');
  var $authorUrl = $('#authorUrl');
  var $title = $('#title');
  var $articleBody = $('#articleBody');
  var $category = $('#category');
  var $submitButton = $('#entrySubmit');
  var date = getDate();
  // var $timeInsert = $('#insertTime');

  function render(){
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
    userInputVal.publishedOn = date;
    return [userInputVal, userInputVal];
  }

  function insert(){
    var $pJson = $('#jsonOutput');
    var renderOutput = render();
    var userInputVal = renderOutput[1];
    var myObj = renderOutput[0];
    var date = getDate();
    myObj.publishedOn = date;
    console.log(myObj);
    var jsonStr = $pJson.text(JSON.stringify(myObj).replace(/\\"/g, '"'));

    //handlebars here
    var $articleOutput = $('#articles');
    var rawUserPreviewTemplate = $('#UserPreview').html();
    var compiledUserPreviewTemplate = Handlebars.compile(rawUserPreviewTemplate);
    var $htmlOutput = $(compiledUserPreviewTemplate((myObj)));
    $articleOutput.children(':not(:first-child)').remove();
    $htmlOutput.find('time').text(' ('+parseInt((new Date() - new Date(myObj.publishedOn))/60/60/24/1000) + ' days ago)');
    $articleOutput.append($htmlOutput);
  }

  function getDate(){
    var dString = new Date();
    var date = JSON.stringify(dString).slice(1,11);
    return date;
  }

  //Event listeners for changes
  console.log($author);
  $author.on('input', insert);
  $authorUrl.on('input', insert);
  $title.on('input', insert);
  $articleBody.on('input', insert);
  $category.on('input', insert);

  //Event listener for submit button in order to finalize the publish date
  $submitButton.on('click', function(e){
    e.preventDefault();
    var date = getDate();
    myObj.publishedOn = date;
  });

  insert();
});
