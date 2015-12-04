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
