$('document').ready(function() {
  console.log('Ready!');

  $('.add-to-cart').click(function(){
    var listing = $(this).querySelector('cart-info');
    $(listing).clone().appendTo('.dropdown-menu')
  });
})
