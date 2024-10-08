var bcrypt = require('bcryptjs');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 0,
          name: "User Default",
          identity_number: null,
          address: null,
          phone_number: null,
          username: "admin@admin.com",
          email: "admin@admin.com",
          password: bcrypt.hashSync('admin', 8),
          pin: null,
          is_changed_pin: null,
          image: null,
          date_created: "2023-12-12 02:09:18",
          date_modified: "2023-12-12 02:09:18"
        }
      ]);
    });
};
