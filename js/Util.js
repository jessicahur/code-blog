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

//Function to set height of l-header proportion to width
Util.setHeightLHeader = function(){
  var width = $(window).width();
  if(width<=480){
    var cw = $('.l-header').width()*2/3;
    $('.l-header').css('height',cw+'px');
  }
};
