$(document).ready(function(){

    $(".search button").click(
    function(){
      searchfilm();
      });
      function searchfilm(){
      $(".box-film-search >div ").remove();
      var search=$(".search input").val();
      console.log(search);
      var url ="https://api.themoviedb.org/3/search/tv?api_key=25b5af028ffd8f79e2dc1a12603c0a63&page=1&query="+search;
      console.log(url);
      $.ajax({
        url:url,
        method:"GET",
        success:function(data){
          var risultati=$(data.results);
          var source=$("#template").html();
          var template=Handlebars.compile(source);
          for(var i=0;i<risultati.length;i++){
            var context ={
              title:risultati[i].name,
              titleoriginal:risultati[i].original_name,
              language:risultati[i].original_language,
              vote:risultati[i].vote_average
            };
            var html =template(context);
            $(".box-film-search ").append(html);
          }
        },
      });
    };





})
