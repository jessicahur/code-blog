var Util = Util || {};
Util.uniqueItem=function(sortedArray,propToFilter){
  var filter=[];
  var flag=true;
  for (var ii=0; ii<sortedArray.length-1;ii++){
    if (ii<sortedArray.length-2){
      if(sortedArray[ii][propToFilter]!==sortedArray[ii+1][propToFilter]){
        filter.push(sortedArray[ii][propToFilter]);
        flag=true;
      }
      else{
        flag=false;
      }
    }
  }
  if (flag){
    filter.push(sortedArray[sortedArray.length-1][propToFilter]);
  }
  return filter;
};
