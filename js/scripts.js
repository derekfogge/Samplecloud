$(document).ready(function(){
	console.log('ready!');

// update slider value in currentvalue span
	var currentValue = $('#currentValue');

	$('#slider').change(function(){
		currentValue.html(this.value);
	});

	$('#slider').change();

//initialize soundcloud api
	function scinit(){
		SC.initialize({
			client_id: '0223f4d5b9dd11b482aa6aa49a0584f9'
		});
	}


	//convert each returned track's permalink_url to a player widget
/*	function makeWidgets(){
		$('a[href*="soundcloud.com"]').each(function(){
		  var link = $(this);
		  $.getJSON('http://soundcloud.com/oembed?format=js&url=' + link.attr('href') + '&iframe=true&callback=?', function(response){
		    link.replaceWith(response.html);
		  });
		});
	}*/

// search for soundcloud samples on submit
	$('#samplesearch').submit(function (){

		//remove previous search results
		$('#results ul').empty();

		//determine search track length in miliseconds based on slider values
	  var term = $('input[type="text"]').val();
	  var durationLimit = currentValue.text()*1000;

		scinit();


		//to do: min-max range requires jquery ui, define variables for min and max values,
		//and set "duration: { from: minDuration, to: maxDuration }" on the api call below
		SC.get('/tracks', { q: term+' +sample', duration: { to: durationLimit }, license: 'cc-by-sa' }, function(tracks){

			if(term == false ){
				console.log('empty');
				return false;
			}
			if(!tracks.errors){

				$.each(tracks, function(index, value){

var template = '<iframe width="100%" height="" scrolling="no" src="http://w.soundcloud.com/player/?url=API_URL" frameborder="0"></iframe>';
var html = template.replace('API_URL', 'https%3A%2F%2Fapi.soundcloud.com%2F' + value['permalink_url']);


					console.log(index+" and "+value);
					$('#results ul').append('<li>'+value['title']+'<br>'+
					html);





					//makeWidgets();

				});
				console.log(tracks);
				console.log('you searched for a ' + term + ' sample,');
				console.log('that is ' + durationLimit + ' miliseconds long');
			}
		});

		return false;

	});
});