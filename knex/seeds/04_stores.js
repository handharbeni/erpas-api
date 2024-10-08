
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('stores').del()
    .then(function () {
      // Inserts seed entries
      return knex('stores').insert([
        {
          id: 0,
          name: "Default Stores",
          address: "Indonesia",
          store_type: 0,
          status: 0,
          open: "12:00",
          close: "13:00",
          company_id: 1,
          created_by: 1,
          modified_by: 1,
          date_created: "2023-12-12 02:09:18",
          date_modified: "2023-12-12 02:09:18"
        }
      ]);
    });
};
