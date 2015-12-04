$(function(){

  function render(){
    var $author = $('#author');
    var $authorUrl = $('#authorUrl');
    var $title = $('#title');
    var $articleBody = $('#articleBody');
    var $category = $('#category');

    var userInput = [$author, $authorUrl, $title, $articleBody, $category];
    var userInputVal = [];
    for(var ii=0; ii<userInput.length; ii++){
      userInputVal.push(userInput[ii].val());
    }
    var bodyM = marked(userInputVal[3]);
    userInputVal[3] = bodyM;
    return userInputVal;
  }

  function insert(){
    var $author = $('#insert-author');
    var $authorUrl = $('#insert-url');
    var $title = $('#insert-title');
    var $articleBody = $('#insert-article');
    var $category = $('#insert-category');
    var userInputVal = render();

    $author.text(userInputVal[0]);
    $authorUrl.text(userInputVal[1]);
    $title.text(userInputVal[2]);
    $articleBody.append($(userInputVal[3]));
    $category.text(userInputVal[4]);

  }












});
