$(function(){
  var $author = $('#author');
  var $authorUrl = $('#authorUrl');
  var $title = $('#title');
  var $articleBody = $('#articleBody');
  var $category = $('#category');
  var $submitButton = $('#entrySubmit');
  // var $timeInsert = $('#insertTime');

  function render(){
    var userInput = [$author, $authorUrl, $title, $articleBody, $category];
    var userInputVal = [];
    var date = getDate();
    var myObj = {publishedOn: date};

    for(var ii=0; ii<userInput.length; ii++){
      userInputVal.push(userInput[ii].val());
    }
    var bodyM = marked(userInputVal[3]);
    userInputVal[3] = bodyM;
    myObj.author = userInputVal[0];
    myObj.authorUrl = userInputVal[1];
    myObj.title = userInputVal[2];
    myObj.articleBody = userInputVal[3];
    myObj.category = userInputVal[4];
    return [myObj, userInputVal];
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
    // // var date = getDate();
    // // myObj.publishedOn = date;
    // $timeInsert.text(date);
    // insert();
  });

  insert();
});
