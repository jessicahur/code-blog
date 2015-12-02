var Util = Util || {};
Util.uniqueItem=function(sortedArray,propToFilter){
  var filter=[];
  var flag=true;
  var current;
  var next;
  var lastInFilterResult;
  filter.push(sortedArray[0][propToFilter]);
  for (var ii=1; ii<sortedArray.length-2;ii++){
    lastInFilterResult = filter[filter.length-1];
    current = sortedArray[ii][propToFilter];
    next = sortedArray[ii+1][propToFilter];
    if(current!==next && current !==lastInFilterResult){
      filter.push(sortedArray[ii][propToFilter]);
      flag=true;
    }
    else{
      flag=false;
    }
  }
  if (flag){
    filter.push(sortedArray[sortedArray.length-1][propToFilter]);
  }
  return filter;
};
