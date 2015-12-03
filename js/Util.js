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
