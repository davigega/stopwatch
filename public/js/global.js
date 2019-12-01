jQuery(document).ready(function($) {
  var lastInstrDiv = $('.added-field');
  var before = $('#add')
  var i = $('.instruments input.enter-value').length +1;
  var newElement;

  function removeCtrl(index){
    if(index > 2){
      $('#remove').animate({opacity:1});
    }
    else {
      $('#remove').animate({opacity:0});
    }
  }

  $('#add').on('click', function() {
    if(i < 9){
      newElement = '<div class="added-field element'+ i +'"><label for="last-instr' + i +'">Instrument ' + i +':</label><span><input class="enter-value" id="last-instr' + i +'" type="text" name="instrument' + i +'" placeholder="instrument" /></span><div>';
      $(newElement).insertBefore(before);
      i++;
      removeCtrl(i);
      if(i == 9){$(before).animate({opacity:0})}
    }
  });

  $('#remove').on('click', function() {
    if(i > 2){
      i--;
      $('.element'+i).remove();
      //$('<a href="#" id="remScnt">Remove</a>').appendTo('#last-instr'+i)

      removeCtrl(i);
    }
  });

 $( function() {
   $( "#datepicker" ).datepicker({dateFormat:'yy-mm-dd'});
 } );

 var options = {

 };

 $('#timepicker').timepicker();


});
