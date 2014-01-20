$(document).ready(function(){
	console.log('ready!');
	$('body').removeClass('preload');

	var limit = 5;
	var page = 0;
	var resultEnd = false;

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

//load more search results when user gets to the bottom of the page
	function loadMore(){
		page++;
		page_offset = page*limit;

	    //determine search track length in miliseconds based on slider values
		var term = $('input[type="text"]').val();
		var durationLimit = currentValue.text()*1000;

		console.log(term);

 	    //to do: min-max range requires jquery ui, define variables for min and max values,
        //and set "duration: { from: minDuration, to: maxDuration }" on the api call below
	    SC.get('/tracks', { limit: limit, offset: page_offset, q: term, duration: { to: durationLimit }, license: 'cc-by-sa' }, function(tracks){
			if(term == false ){
				console.log('empty');
				return false;
			}
			if(tracks.length === 0) {
				$('#results ul').append('<li><p>No results. Try a different search term, <br class="break">or increase the max sample length.</p></li>');
				resultEnd = true;
			}
			if(!tracks.errors){

				$.each(tracks, function(index, value){

				var template = '<iframe width="100%" height="465" scrolling="no" src="http://w.soundcloud.com/player/?url=API_URL" frameborder="0"></iframe>';
				var html = template.replace('API_URL', 'https%3A%2F%2Fapi.soundcloud.com%2F' + value['permalink_url'].replace('http://soundcloud.com/',''));


					//console.log(index+" and "+value);
					$('#results ul').append('<li>'+html);

				});
				//console.log(tracks);
				//console.log('you searched for a ' + term + ' sample,');
				//console.log('that is ' + durationLimit + ' miliseconds long');
			}
	    });
	}


	//search for soundcloud samples on submit
	$('#samplesearch').submit(function (){
		page=0;
		resultEnd = false;

		//remove previous search results
		$('#results ul').empty();

		//determine search track length in miliseconds based on slider values
	  var term = $('input[type="text"]').val();
	  var durationLimit = currentValue.text()*1000;

		scinit();


		//to do: min-max range requires jquery ui, define variables for min and max values,
		//and set "duration: { from: minDuration, to: maxDuration }" on the api call below
		SC.get('/tracks', { limit: limit, q: term, duration: { to: durationLimit }, license: 'cc-by-sa' }, function(tracks){

			if(term == false ){
				console.log('empty');
				return false;
			}
			if(tracks.length === 0) {
				$('#results ul').html('<p>No results. Try a different search term, <br class="break">or increase the max sample length.</p>')
			}
			if(!tracks.errors){

				$.each(tracks, function(index, value){

				var template = '<iframe width="100%" height="465" scrolling="no" src="http://w.soundcloud.com/player/?url=API_URL" frameborder="0"></iframe>';
				var html = template.replace('API_URL', 'https%3A%2F%2Fapi.soundcloud.com%2F' + value['permalink_url'].replace('http://soundcloud.com/',''));


					console.log(index+" and "+value);
					$('#results ul').append('<li>'+
					html);

				});

				setInterval(function(){
				console.log("window check");
				if($(window).scrollTop() + $(window).height() >= 1000){
					if($(window).scrollTop() + $(window).height() > $(document).height() - 100 && !resultEnd) {
					  console.log("Load More");
					  loadMore();
					}
				   }
				}, 1000);

				console.log(tracks);
				console.log('you searched for a ' + term + ' sample,');
				console.log('that is ' + durationLimit + ' miliseconds long');
			}
		});

		return false;

	});


});