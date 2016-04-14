$('document').ready(function() {
//matt

  // $('#myModal').on('focus', function () {
  //   $('#email').focus();
  // })

  $("#myModal").on("show.bs.modal", function(e) {
    var link = $(e.relatedTarget);
    $(this).find(".modal-body").load(link.attr("href"));
});

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
