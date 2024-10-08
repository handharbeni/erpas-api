exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('tools').del()
    .then(function () {
      // Inserts seed entries
      return knex('tools').insert([
        {id: 1, name: 'MULTI_LOGIN', value:'true'},
        {id: 2, name: 'mail_host', value:'smtp.googlemail.com'},
        {id: 3, name: 'mail_port', value:'465'},
        {id: 4, name: 'mail_secure', value:'true'},
        {id: 5, name: 'mail_user', value:'your username'},
        {id: 6, name: 'mail_pass', value:'your password'},
        {id: 7, name: 'POS_METHOD', value:'FIFO'},
        {id: 8, name: 'JATIM_QRIS_URL', value:'https://jatimva.bankjatim.co.id/MC/Qris/Dynamic'},
        {id: 9, name: 'JATIM_QRIS_MERCHANTPAN', value:'9360011400000557635'},
        {id: 10, name: 'JATIM_QRIS_HASHCODE', value:'SSS2SV5LHK'},
        {id: 11, name: 'JATIM_QRIS_PURPOSETRX', value:'Pengujian'},
        {id: 12, name: 'JATIM_QRIS_STORELABEL', value:'POS'},
        {id: 13, name: 'JATIM_QRIS_CUSTOMERLABEL', value:'POS'}
      ]);
    });
};
