$(function(){
  var $author = $('#author');
  var $authorUrl = $('#authorUrl');
  var $title = $('#title');
  var $articleBody = $('#articleBody');
  var $category = $('#category');

  function render(){
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
    console.log('1');
    var $authorInsert = $('#insert-author');
    var $authorUrlInsert = $('#insert-url');
    var $titleInsert = $('#insert-title');
    var $articleBodyInsert = $('#insert-article');
    var $categoryInsert = $('#insert-category');

    var userInputVal = render();
    console.log(userInputVal);
    $articleBodyInsert.children().remove();
    $authorInsert.text(userInputVal[0]);
    $authorUrlInsert.text(userInputVal[1]);
    $titleInsert.text(userInputVal[2]);
    $articleBodyInsert.append($(userInputVal[3]));
    $categoryInsert.text(userInputVal[4]);
  }




  console.log($author);
  $author.on('input', insert);
  $authorUrl.on('input', insert);
  $title.on('input', insert);
  $articleBody.on('input', insert);
  $category.on('input', insert);
  insert();
});
