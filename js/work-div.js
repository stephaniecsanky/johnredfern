$(document).ready(function(){
  var openWork = 'work';

  $('.work-div').hide();

  $('.work-btn').click(function () {
    var id = $(this).data('id');
    openWork = id;
    $('#work').fadeOut(400);
    $('#' + id).fadeIn({
      duration: 800,
      start: function () {
        $('#work-wrap').height($('#' + id).outerHeight());
      }
    });
  });

  $('.close-btn').click(function () {
    $(this).parents('.work-div').fadeOut(400);
    openWork = 'work';
    $('#work').fadeIn({
      duration: 400,
      start: function () {
        $('#work-wrap').height($('#work').outerHeight());
      }
    });
  });

  $('.next-btn').click(function () {
    var $workDiv = $(this).parents('.work-div');
    var $nextDiv = $(this).parents('.work-div').next('.work-div');
    var id = $nextDiv.attr('id');
    openWork = id;

    $workDiv.fadeOut(400);
    $nextDiv.fadeIn({
      duration: 400,
      start: function () {
        $('#work-wrap').height($('#' + id).outerHeight());
      }
    });
  });

  $('.prev-btn').click(function() {
    var $workDiv = $(this).parents('.work-div');
    var $prevDiv = $(this).parents('.work-div').prev('.work-div');
    var id = $prevDiv.attr('id');
    openWork = id;

    $workDiv.fadeOut(400);
    $prevDiv.fadeIn({
      duration: 400,
      start: function () {
        $('#work-wrap').height($('#' + id).outerHeight());
      }
    });
  });

  $(window).on('resize', function () {
    $('#work-wrap').height($('#' + openWork).outerHeight());
  });

});