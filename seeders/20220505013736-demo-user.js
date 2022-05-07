const jsSHA = require('jssha');

module.exports = {
  up: async (queryInterface) => {
    const userPassword = 'test';
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(userPassword);
    const hashedPassword = shaObj.getHash('HEX');

    const usersList = [
      {
        email: 'cheok-capital@gmail.com',
        password: hashedPassword,
        firstName: 'Gregory',
        lastName: 'Cheok',
        admin: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'gcheok88@gmail.com',
        password: hashedPassword,
        firstName: 'Gregory',
        lastName: 'Cheok',
        admin: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const transactionList =[
      {
        type: 'deposit',
        value: 85386.93,
        timestamp: 1609394400000,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]

    await queryInterface.bulkInsert('transactions', transactionList, { returning: true });
    await queryInterface.bulkInsert('users', usersList, { returning: true });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('transactions', null, {});

  },
};
