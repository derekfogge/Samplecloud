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

	$('li a').lazyload();


	//convert each returned track's permalink_url to a player widget
	function makeWidgets(){
		$('a[href*="soundcloud.com"]').each(function(){
		  var link = $(this);
		  $.getJSON('http://soundcloud.com/oembed?format=js&url=' + link.attr('href') + '&iframe=true&callback=?', function(response){
		    link.replaceWith(response.html);
		  });
		});
	}

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
					console.log(index+" and "+value);
					$('#results ul').append('<li>'+value['title']+'<br><a href="'+value['permalink_url']+'">'+value['permalink_url']+'</a></li><br>');
					makeWidgets();

				});
				console.log(tracks);
				console.log('you searched for a ' + term + ' sample,');
				console.log('that is ' + durationLimit + ' miliseconds long');
			}
		});

		return false;

	});
});