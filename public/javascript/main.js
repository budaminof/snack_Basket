$('document').ready(function() {
  $("#myModal").on("show.bs.modal", function(e) {
    var link = $(e.relatedTarget);
    $(this).find(".modal-body").load(link.attr("href"));
  });

  $('.hidden-edit-user').hide();
  $('.hidden-edit-item').hide();

  $('.edit-item').on('click', function() {
    $('.hidden-edit-item').toggle();
  });

  $('.edit-user').on('click', function() {
    $('.hidden-edit-user').toggle();
  })

  $('.clickUsers').on('click', function(){
    $('.videobox').slideUp('slow');
    $('.users').toggle('slow');
    $('.items').hide();
    $('.addAdmin').hide();
    $('.addProduct').hide();
  })

  $('.clickItems').on('click', function(){
    $('.videobox').slideUp('slow');
    $('.items').toggle('slow');
    $('.users').hide();
    $('.addAdmin').hide();
    $('.addProduct').hide();
  })

  $('.clickAdmin').on('click', function(){
    $('.videobox').slideUp('slow');
    $('.addAdmin').toggle('slow');
    $('.users').hide();
    $('.items').hide();
    $('.addProduct').hide();
  })

  $('.clickAddProduct').on('click', function(){
    $('.videobox').slideUp('slow');
    $('.addProduct').toggle('slow');
    $('.users').hide();
    $('.items').hide();
    $('.addAdmin').hide();
  })

/// CART
  if (window.location.pathname == "/users/cart") {
  var total = 0;

  for (var i = 0; i < $('.price').length; i++) {
    total += Number($('.price')[i].getAttribute('price-data'));
  }
  var tax = total * 0.08;
  total += tax;

  $('.tax').text('$ '+ tax.toFixed(2));
  $('.total').text('$ '+ total.toFixed(2));
}

});
