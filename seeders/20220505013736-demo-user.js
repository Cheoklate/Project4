const { Checkbox } = require('@mui/material');
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
        password: userPassword,
        firstName: Gregory,
        lastName: Cheok,
        admin: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'gcheok88@gmail.com',
        password: userPassword,
        firstName: Gregory,
        lastName: Cheok,
        admin: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('users', usersList, { returning: true });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
