

$(function(){

  $('li')
    .css('pointer','default')
    .css('list-style-image','none');
  $('li:has(ul)')
    .click(function(event){
      if (this == event.target) {
        $(this).css('list-style-image',
          (!$(this).children().is(':hidden')) ? 'url(plusbox.gif)' : 'url(minusbox.gif)');
        $(this).children().toggle('slow');
      }
      return false;
    })
    .css({cursor:'pointer', 'list-style-image':'url(plusbox.gif)'})
    .children().hide();
  $('li:not(:has(ul))').css({cursor:'default', 'list-style-image':'none'});
  $('#headshot').hide();
  $('#version-0').hide();
  $('#version-1').hide();
  $('#version-2').hide();
  $('.version-3').hide();
  $('.ptrivia').hide();

  $('#about').click(function() {
    $('#headshot').slideToggle('slow', 'linear', function() {
    });
    $('#version-0').slideToggle('slow', 'linear', function() {
    });
  });
  $('#h4-version-1').click(function() {
    $('#version-1').slideToggle('slow', 'swing', function() {
    });
  });
  $('#h4-version-2').click(function() {
    $('#version-2').slideToggle('slow', 'swing', function() {
    });
  });
  $('#h4-version-3').click(function() {
    $('.version-3').slideToggle('slow', 'swing', function() {
    });
  });
  $('#trivia').click(function() {
    $('.ptrivia').slideToggle('slow', 'swing', function() {
    });
  });

});
