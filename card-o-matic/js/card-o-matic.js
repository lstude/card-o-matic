/*-------------------------------------------------------------------------------------------------
Color picker
-------------------------------------------------------------------------------------------------*/
$('.colors').click(function() {

	// Figure out which color we should use
	var chosen_color = $(this).css('background-color');

	// Change the background color of the canvas
	$('#canvas').css('background-color', chosen_color);
	
	// Also change the texture choices
	$('.textures').css('background-color', chosen_color);

});	


/*-------------------------------------------------------------------------------------------------
Texture picker
-------------------------------------------------------------------------------------------------*/
$('.textures').click(function() {

	// Figure out which image we should use
	var chosen_texture = $(this).css('background-image');
	
	// Change the background image of the canvas
	$('#canvas').css('background-image', chosen_texture);

});	


/*-------------------------------------------------------------------------------------------------
Message
-------------------------------------------------------------------------------------------------*/
$('.messages').click(function() {

	 // Which radio button was clicked?
	 var radio_button = $(this);

	 // What is the label next to (i.e. after) that radio?
	 var label = radio_button.next();

	 // Now that we know the label, grab the text inside of it
	 var message = label.html();
		
	$('#message-output').html(message);
	
});


/*-------------------------------------------------------------------------------------------------
Recipient
-------------------------------------------------------------------------------------------------*/
$('#recipient').keyup(function() {

	// Figure out what the user typed in
	var recipient = $(this).val();
	
	// Inject the recipient into the output div on the card
	$('#recipient-output').html(recipient);
	
	// How long was the recipient?
	var length = recipient.length;
	
	// If it was 14 characters, that's the max, so inject an error message
	if(length == 14) {
		$('#recipient-error').html("Max characters: 14");
	}
	// Otherwise clear the error message
	else {
		$('#recipient-error').html("");
	}
	
	
	
});

	
/*-------------------------------------------------------------------------------------------------
Stickers
-------------------------------------------------------------------------------------------------*/	
$('#controls').on('click', '.stickers', function() {

	// Clone the sticker that was clicked
	var new_sticker = $(this).clone();
	
	// A class so we can position stickers
	new_sticker.addClass('stickers_on_card');
	
	// Inject the new image into the canvas
	$('#canvas').prepend(new_sticker);
	
	// Make draggable
	new_sticker.draggable({containment: '#canvas', opacity:.35});
		
});


/*-------------------------------------------------------------------------------------------------
Ability to drag over (rather than click-to-add) new stickers
-------------------------------------------------------------------------------------------------*/

$('.stickers').draggable(
	{ revert: true },
	{ revertDuration: 0 }, 
	{stop: function( event, ui ) {
		var canvasX = $('#canvas').offset().left;
		var canvasY = $('#canvas').offset().top;
		var canvasW = $('#canvas').width();
		var canvasH = $('#canvas').height();

		if (event.pageX >= canvasX &&
			event.pageX <= canvasX + canvasW &&
			event.pageY >= canvasY &&
			event.pageY <= canvasY + canvasH)
			{
				this.click();
				//$('.stickers').last().offset( { top: event.pageY, left: event.pageX } );				
			}
		}
	}
);


/*-------------------------------------------------------------------------------------------------
Sticker search with Ajax
https://developers.google.com/image-search/v1/jsondevguide#using_json
http://api.jquery.com/jQuery.getJSON/
-------------------------------------------------------------------------------------------------*/
$('#sticker-search-btn').click(function() {

	// clear out the results div in case we've already done a search
	$('#sticker-search-results').html('');

	// What search term did the user enter?
	var search_term = $('#sticker-search').val();
		
	// URL for Google Image Search that we make the Ajax call to
	var google_url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=medium&q=' + search_term + '&callback=?';	
		
	// make a call to the url we built above, and let us work with the results that Google sends back
	$.getJSON(google_url, function(data){
	
		// parse the data we get back from Google into an array
	    var images = data.responseData.results;
	
		// attempt to do the following if images
	    if(images.length > 0){
			
			// unpack images we got back from Google
	        $.each(images, function(key, image) {
	        
	        	// Create a new image element
	        	var new_image_element = "<img class='stickers circular' src='" + image.url + "'>";
	        	
	        	// put the new image in our results div
	            $('#sticker-search-results').prepend(new_image_element);
	
	        });
	    }	   
	});			
});
	
	
/*-------------------------------------------------------------------------------------------------
Start over
-------------------------------------------------------------------------------------------------*/
$('#refresh-btn').click(function() {
	
	// Reset color and texture
	$('#canvas').css('background-color', 'white');
	$('#canvas').css('background-image', '');
	
	// Clear message and recipient divs
	$('#message-output').html("");
	$('#recipient-output').html("");
		
	// Remove any stickers
	$('.stickers_on_card').remove();

});


/*-------------------------------------------------------------------------------------------------
Print
-------------------------------------------------------------------------------------------------*/
$('#print-btn').click(function() {

    // Take the existing card on the page (in the #canvas div) and clone it for the new tab
    var canvas_clone = $('#canvas').clone();
        
    var canvas = canvas_clone.prop('outerHTML'); // Give us the whole canvas
    	    

    
    // construct all the pieces we need for any HTML page
    var new_tab_contents  = '<html>';
    
    // add onto our new_tab_contents variable one line at a time
    new_tab_contents += '<head>';
    new_tab_contents += '<link rel="stylesheet" href="css/main.css" type="text/css">'; 
    new_tab_contents += '<link rel="stylesheet" href="css/features.css" type="text/css">';
    new_tab_contents += '</head>';
    new_tab_contents += '<body>'; 
    new_tab_contents += canvas; // Here's where we add the card to our HTML for the new tab
    new_tab_contents += '</body></html>';
    

   
    // tell JavaScript to create a new tab 
    var new_tab =  window.open();

	// open access to the document so we can make changes
    new_tab.document.open();
    
    // write card (i.e., new_tab_contents) to the document of the tab
    new_tab.document.write(new_tab_contents);
    
    // close the tab
    new_tab.document.close();
    		
});
