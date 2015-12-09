var Util = Util || {};
Util.uniqueItem = function(sortedArray,propToFilter){
  var n = {},r=[];
  for(var i = 0; i < sortedArray.length; i++)
  {
    if (!n[sortedArray[i][propToFilter]])
    {
      n[sortedArray[i][propToFilter]] = true;
      r.push(sortedArray[i][propToFilter]);
    }
  }
  return r;
};
//Function for sorting raw articles by timeStamps
Util.compareTimeStamps = function(a,b){   //New sorting algorithm
  if (a.publishedOn > b.publishedOn){return -1;};
  if (a.publishedOn < b.publishedOn){return 1;};
  return 0;
};
//Function for sorting authors
Util.compareAuthor = function(a,b){
  if (a.author < b.author){return -1;};
  if (a.author > b.author){return 1;};
  return 0;
};

//Function for sorting categories
Util.compareCategory = function(a,b){
  if (a.category < b.category){return -1;};
  if (a.category > b.category){return 1;};
  return 0;
};

//Set teaser
Util.setTeaser = function(){
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

//Functional functions ???
function convertMarkdown (elem){
  if (elem.markdown){
    elem.body = marked(elem.markdown);
  }
  return elem;
}
Util.markdownToHtml = function(arrayOfObj){
  return arrayOfObj.map(convertMarkdown);
};
