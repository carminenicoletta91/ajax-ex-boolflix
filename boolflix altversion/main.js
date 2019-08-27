$(document).ready(function(){
  $("#myButton").click(searchinput);

})
function searchinput(){
  $("#results > div").remove();
  var query=$("#query").val();
  console.log(query);
  searchmovies(query);
  searchtv(query);
}
function searchmovies(query){
  console.log("funzione cerca film");
  $.ajax({
    url:"https://api.themoviedb.org/3/search/movie",
    method:"GET",
    data:{
      query:query,
      language:"it-IT",
      api_key:"25b5af028ffd8f79e2dc1a12603c0a63",
    },
    success:function(data){
      console.log("success funzione cercafilm");
      var resultsfilm =$(data.results);
      console.log(resultsfilm);
      stamparisultato("Film",resultsfilm);
    },
    error:function(){
      alert("errore");
    }
  })
}
function searchtv(query){
  console.log("funzione cerca tv");
  $.ajax({
    url:"https://api.themoviedb.org/3/search/tv",
    method:"GET",
    data:{
      query:query,
      language:"it-IT",
      api_key:"25b5af028ffd8f79e2dc1a12603c0a63",
    },
    success:function(data){
      console.log("success funzione cerca tv");
      var risultatotv=$(data.results);
      console.log(risultatotv);
      stamparisultato("TV",risultatotv);
    },
    error:function(){
      alert("errore");
    }
  })
}
function stamparisultato(tipo,risultato){
  var obj=$("#results");
  var source=$("#movie-adv").html();
  var template=Handlebars.compile(source);
  var title="";
  var originaltitle="";

  for(var i=0;i<risultato.length;i++){
    //controllo tipo film per inserimento titolo e titolo orginale opportuno
    if(tipo==="Film"){
      title=risultato[i].title;
      originalTitle=risultato[i].original_title
    }else{
      title=risultato[i].name;
      originalTitle=risultato[i].original_name;
    }
    var context={
      type:tipo,
      title:title,
      originalTitle:originalTitle,
      movieLan:getImageLanguage(risultato[i].original_language),
      movieRate:getStarsFromRate(risultato[i].vote_average),
      img:getPosterPath(risultato[i].poster_path),
    };
    var html=template(context);
    obj.append(html);
  }
}
function getStarsFromRate(voto){
  var trasformavoto=Math.floor(voto/2);
  var imgstar="";
  for(var i=0;i<5;i++){
    if(i<trasformavoto){
      imgstar += "<i class='fas fa-star'>"+"</i>";
    }else{
      imgstar += "<i class='far fa-star'>"+"</i>"
    }
  }
  return imgstar;
}

function getPosterPath(posterpath){
  var imgcorrispondente="";
  if (posterpath){
    // <img class='poster' src=
    imgcorrispondente=" https://image.tmdb.org/t/p/w342"+posterpath+"";
  }
  else{
    imgcorrispondente="img/copertina.gif ";
  }
  return imgcorrispondente;
}


function getImageLanguage(languageid){
  var languageavailable=[
    "it",
    "en",
    "cs",
    "cy",
    "da",
    "de",
    "es",
    "et",
    "fr",
    "pt",
    "ru",
    "sv",
    "uk",
    "zh"
  ];
  var flag="";
  if(languageavailable.includes(languageid)){
    flag="<img src='img/"+languageid+".png' class='imglang'>";
  }else{
    flag=languageid;
  }
  return flag;
}
