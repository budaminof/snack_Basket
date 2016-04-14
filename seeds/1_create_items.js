
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('items').del(),

    knex('items').insert([
        {
        name: 'Cured Meat',description:"It's the cure for your meat needs",
        price:10.00,
        image_url:"http://macarenasdelicorner.com/376-thickbox/bellota-iberico-pork-cured-loin-jabugo.jpg"
        },

        {
        name: 'Pickles',
        description:"Sweet and spicy tastes so nicey",
        price:7.00, image_url:"https://cdn.shopify.com/s/files/1/0100/5392/products/PicklePeckTaster_6cbcbf95-3bf9-4f64-9b44-e60d2eafacd8_grande.jpg"
        },

        {
        name: 'Fancy Mustard',
        description:"You might not want to wear your fancy pants.",
        price:4.50,
        image_url:"http://img1.sunset.timeinc.net/sites/default/files/image/2011/03/rosemary-mustard-su2-x.jpg"
        },

        {
        name: 'Olives',
        description:"'Olive you more!'",
        price:6.00,
        image_url:"https://s-media-cache-ak0.pinimg.com/736x/d2/8b/d3/d28bd34a06fb69c5940b99139477a1e1.jpg"
        },

        {
        name: 'Relish',
        description:"You will relish every bite",
        price:7.00,
        image_url:"http://static.wixstatic.com/media/4f8415_a6e2134a965e4af5bb63e4d06da5f3a6.jpg_srz_980_735_85_22_0.50_1.20_0.00_jpg_srz"
        },

        {
        name:'Tapenade',
        description:"Yummy!",
        price:10.00,
        image_url:"https://www.weightwatchers.com/images/1033/dynamic/foodandrecipes/2011/03/EasySundriedTomatoTapenade_203_600.jpg"
        },

        {
        name: 'Pesto',
        description:"It's the BESTO!",
        price:8.50,
        image_url:"https://www.weightwatchers.com/images/1033/dynamic/foodandrecipes/2011/11/PestoSauce_290_600.jpg"
        },

        {
        name: 'Mixed Nuts',
        description:"Hand picked and shelled by our fair trade cooperative of indigenous squirrels.",
        price:8.50,
        image_url:"http://inzanaranch.com/Store/media/catalog/product/3/-/3-img_1443-600.jpg"
        },

        {
        name: 'Stanky Cheese',
        description:"All this shit is so cheesy!",
        price:7.25,
        image_url:"http://www.kirklands.com/blog/wp-content/uploads/2015/11/rsz_143803_1.jpg"
        },

        {
        name: 'GF Basket',
        description:"If you're glutarded like me, you'll really appreciate this compendium of snacks.",
        price:40.00,
        image_url:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRNky-M8i3IYI_5TD8QfQLV1xBaFfTZdgrGIRlTlgl5kipXHZemHw"
        },

        {
        name: 'Meat Basket',
        description:"Enjoy this meat basket but don't enjoy it too much.",
        price:40.00,
        image_url:"http://ak1.ostkcdn.com/images/products/7325735/Deli-Direct-Wisconsin-Cheese-and-Sausage-Large-Gift-Basket-200d8862-18a0-4101-976d-01bb6d4152dc_600.jpg"
        },

        {
        name: 'Autoimmune Paleo Basket',
        description:"Endocrine disrupters, glyphosate.",
        price:40.00,
        image_url:"https://cdn3.volusion.com/vskvu.sucqz/v/vspfiles/photos/GiftBasket-XL-2.jpg?1444591744"
        },

        {
        name: 'Veggie Basket',
        description:"Because people 50 years from now will look at us like barbarians!",
        price:40.00,
        image_url:"https://newgrassgardens.files.wordpress.com/2011/03/plangardenveggiebasket.jpg"
        },

        {
        name: 'Dairy Free Basket',
        description:"Because cows are people too.",
        price:40.00,
        image_url:"http://vignette4.wikia.nocookie.net/my-family-my-culture/images/d/d9/Free-posters-and-signs-no-cow-1200x880.jpg/revision/latest?cb=20140424023800"
        },

        {
        name: 'Sweety Basket',
        description:"Because dentists are people too and need jobs.",
        price:28.00,
        image_url:"http://www.great-birthday-gift-ideas.com/images/sweets-basket.jpg"
        },

        {
        name: 'Savory Basket',
        description:"Sometimes you just neeed to slow down and savor the juiciness of life.",
        price:28.00,
        image_url:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQZhFbi9j1--fx3JOV0NTDsFa-_sTDY2Ho7Kz9Li_OInyRIkPI-gA"
        },

        {
        name: 'Chocolate Covered Espresso Beans',
        description:"Yes yes yes!",
        price:9.00,
        image_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCNuEePhTze-39I2rsYw3CKAdIJg9bDyxMasWuKsAeZzfdmi-U"
        }

    ])
 );

};
