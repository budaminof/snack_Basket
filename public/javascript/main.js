$('document').ready(function() {
  console.log('Ready!');

  $('.add-to-cart').click(function(){
    var listing = $(this).parent().parent();
    console.log(listing);
    $(listing).clone().prependTo('.dropdown-menu')
  });
})
