$(document).ready(function(){
  //evento click su bottone
  $(".search button").click(
    function(){
      // richiamo funzione searchfilm
      searchfilm();
      });
})//chiusura document ready


  //parte relativa alle funzioni
  // funzione cercafilm
  function searchfilm(){
    $(".box-film-search >div ").remove();
    var search=$(".search input").val();
    console.log(search);
    // var valore=parseInt(prompt("inserisci valore"));
    // dichiaro var per prendere l'url dell'api
    var url ="https://api.themoviedb.org/3/search/tv?api_key=25b5af028ffd8f79e2dc1a12603c0a63&query="+search;
    console.log(url);
    $.ajax({//chiamata ajax
      url:url,
      method:"GET",
      success:function(data){
        var risultati=$(data.results);//variabile con valore risultati della chiamta
        var source=$("#template").html();
        var template=Handlebars.compile(source);
        var nuovovoto//variabile per trasformare i voti iniziali per eccesso o difetto;
        var stella//varibaile con valore da 0 a 5 per inserimento stelle;
        var attributo//variabile che assegna un attributo ;
        // ciclo for scorro nei miei risultati della chiamata
        for(var i=0;i<risultati.length;i++){
          nuovovoto=Math.round(risultati[i].vote_average);
          // controllo se nuovo vuoto presenta valori da 0 a 10
          switch (nuovovoto){
            case 1:
            case 2:
              console.log("prima"+nuovovoto);
              nuovovoto=1;//corrispondera a 1 stella
              console.log("dopo"+nuovovoto);
            break;
            case 3:
            case 4:
              console.log("prima"+nuovovoto);
              nuovovoto=2;//corrispondera a 2 stelle
              console.log("dopo"+nuovovoto);
            break;
            case 5:
            case 6:
              console.log("prima"+nuovovoto);
              nuovovoto=3;//corrisponderà a 3 stelle
              console.log("dopo"+nuovovoto);
            break;
            case 7:
            case 8:
              console.log("prima"+nuovovoto);
              nuovovoto=4;//corrisponderà a 4 stelle
              console.log("dopo"+nuovovoto);
            break;
            case 9:
            case 10:
              console.log("prima"+nuovovoto);
              nuovovoto=5;//corrisponderà a 5 stelle
              console.log("dopo"+nuovovoto);
            break;
            case 0:
              nuovovoto=0;//corrispondera a 0 stelle
          }//chiusura controllo
          // variabile stella assume il nuovo valore del nuovovoto
          stella=nuovovoto;
          // controllo se stella ha valori da 1 a 5
          switch (stella){
            case 1:
              attributo=1;//avrà un attributo rif=1
              break;
            case 2:
              attributo=2;//avrà un attributo rif=2
              break;
            case 3:
              attributo=3;//avrà un attributo rif=3
              break;
            case 4:
              attributo=4;//avrà un attributo rif=4
              break;
            case 5:
              attributo=5;//avrà un attributo rif=5
              break;
            default:
              attributo=0;//avrà un attributo rif=0
              break;
          }
          var context ={
            title:risultati[i].name,
            titleoriginal:risultati[i].original_name,
            language:risultati[i].original_language,
            vote:stella,
            attributo:attributo,
          };
          var html =template(context);
          // riempimento div box-film-search tramite handlebars
          $(".box-film-search ").append(html);
        }
        // dopo riempimento sostituisco i valori di voto in delle
        // opportune stelle che vanno da 1 a 5
        mettistella();

      },//chiusura funzione success
    });//chiusura chiamta ajax
  };//chiusura funzione cerca film

  // funzione per aggiungere le icone stella al voto
  function mettistella(){
    //scorro nei p contenuti nei div contenuti in box-film-search che hanno
    // con uno span  con attributo rif
    $(".box-film-search >div p span[rif]  ").each(function(){
      // dichiaro variabile e gli assegno come valore la mia icona stella
      // presa da fontawesome
      var inserisci=("<i class='fas fa-star'>"+"</i>");
      console.log(inserisci);
      console.log($(this));
      // verifica che elmento temporaneo abbia un attributo rif
      switch ($(this).attr("rif")) {
        case '0'://con valore 0
          $(this).html("Nessuna votazione");//metto una stringa
          break;
        case '1'://con valore 1
          $(this).html(inserisci);//metto una sola stella
          break;
        case '2'://con valore 2
          $(this).html(inserisci+inserisci);//metto due stelle
          break;
        case '3'://con valore 3
          $(this).html(inserisci+inserisci+inserisci);//metto 3 stelle
          break;
        case '4'://con valore 4
          $(this).html(inserisci+inserisci+inserisci+inserisci);//metto 4 stelle
          break;
        case '5'://con valore 5
          $(this).html(inserisci+inserisci+inserisci+inserisci+inserisci);//metto 5 stelle
          break;
      }//chiusura controllo
    })//chiusura funzione each
  }//chiusura funzione mettistella
