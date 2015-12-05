$(function(){
  var $author = $('#author');
  var $authorUrl = $('#authorUrl');
  var $title = $('#title');
  var $articleBody = $('#articleBody');
  var $category = $('#category');
  var $submitButton = $('#entry-submit');
  var $timeInsert = $('#insert-time');
  var myObj = {publishedOn: ''};

  function render(){
    var userInput = [$author, $authorUrl, $title, $articleBody, $category];
    var userInputVal = [];
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
    console.log('1');
    var $authorInsert = $('#insert-author');
    var $authorUrlInsert = $('#insert-url');
    var $titleInsert = $('#insert-title');
    var $articleBodyInsert = $('#insert-article');
    var $categoryInsert = $('#insert-category');

    var $pJson = $('#json-output');
    var userInputVal = render()[1];
    console.log(render()[0]);

    var jsonStr = $pJson.text(JSON.stringify(myObj).replace(/\\"/g, '"'));

    $articleBodyInsert.children().remove();
    $authorInsert.text(userInputVal[0]);
    $authorUrlInsert.text(userInputVal[1]);
    $titleInsert.text(userInputVal[2]);
    $articleBodyInsert.append($(userInputVal[3]));
    $categoryInsert.text(userInputVal[4]);
  }

  function getDate(){
    var dString = new Date();
    var date = JSON.stringify(dString).slice(0,11);
    return date;
  }




  console.log($author);
  $author.on('input', insert);
  $authorUrl.on('input', insert);
  $title.on('input', insert);
  $articleBody.on('input', insert);
  $category.on('input', insert);


  $submitButton.on('click', function(e){
    e.preventDefault();
    var date = getDate();
    date = date.replace('"', '');
    myObj.publishedOn = date;
    $timeInsert.text(date);
    insert();
  });


  insert();
});
