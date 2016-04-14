$('document').ready(function() {
//matt

  $('#myModal').on('focus', function () {
    $('#email').focus();
  })

//bud
  $('.clickUsers').on('click', function(){
        $('.users').toggle('slow');
    })
  $('.clickItems').on('click', function(){
    $('.items').toggle('slow');
  })

  $('.clickAdmin').on('click', function(){
    $('.addAdmin').toggle('slow');
  })

  $('.clickAddProduct').on('click', function(){
    $('.addProduct').toggle('slow');
  })


});
