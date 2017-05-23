// Custom app code for M2GEN Front End Challenge [iTunes TopAlbums API]
// Developer: Michael Oakley

// get json data ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getData(url){
  $.ajax({url:url,dataType:'jsonp',success:function(data,status){
      if ((/success/i).test(status)){
        console.log(data);
        if((/topalbums/i).test(url)){
          buildAlbumResults(data);
        }else if((/search/i).test(url)){
          buildSearchResults(data);
        }else if((/lookup/i).test(url)){
          buildLookupResults(data);
        }
      }else{console.log(status);alert(status);}
    }
  });
  return false;
}

// build new album results ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function buildAlbumResults(data){
  var album=jQuery.makeArray(data.feed.entry);
  document.audioID=null; // clear audio
  $('#results').html(""); // clear curent results
  for(var x in album){
    console.log(album[x]['im:name']['label']);
    $('#results').append(
      "<div id=\"album_"+album[x]['id']['attributes']['im:id']+"\" class=\"media\" style=\"padding:3pt;\">"+
        "<div class=\"media-left\">"+
          "<a href=\""+album[x]['id']['label']+"\" target='_blank'><img src=\""+album[x]['im:image']['0']['label']+"\" class=\"media-object thumbnail\"></a>"+
        "</div>"+
        "<div class=\"media-body\">"+
          "<h4 class=\"media-heading\">"+
            "<a href=\""+album[x]['id']['label']+"\" target=\"_blank\"><b>"+album[x]['im:name']['label']+"</b></a>"+
          "</h4>"+
          "<div class=\"row\">"+
            "<div class=\"col-md-4\">"+
              "<b>Artist:</b> "+album[x]['im:artist']['label']+"<br>"+
              "<b>Genre:</b> "+album[x]['category']['attributes']['label']+
            "</div>"+
            "<div class=\"col-md-4\">"+
              "<b>Release:</b> "+(String(new Date(album[x]['im:releaseDate']['label'])).replace(/^(.*?)\s\d\d:\d\d:\d\d\s.*?$/,"$1"))+"<br>"+
              "<b><a id=\"albumTracks_"+album[x]['id']['attributes']['im:id']+"\" class=\"albumTracks\" href=\"#\" data-toggle=\"popover\" title=\"Album Tracks\" data-content=\"Click this to display all the tracks on this album.\" >\u25BC</a>\u00A0Tracks:</b> "+album[x]['im:itemCount']['label']+
            "</div>"+
          "</div>"+
        "</div>"+
      "</div><hr>"
    );
  }
  $('[data-toggle="popover"]').popover({trigger:'hover',delay:{hide:200},container:'body',html:true,placement:'top'});
  $('[data-toggle="tooltip"]').tooltip({trigger:'hover',delay:{hide:200},container:'body',html:true,placement:'left'}); 
  window.setTimeout(function(){$('#spinnerPanel').fadeOut(200);},500);
}

// build new search results ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function buildSearchResults(data){
  var results=data.results,label=((/artist/i).test(document.navType))?'artistName':((/album/i).test(document.navType))?'collectionName':'trackName';
  sortJSON(results,label);

  document.audioID=null; // clear audio
  $('#results').html(""); // clear curent results
  for(var x in results){
    console.log(results[x]['artistName']);
    $('#results').append(
      "<div id=\"track_"+results[x]['trackId']+"\" class=\"media\" style=\"padding:3pt;\">"+
        "<div class=\"media-left\">"+
          "<a href=\""+results[x]['artistViewUrl']+"\" target='_blank'><img src=\""+results[x]['artworkUrl60']+"\" class=\"media-object thumbnail\"></a>"+
        "</div>"+
        "<div class=\"media-body\">"+
          "<h4 class=\"media-heading\">"+
            "<audio id=\"audioSample_"+results[x]['trackId']+"\" class=\"audioSample\" preload=\"none\" onended=\"this.nextElementSibling.firstElementChild.innerHTML='\u25B6';\"><source src=\""+results[x]['previewUrl']+"\" type=\"audio/mpeg\"></audio>"+
            "<strong><a id=\"audioControl_"+results[x]['trackId']+"\" class=\"audioControl\" href=\"#\" data-toggle=\"tooltip\" title=\"Play Sample\">\u25B6</a>\u00A0\u00A0</strong>"+
            "<a href=\""+results[x]['trackViewUrl']+"\" target=\"_blank\"><b>"+results[x]['trackName']+"</b></a>"+
          "</h4>"+
          "<div class=\"row\">"+
            "<div class=\"col-md-4\">"+
              "<b>Artist:</b> "+results[x]['artistName']+"<br>"+
              "<b>Genre:</b> "+results[x]['primaryGenreName']+
            "</div>"+
            "<div class=\"col-md-4\">"+
              "<b>Album:</b> "+( (results[x]['collectionName'])?results[x]['collectionName']:"N/A")+"<br>"+
              "<b>Track:</b> "+((results[x]['trackNumber'])?results[x]['trackNumber']:"N/A")+
            "</div>"+
            "<div class=\"col-md-4\">"+
              "<b>Release:</b> "+(String(new Date(results[x]['releaseDate'])).replace(/^(.*?)\s\d\d:\d\d:\d\d\s.*?$/,"$1"))+"<br>"+
            "</div>"+
          "</div>"+
        "</div>"+
      "</div><hr>"
    );
  }
  $('[data-toggle="popover"]').popover({trigger:'hover',delay:{hide:200},container:'body',html:true,placement:'top'});
  $('[data-toggle="tooltip"]').tooltip({trigger:'hover',delay:{hide:200},container:'body',html:true,placement:'left'}); 
  window.setTimeout(function(){$('#spinnerPanel').fadeOut(200);},500);
}

// build new lookup results ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function buildLookupResults(data){
  if(!$('#trackBox_'+document.albumID).length){
    var results=jQuery.makeArray(data.results),box="";
    var len3=results.length-1,len1=Math.ceil(len3/3),len2=(len1*2);
    box+="<div id=\"trackBox_"+document.albumID+"\" class=\"alert fade in tracksbox\" style=\"margin:0 30px;\">"
    box+="<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\" onclick=\"document.audioID=null;\"><small><span class=\"glyphicon glyphicon-remove text-danger\"></span></small></a>";
    box+="<div class=\"row\">";
    for(var x in results){if(x>0){
      console.log(x+' '+results[x]['trackName']);
      if(x==1||x==len1+1||x==len2+1){box+="<div class=\"col-md-3\" style=\"height:100%;overflow:hidden;\">";}
      box+="<audio id=\"audioSample_"+results[x]['trackId']+"\" class=\"audioSample\" preload=\"none\" onended=\"this.nextElementSibling.firstElementChild.innerHTML='\u25B6';\"><source src=\""+results[x]['previewUrl']+"\" type=\"audio/mpeg\"></audio>"
      box+="<strong><a id=\"audioControl_"+results[x]['trackId']+"\" class=\"audioControl\" href=\"#\" data-toggle=\"tooltip\" title=\"Play Sample\">\u25B6</a>\u00A0\u00A0</strong>"
      box+=x+"<span style=\"white-space:nowrap;\">\u00A0-\u00A0"+results[x]['trackName']+"</span><br>";
      if(x==len1||x==len2||x==len3){box+="</div>";}
    }}


    box+="</div></div>"
    $('#album_'+document.albumID).append(box);
  }
  $('[data-toggle="popover"]').popover({trigger:'hover',delay:{hide:200},container:'body',html:true,placement:'top'});
  $('[data-toggle="tooltip"]').tooltip({trigger:'hover',delay:{hide:200},container:'body',html:true,placement:'left'}); 
  window.setTimeout(function(){$('#spinnerPanel').fadeOut(200);},500);
}

// sort JSON object ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 function sortJSON(json,label,direction){
  var direct=(arguments.length>2)?arguments[2]:1;
  if(json&&json.constructor===Array){
    var path=(label.constructor===Array)?label:label.split(".");
    json.sort(function(a,b){
      for(var p in path){
        if(a[path[p]]&&b[path[p]]){
          a=a[path[p]];
          b=b[path[p]];
        }
      }
      a=a.match(/^\d+$/)?+a:a;
      b=b.match(/^\d+$/)?+b:b;
      return ((a<b)?-1*direct:((a>b)?1*direct:0));
    });
  }
}


// document ready begin ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$(document).ready(function(){
  $('#spinnerPanel').show();

  // initalize page content
  var albumsURL="https://itunes.apple.com/us/rss/topalbums/",
      searchURL="https://itunes.apple.com/search?media=music",
      lookupURL="https://itunes.apple.com/lookup?media=music";

  window.setTimeout(function(){jQuery('#nav_results')[0].click();},10);

  // nav events
  $('#nav_about,#nav_results').click(function(event){event.preventDefault();
    $('#nav_about,#nav_results').removeClass('active');
    if(this.id==$('#nav_about').attr('id')){
      $('#nav_about').addClass('active');
      $('#results').fadeOut(1000);
      $('#about').fadeIn(2000);
      $('#nav_options').hide();
    } else {
      $('#nav_results').addClass('active');
      $('#about').fadeOut(1000);
      $('#results').fadeIn(2000);
      $('#nav_options').show();
      $('#nav_type_select').trigger('change');
    }
  });

  $('#nav_type_select,#nav_limit_select').change(function(){
    if(document.navType!=$('select#nav_type_select option:checked').val()||document.navLimit!=$('select#nav_limit_select option:checked').val()){
      document.navType=$('select#nav_type_select option:checked').val();
      document.navLimit=$('select#nav_limit_select option:checked').val();
      console.log("*** "+document.navType+" "+document.navLimit);
      if((/top/i).test(document.navType) ){
        $('#spinnerPanel').show();
        getData(albumsURL+"limit="+document.navLimit+"/json");
        $('#nav_search').hide();
      } else {
        $('#nav_search').show();
        if( document.navSearch!=null ){$('#nav_submit').trigger('click');}
      }
    }
  });

  $('form').submit(function(){
    document.navType=$('select#nav_type_select option:checked').val();
    document.navLimit=$('select#nav_limit_select option:checked').val();
    document.navSearch=$('#nav_search_input').val();
    if(document.navSearch.length>0){
      $('#spinnerPanel').show();
      getData(searchURL+"&attribute="+document.navType+"Term&limit="+document.navLimit+"&term="+document.navSearch.replace(/(\s)+/,"+"));
    }
  });

  // audio events
  $(document).on('click','.audioControl',function(event){event.preventDefault();
    var audioID=String(this.id).replace(/^.*?_(\d+)$/i,'$1');
    if(document.audioID){if(document.audioID!=audioID){
        document.getElementById('audioControl_'+document.audioID).innerHTML='\u25B6';
        document.getElementById('audioSample_'+document.audioID)['pause']();
    }}
    document.audioID=audioID;
    var audio=document.getElementById('audioSample_'+audioID),pause=(/\u23F8/).test(this.innerHTML);
    this.innerHTML=(pause)?'\u25B6':'\u23F8';audio[(pause)?'pause':'play']();
    return false;
  });

  $(document).on('click','.albumTracks',function(event){event.preventDefault();
    var albumID=String(this.id).replace(/^.*?_(\d+)$/i,'$1');
    if(!$('#trackBox_'+albumID).length){
      document.albumID=albumID;
      $('#spinnerPanel').show();
      getData(lookupURL+"&id="+albumID+"&entity=song");
    }else{
      $('#trackBox_'+albumID).show();
    }
  });
});