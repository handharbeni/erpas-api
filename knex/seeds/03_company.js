
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('company').del()
    .then(function () {
      // Inserts seed entries
      return knex('company').insert([
        {
          id: 0,
          name: "Default Company",
          address: "Indonesia",
          subscription_type: 1,
          subscription_end: null,
          owner_id: 1,
          date_created: "2023-12-12 02:09:18",
          date_modified: "2023-12-12 02:09:18"
        }
      ]);
    });
};
