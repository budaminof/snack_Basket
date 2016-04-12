var knex = require('knex')(require('../../knexfile')[process.env.DB_ENV]);

module.exports.findOrCreate= function(profile, cb) {
    knex('users')
    .where({email: JSON.parse(profile._raw).emails[0].value})
    .then(function (user){
        if (user.length > 0){
            cb();
        }
        else {
            knex('users')
            .insert({
                first_name: profile._json.name.givenName,
                last_name: profile._json.name.familyName,
                email: JSON.parse(profile._raw).emails[0].value,
                oauth_type: 'google'
            })
            .returning('*')
            .then(function (user){
                cb();
            })
        }
    })
};
