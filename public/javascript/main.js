$('document').ready(function() {
  // $('#myModal').on('focus', function () {
  //   $('#email').focus();
  // })

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

/// CART
  if (window.location.pathname == "/cart") {
  var total = 0;

  for (var i = 0; i < $('.price').length; i++) {
    console.log($('.price')[i].getAttribute('price-data'));
    total += Number($('.price')[i].getAttribute('price-data'));
  }
  var tax = total * 0.8;
  total += tax;

  $('.tax').text('$ '+ tax.toFixed(2));
  $('.total').text('$ '+ total.toFixed(2));
  console.log('total',total);
}

});
