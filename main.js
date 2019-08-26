$(document).ready(function(){
  //evento click su bottone
  $(".menu-genere").hide();
  var movie='movie';//variabile per accedere alla ricerca film
  var tv='tv';//variabile per accedere alla ricerca serie tv
  $(".search button").click(

  function(){
    $(".menu-genere").show();
    $(".box-film-search >div ").remove();
    var search=$(".search input").val();
    console.log(search);
    searchfilm(search,movie);//richiamo funzione searchfilm con valore input + tiporicerca movie
    searchfilm(search,tv);//richiamo funzione searchfilm con valore input + tiporicerca tv
  });
  // funzione per inserire sfondo nero quando siamo con il mouse sull'elemento
  // e per rimettere lo sfondo originale quando usciamo dall'elemento
  $(".box-film-search ").on('mouseover mouseout','.list-film-search',function(event){
    if(event.type==='mouseover'){
      attributostyle=$(this).attr("style");
      $(this).removeAttr("style");
      $(this).attr("style","background:black");
    }else if(event.type==='mouseout'){
      $(this).removeAttr("style");
      $(this).attr("style",attributostyle);
    }
  })


  $(".menu-genere > i").click(function(){
    $(".menu-genere-in").toggle();
  })
  $(".menu-genere-in li").click(function(){
    $(".box-film-search > div").hide();
    $(".menu-genere-in").hide();
    var attributogenere=$(this).attr("rif");
    console.log(attributogenere);


  })
})//chiusura document ready


  //parte relativa alle funzioni
  // funzione cercafilm

  function searchfilm(input,tipo){
    var url ="https://api.themoviedb.org/3/search/"+tipo+"?api_key=25b5af028ffd8f79e2dc1a12603c0a63&query="+input+"&page?&language=it-IT";
    console.log(url);
    $.ajax({//prima chiamata ajax interrogo sul numero totali di pagine
      url:url,
      method:"GET",
      success:function(data){
        var totalpage=data.total_pages;//assegno il numero totali di pagine a una variabile
        for(var i=1;i<=totalpage;i++){//ciclo che permette di scorrere e mostrare i risultati di tutte le pagine
          $.ajax({// seconda chiamata ajax per inserire i contenuti
            url:url,
            method:"GET",
            data:{
              page:i,
            },
            success:function(data){
              var risultati=$(data.results);//variabile con valore risultati della chiamta
              var source=$("#template").html();
              var template=Handlebars.compile(source);
              var nuovovoto//variabile per trasformare i voti iniziali per eccesso o difetto;
              var stella//varibaile con valore da 0 a 5 per inserimento stelle;
              var attributorif//variabile che assegna un attributo per le stelle ;
              var lingua;//variabile che prende come valore la lingua originale del film
              var attributoriflan;//variabile che assegna un attributo per la lingua
              var suffisso;//variabile per inserire la prima parte del codice dello style
              var image ;//varibaile per inserire immagine come sfondo
              var idreturn;
              var genere;
              for(var i=0;i<risultati.length;i++){
              
                nuovovoto=Math.floor(risultati[i].vote_average);//trasformo il voto in numero intero arrotondando per eccesso o difetto
                lingua=risultati[i].original_language;//prendo il valore della lingua
                suffisso=risultati[i].poster_path;//prendo la seconda parte del codice per lo style
                idreturn=risultati[i].id;
                genere=risultati[i].genre_ids;



                // condizione per i film senza copertina
                if(suffisso ===null){
                  image="imgbandiera/copertina.gif";
                }else{//quando il film ha la copertina
                  image="https://image.tmdb.org/t/p/w342"+suffisso;
                }
                // console.log(lingua);
                // controllo se nuovo vuoto presenta valori da 0 a 10
                var nuovovotoda1a5=convertivoto(nuovovoto);//richiamo funzione per trasformare il voto da 1 a 5
                // variabile stella assume il nuovo valore del nuovovoto
                stella=nuovovotoda1a5;

                attributorif=assegnaattrstella(nuovovotoda1a5);//richiamo funzione per assegnare attributo ad h2 voto

                attributoriflan=assegnaattrlingua(lingua);//richiamo funzione per assegnare attributo ad h2 lingua
                var context;

                // todo inserire commenti

                var overvie =risultati[i].overview.split(" ");

                var overviesplit =[];
                for(var k=0;k<60;k++){
                  overviesplit.push(overvie[k])
                }
                overviesplit[60]="[...]";
                var overnew=overviesplit.join(" ");
                // // fine todo
                var attore=returncast(tipo,idreturn);
                if(genere.length===0){
                  console.log("sei qui");
                  generemesso="Nessuna descrizione";
                }else {
                var generemesso=[];
                var assegnagenere=generetv(tipo);
                for(var l=0;l<assegnagenere.length;l++){
                  for(var g=0;g<genere.length;g++){

                    if(assegnagenere[l].id===genere[g]){

                      generemesso.push(assegnagenere[l].name);


                    }
                  }

                }
                }

                var rifgenere=generemesso.toString();
                // console.log(rifgenere);

                if(tipo==='movie'){//se sono in movie
                  context ={//la variabile assumerà i seguenti valori
                    rifgenere:rifgenere,
                    image:image,
                    title:risultati[i].title,
                    titleoriginal:risultati[i].original_title,
                    language:risultati[i].original_language,
                    vote:stella,
                    attributoriflan:attributoriflan,
                    attributo:attributorif,
                    overv:overnew,
                    genre:generemesso,
                    //todo mi restituisce errore da modificare
                    // actors:"1:"+attore[0].name+" 2:"+ attore[1].name
                    //       +" 3:"+attore[2].name + " 4:" +attore[3].name
                    //       +" 5:" +attore[4].name,
                    tipo:"Film",
                  };
                }else if(tipo==='tv'){//se sono in tv
                  context ={//la variabile assumerà i seguenti valori
                    image:image,
                    title:risultati[i].name,
                    titleoriginal:risultati[i].original_name,
                    language:risultati[i].original_language,
                    vote:stella,
                    attributoriflan:attributoriflan,
                    attributo:attributorif,
                    overv:overnew,
                    genre:generemesso,
                    //todo mi restituisce errore da modificare
                    // actors:"1:"+attore[0].name+" 2:"+ attore[1].name
                    //       +" 3:"+attore[2].name + " 4:" +attore[3].name
                    //       +" 5:" +attore[4].name,
                    tipo:"TV",
                  };
                }
                var html =template(context);
                // riempimento div box-film-search tramite handlebars
                $(".box-film-search ").append(html);

              }

              mettistella();//inserisco il numero di stelle opportune
              mettibandiera();//inserisco la bandiera corrispondente alla lingua

            },//chiusura funzione success seconda chiamata ajax

          });//chiusura seconda chiamta ajax

        }//chiusura ciclo for totali pagine

      },//CHIUSURA PRIMA funzione succes della prima chiamata ajax
    });//chiusura prima chiamata ajax
  };//chiusura funzione cerca film


  // funzione per visualizzare i primi 5 attori
  function returncast(x,y){
    var item=[];
    $.ajax({
      url: "https://api.themoviedb.org/3/"+x+"/"+y+"/credits?api_key=e99307154c6dfb0b4750f6603256716d",
      method:"GET",
      success:function(data){

        for(var i=0;i<5;i++){
          item.push(data.cast[i]);

          if(item[i]===undefined){
            delete item[i];

          }
          }

      },
        async:false,//disabilito la funzione asincrona;
    });

      return item;

  }

  function generetv(y){
    var genere;
    $.ajax({
      url:"https://api.themoviedb.org/3/genre/"+y+"/list?api_key=25b5af028ffd8f79e2dc1a12603c0a63&language=it-IT",
      method:"GET",
      success:function(data){
        genere=data.genres;
      },
      async:false,
    })
    return genere;
  }



  // funzione per convertire il voto
  function convertivoto(x){
    switch (x){
      case 1:
      case 2:
        x=1;//corrispondera a 1 stella
      break;
      case 3:
      case 4:
        x=2;//corrispondera a 2 stelle
      break;
      case 5:
      case 6:
        x=3;//corrisponderà a 3 stelle
      break;
      case 7:
      case 8:
        x=4;//corrisponderà a 4 stelle
      break;
      case 9:
      case 10:
        x=5;//corrisponderà a 5 stelle
      break;
      case 0:
        x=0;//corrispondera a 0 stelle
    }//chiusura controllo
    return x;
  }//chiusura funzione

  // funzione per assegnare attributo corrispondente al valore del voto
  function assegnaattrstella(x){
    var attributorif;
    // controllo se stella ha valori da 1 a 5
    switch (x){
      case 1:
        attributorif=1;//avrà un attributo rif=1
        break;
      case 2:
        attributorif=2;//avrà un attributo rif=2
        break;
      case 3:
        attributorif=3;//avrà un attributo rif=3
        break;
      case 4:
        attributorif=4;//avrà un attributo rif=4
        break;
      case 5:
        attributorif=5;//avrà un attributo rif=5
        break;
      default:
        attributorif=0;//avrà un attributo rif=0
        break;
    }
    return attributorif;
  }

  // funzione per aggiungere le icone stella al voto
  function mettistella(){
    //scorro nei p contenuti nei div contenuti in box-film-search che hanno
    // con uno span  con attributo rif
    $(".box-film-search >div h2 span[rif]  ").each(function(){
      // dichiaro variabile e gli assegno come valore la mia icona stella
      // presa da fontawesome
      var stellapiena=("<i class='fas fa-star yellow'>"+"</i>");
      var stellavuota=("<i class='far fa-star'>"+"</i>");
      // verifica che elmento temporaneo abbia un attributo rif
      switch ($(this).attr("rif")) {
        case '0'://con valore 0
          $(this).html("Nessuna votazione");//metto una stringa
          break;
        case '1'://con valore 1
          $(this).html(stellapiena+stellavuota+stellavuota+stellavuota+stellavuota);//metto una sola stella
          break;
        case '2'://con valore 2
          $(this).html(stellapiena+stellapiena+stellavuota+stellavuota+stellavuota);//metto due stelle
          break;
        case '3'://con valore 3
          $(this).html(stellapiena+stellapiena+stellapiena+stellavuota+stellavuota);//metto 3 stelle
          break;
        case '4'://con valore 4
          $(this).html(stellapiena+stellapiena+stellapiena+stellapiena+stellavuota);//metto 4 stelle
          break;
        case '5'://con valore 5
          $(this).html(stellapiena+stellapiena+stellapiena+stellapiena+stellapiena);//metto 5 stelle
          break;
      }//chiusura controllo
    })//chiusura funzione each
  }//chiusura funzione mettistella

  // funzione per assegnare attributo alla lingua
  function assegnaattrlingua(x){
    var attributoriflan;
    switch (x) {
      case 'it'://valore della lingua it
        attributoriflan='it';
      break;
      case 'en'://valore della lingua en
        attributoriflan='en';
      break;
      case 'es'://valore della lingua es
        attributoriflan='es';
      break;
      case 'da'://valore della lingua da
        attributoriflan='da';
      break;
      case 'fr'://valore della lingua fr
        attributoriflan='fr';
      break;
      case 'pt'://valore della lingua pt
        attributoriflan='pt';
      break;
      case 'et'://valore della lingua et
        attributoriflan='et';
      break;
      case 'de'://valore della lingua de
        attributoriflan='de';
      break;
      case 'ru'://valore della lingua ru
        attributoriflan='ru';
      break;
      case 'uk'://valore della lingua uk
        attributoriflan='uk';
      break;
      case 'cy'://valore della lingua cy
        attributoriflan='cy';
      break;
      case 'sv'://valore della lingua sv
        attributoriflan='sv';
      break;
      case 'zh'://valore della lingua zh
        attributoriflan='zh';
      break;
      case 'cs'://valore della lingua cs
        attributoriflan='cs';
      break;
      default:
        attributoriflan='nd';
      break;
    }//chiusura controllo
    return attributoriflan;
  }//chiusura funzione



  // funzione mettibandiera
  function mettibandiera(){
    //scorro nei p contenuti nei div contenuti in box-film-search che hanno
    //  uno span  con attributo riflan
    $(".box-film-search >div h2 span[riflan]").each(function(){
      switch ($(this).attr("riflan")) {
        case 'it'://lingua italiano
          $(this).html("<img src='imgbandiera/ita.png'>");
        break;
        case 'en'://lingua inglese
          $(this).html("<img src='imgbandiera/en.png'>");
        break;
        case 'es'://lingua spagnolo
          $(this).html("<img src='imgbandiera/es.png'>");
        break;
        case 'da'://lingua danese
          $(this).html("<img src='imgbandiera/da.png'>");
        break;
        case 'fr'://lingua francese
          $(this).html("<img src='imgbandiera/fr.png'>");
        break;
        case 'pt'://lingua portoghese
          $(this).html("<img src='imgbandiera/pt.png'>");
        break;
        case 'et'://lingua estone
          $(this).html("<img src='imgbandiera/et.png'>");
        break;
        case 'de'://lingua tedesco
          $(this).html("<img src='imgbandiera/de.png'>");
        break;
        case 'cy'://lingua gallese
          $(this).html("<img src='imgbandiera/cy.png'>");
        break;
        case 'uk'://lingua ucraina
          $(this).html("<img src='imgbandiera/uk.png'>");
        break;
        case 'sv'://lingua svedese
          $(this).html("<img src='imgbandiera/sv.png'>");
        break;
        case 'ru'://lingua russa
          $(this).html("<img src='imgbandiera/ru.png'>");
        break;
        case 'zh'://lingua cinese
          $(this).html("<img src='imgbandiera/zh.png'>");
        break;
        case 'cs'://lingua ceca
          $(this).html("<img src='imgbandiera/cs.png'>");
        break;
        // todo default://quando non trova una lingua
        //   $(this).html("<img src=''>");
        // break;
      }//chiusura controllo

    })//chiusura funzione each

  }//chiusura funzione mettibandiera

// funzione visualizza solo 10 risultati
