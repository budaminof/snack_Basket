
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('items').del(),

    knex('items').insert([
        {
        name: 'Cured Meat',description:"It's the cure for your meat needs",
        price:10.00,
        image_url:"http://thewinebar.com/sites/default/files/styles/main_image/public/cured-meat.png?itok=7NlNPLw5"
        },

        {
        name: 'Pickles',
        description:"Sweet and spicy tastes so nicey",
        price:7.00, image_url:"http://static1.squarespace.com/static/563ace9be4b0f155c92ec39c/5647a58de4b0389db0961861/5647a5bfe4b0a1999a71a4ad/1447536066617/picklesopt.jpg"
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
        image_url:"http://p-fst2.pixstatic.com/524ee0d1697ab06140007c25._w.1500_s.fit_.jpg"
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
        image_url:"http://blog.fatfreevegan.com/images/artichoke-tapenade.jpg"
        },

        {
        name: 'Pesto',
        description:"It's the BESTO!",
        price:8.50,
        image_url:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQdEnZZ4MhoKhnH_7pTKomAaCZyo07hojcC9LV26WTI6MBIObRNrw"
        },

        {
        name: 'Mixed Nuts',
        description:"Hand picked and shelled by our fair trade cooperative of indigenous squirrels.",
        price:8.50,
        image_url:"http://s-ak.buzzfed.com/static/enhanced/terminal01/2010/11/10/16/enhanced-buzz-16108-1289424850-3.jpg"
        },

        {
        name: 'Stanky Cheese',
        description:"All this shit is so cheesy!",
        price:7.25,
        image_url:"http://culturecheesemag.com/wp-content/uploads/2015/01/shutterstock-stinky-cheese-plate-750x368.jpg"
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
        image_url:"http://thumbs.dreamstime.com/z/sausage-meat-basket-wooden-table-space-text-41055380.jpg"
        },

        {
        name: 'Autoimmune Paleo Basket',
        description:"Endocrine disrupters, glyphosate.",
        price:40.00,
        image_url:"http://s3.amazonaws.com/weighttraining.com/data/1303/content.jpg?1339031847"
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
