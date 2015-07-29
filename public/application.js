$(document).ready(function(){
  $("header").on('click', '#submit_query', function(e){
    e.preventDefault();
    $('#place_holder').remove();
    var query = $('#query').val();
    var keyword = query.split(" ").join("+");
    $('#results').find('#return_result').remove();
    var url = "https://www.omdbapi.com/?t="+keyword+"&y=&plot=short&r=json";
    $.getJSON( url, function( data ) {
      var items = [];
      var title;
      var turn_off_labels = ["Genre","Country", "Metascore", 'imdbID', "imdbVotes", "Type", "Response"];
      $.each( data, function( key, val ) {
        if(key == "Poster") {
          var image = "<div class='row movie_content'><div class='col-md-3'><img src='"+ val + "' id='poster_img'/></div>";
        } else if (key == "Title"){
          var encodedParam = '/favorites/?name='+keyword+'&oid=1';
          title = "<div class='row'><h1 id='" + key + "'>"+ val + "</h1><form action='"+encodedParam+"' method='post'><button type='submit' class='btn btn-small btn-danger'>Favorite</button></form></div>";
        }else if ($.inArray(key, turn_off_labels) == -1 ){
          items.push( "<div class='col-md-3 info_bits' id='" + key + "'><span class='labels'>" +key+":</span> "+ val + "</div>" );
        }
        items[-1] +='</div>';
        items.unshift(image);
        });
        $( "<div/>", {
        "id": "return_result", "class" : "container",
        html: title + items.join( "" )
        }).appendTo( "#results" );
    });

  })
});





// JAVASCRIPT CODE - Couldn't get it to work properly

// document.addEventListener("DOMContentLoaded", function() {
//   document.addEventListener('click', function(e) {
//      if ( e.target.matches('#submit_query') ) {
//       var query = document.querySelector('#query').value.split(" ").join("+");
//       var url = "https://www.omdbapi.com/?t="+query+"&y=&plot=short&r=json";
//       var xhr = new XMLHttpRequest();
//       xhr.open("GET", url, false);
//       xhr.send();
//       var response = JSON.parse(xhr.response);
//       // alert(xhr.response);

//       // getJSON(url).then(function(data) {
//       //   alert(data);
//       // }, function(status){
//       //   alert("Something went wrong")
//       // });
//       var placeholder = document.getElementById('place_holder');
//       var div = document.createElement("DIV");
//       div.setAttribute('class', 'col-md-3');
//       var p = document.createElement("P");
//       var textnode = document.createTextNode('Movie Title: ' + response.Title);
//       p.appendChild(textnode);
//       div.appendChild(p);

//       // var out = "<div class='row'><div class='col-md-3'><p>Movie Title: "+response.Title+"</p><img src='"+response.Poster+"'></div></div>";
//       var element = document.getElementById("results");
//       element.removeChild(placeholder);
//       // element.appendChild(div);

//       // node.appendChild(out);
//      };
//   }, false);


//   var getJSON = function(url) {
//     return new Promise(function(resolve, reject) {
//       var xhr = new XMLHttpRequest();
//       xhr.open('GET', url, true);
//       xhr.responseType = 'json';
//       xhr.onload = function(){
//         var status = xhr.status;
//         if (status == 200){
//           resolve(xhr.response);
//         } else {
//           reject(xhr.status);
//         }
//       };
//       xhr.send();
//     });
//   };

//   // function Get(yourUrl){
//   //   var xhr = new XMLHttpRequest();
//   //   xhr.open("GET",yourUrl,true);
//   //   xhr.send(null);
//   //   xhr.onreadystatechange=function()
//   //   {
//   //       if(xhr.readyState===4)
//   //       {
//   //           if(xhr.status===200)
//   //           {
//   //               return JSON.parse(xhr.responseText);
//   //           }
//   //       }
//   //   }
//   // };

//   // function myFunction(arr) {
//   //   var out = "";
//   //   for(var i = 0, limit = arr.length; i < limit; i++) {
//   //       out += '<div id="movie_'+i+'" class="row">' + arr[i].title +
//   //       + '</div>';
//   //   };
//     //
//   // };

// });
