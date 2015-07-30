// Below this code, I have commented out vanilla javascript that I could not get to work for this project.
// So in an effort to submit a working project, I used jQuery instead to interact with the front end elements.

$(document).ready(function(){
  // This is the main event handler managing the majority of the front end. Listening for a click of the submit query button
  $("header").on('click', '#submit_query', function(e){
    // I prevent default behavior of the button and remove introductory text from the DOM
    e.preventDefault();
    $('#place_holder').remove();

    // I store the movie title submited by the user, and convert it to a keyword I can use to generate the api url
    var title = $('#query').val();
    var keyword = title.split(" ").join("+");

    // Remove previous search results
    $('#results').find('#return_result').remove();

    // Constructs url need to search api for movie title submited by user
    var url = "https://www.omdbapi.com/?t="+keyword+"&y=&plot=short&r=json";

    // This method makes the json api call with the url
    $.getJSON( url, function( data ) {
      var items = [];
      var title;
      // Created array of information that I don't want to render out to the client. Can add and remove from this list, based on the api documentation.
      var turn_off_labels = ["Genre","Country", "Metascore", 'imdbID', "imdbVotes", "Type", "Response"];

      // Iterates over each json object and create the HTML elements with classes I want to attach back to the DOM
      $.each( data, function( key, val ) {
        if(key == "Poster") {
          var image = "<div class='row movie_content'><div class='col-md-3'><img src='"+ val + "' id='poster_img'/></div>";
        } else if (key == "Title"){
          var encodedParam = '/favorites/?name='+keyword+'&oid='+data.imdbID;
          title = "<div class='row'><div class='col-md-3'><h1 id='" + key + "'>"+ val + "</h1></div><div class='col-md-3 favorite_form'><form action='"+encodedParam+"' method='post'><button type='submit' class='btn btn-small btn-success'>Add to Favorite</button></form></div></div><hr/>";
        }else if ($.inArray(key, turn_off_labels) == -1 ){
          items.push( "<div class='col-md-3 info_bits' id='" + key + "'><span class='labels'>" +key+":</span> "+ val + "</div>" );
        }
        // Here I'm putting finishing touches to the DOM element to be rendered.
        items[-1] +='</div>';
        items.unshift(image);
        });
      // This function actually creates a new div element with an id of "return_result" that I'm appending my movie HTML (stored in "item" variable) to.
      // Earlier in this handler, I remove "#return_result" to clear the page of previous search results
        $( "<div/>", {
        "id": "return_result", "class" : "container",
        html: title + items.join( "" )
        }).appendTo( "#results" );
    });
  })
});

// JAVASCRIPT CODE - Couldn't get it to work properly
// I was trying a lot of different things. Going to work on refactoring my jQuery to vanilla javascript and see if I can make this work.

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
