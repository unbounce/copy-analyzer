<script>
$(document).ready(function(){
  // added by Anna as the compiler threw an error
    if (!Element.prototype.matches) {
    Element.prototype.matches = 
      Element.prototype.matchesSelector || 
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector || 
      Element.prototype.oMatchesSelector || 
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;            
      };
  }
  //end of anna added
  
	var api_key = 'NH78RGU5VJ0LFS9IZDD2V1M86CBDPGH1'
	var now = Math.round(Date.now()/1000);
	var hash = CryptoJS.MD5(api_key+now).toString();
    var params = new URLSearchParams(document.location.search.substring(1));
	var myurl = params.get("url"); 
	var mycr = params.get("cr");
 
    $.ajax({
            url: 'https://api.readable.com/api/url/',
 	type: 'POST',     		
	headers: { 'api_signature': hash ,'api_request_time': now },
            dataType: "json",
      		data: { url: myurl},
            complete: function(data){
                var response = data.responseJSON;
                var rating = response.rating;
				var word_count = response.word_count;
                var sentiment = response.sentiment;
				var reading_time = response.reading_time;
                var longest_sentence_words = response.longest_sentence_words;
              	var longest_sentence = longest_sentence_words.match(/(\"(?:\"?[^\[]*?\"))/);
              	var longest_word_syllables = response.longest_word_syllables;
              	var longest_word = response.longest_word_syllables.match(/(\"(?:\"?[^\[]*?\"))/);
				var flesch_reading_ease = response.flesch_reading_ease;
                var average_grade_level = response.average_grade_level;
				var tone = response.tone;
             	var score_id = response.score_id;
              	
              //color
              	if (mycr < 2.9) {
  				$('.cr').css('color','#FFA1A1');
				} else {
				$('.cr').css('color','#27CC8D');	
				}
				$(".os").text(rating);             
             	$(".st").text(sentiment);
              
              
              	
            	$(".wc").text(word_count);
              	
             	//color
              	if (word_count > 200) {
  				$('.wc').css('color','#FFA1A1');
				} else {
				$('.wc').css('color','#27CC8D');	
				}
              
              	$(".rt").text(reading_time);
              	$(".ls").text(longest_sentence[0].split('","', 1));
				//console.log(longest_word[0]);
				$(".lw").text(longest_word[0].split('","', 1));
              	$(".fre").text(flesch_reading_ease);
              	
              	//color
				if (flesch_reading_ease < 71) {
  				$('.fre').css('color','#FFA1A1');
				} else {
				$('.fre').css('color','#27CC8D');	
				}
                switch (true) {
                  case flesch_reading_ease < 31:
                    $('.fre').text('Very Difficult' );
                    break;
                  case flesch_reading_ease < 51:
                    $('.fre').text('Difficult' );
                    break; 
                  case flesch_reading_ease < 61:
                    $('.fre').text('Fairly Difficult' );
                    break; 
                  case flesch_reading_ease < 71:
                    $('.fre').text('Standard' );
                    break; 
                  case flesch_reading_ease < 81:
                    $('.fre').text('Fairly Easy' );
                    break; 
                  case flesch_reading_ease < 91:
                    $('.fre').text('Easy' );
                    break; 
                  default:
                    $('.fre').text("Very Easy" );
             	}
              
              	$(".agl").text(average_grade_level);
              	$(".tne").text(tone);
         		$('#lp-pom-box-19').css('visibility','visible');
				$('#lp-pom-box-31').css('visibility','hidden');
				$('#lp-pom-box-228').css('background-image','url(https://res.cloudinary.com/unbounce/image/url2png/'+myurl+')');
            
              
				$.ajax({
                    url: 'https://api.readable.com/api/highlight/',
                    type: 'POST',     		
                    headers: { 'api_signature': hash ,'api_request_time': now },
                    dataType: "json",
                    data: { score_id: score_id},
                    complete: function(data){
                    var response = data.responseJSON;    
                 //   console.log(response);
                    var highlights = response.highlighted_text;
                    var warning = response.highlighted_text_key;
					var long_sentence = warning.highlight_warn;
					var very_long_sentence = warning.highlight_bad;
                    var adverb = warning.highlight_adverb;
					var hard_word = warning.highlight_hard_word;
                    var long_word = warning.highlight_long_word;
                      
                    $(".high").html(highlights);   
                    
					$(".highlight_adverb").attr("data-message",adverb);
					$(".highlight_warn").attr("data-message",long_sentence);
					$(".highlight_bad").attr("data-message",very_long_sentence);
					$(".highlight_hard_word").attr("data-message",hard_word);
                    $(".highlight_long_word").attr("data-message",long_word);
                      var vlelts = document.querySelectorAll('.highlight_bad');
                    //console.log(vlelts);
 					 var lelts = document.querySelectorAll('.highlight_warn:not(.highlight_bad)');
                    //console.log(lelts);
						$(".vlong").html("");
					//	$(".long").html("");
                      
						for (var i = 0; i < vlelts.length; ++i) { //vlelts.
                        
  					  	  $(".vlong").append(vlelts[i].innerHTML + "<br><br>");
                          $(".highlight_spelling").tooltip({
   						 items: "[data-message],[data-suggestion]",
                          content: function () {
                              return '<b>' + 'Possible spelling mistake' + '</b><br> Suggestion: ' + $(this).data('suggestion');
                      }}); 
                      
                      $(".highlight_hard_word").tooltip({
   						 items: "[data-message]",
                          content: function () {
                              return '<b>' + 'Complex word' + '</b><br>Long words which contain a lot of syllables are harder to read and to say. Try to use short words where possible.';
                      }}); 
                      
                      $(".highlight_long_word").tooltip({
   						 items: "[data-message]",
                          content: function () {
                              return '<b>' + 'Complex word' + '</b><br> Long words which contain a lot of letters are harder to read and to say. Try to use short words where possible.';
                      }}); 
                      
                       $( ".highlight_adverb" ).tooltip({
 						items: "[data-message]",
  						content: function () {
                              return '<b>' + $(this).data('message') + '</b><br>Adverbs are worth avoiding where possible, as they can usually be replaced by more active verbs. For example, instead of saying "they ran quickly", it might be better to say "they sprinted"';
                      }
					  });
                          	if(i == 4){
                				//exit the loop on the 5th iteration of the object.
                				return false;
            				}
                          	
						};
                    }
                    });
    			              
              
            }
    
      
        });
    
    });  
  
  
</script>