var Util = Util || {};
Util.hideP=function(){
  $('.article').each( function(){
    var $article=$('.article').children(':not(header)').children(':not(:first-child)');
    $article.hide();

  });
};
