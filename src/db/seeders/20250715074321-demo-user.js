'use strict';

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];
    const passwordHash = await bcrypt.hash('A123@abc', 10);

    for (let i = 0; i < 1000; i++) {
      users.push({
        username: faker.internet.username() + i,
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number('09########'),
        password: passwordHash,
        name: faker.person.fullName(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        avatar: faker.image.avatar(),
        bio: faker.lorem.sentence(),
        post_count: 0,
        follower_count: 0,
        following_count: 0,
        like_count: 0,
        report_count: 0,
        gender: faker.helpers.arrayElement(['male', 'female', 'other']),
        birthday: faker.date.between({ from: '1970-01-01', to: '2005-12-31' }),
        role: faker.helpers.arrayElement(['user', 'admin']),
        status: faker.helpers.arrayElement(['active', 'inactive', 'banned']),
        two_factor_enabled: faker.datatype.boolean(),
        login_provider: faker.helpers.arrayElement([
          'local',
          'google',
          'facebook',
        ]),
        last_login_at: faker.date.recent({ days: 30 }),
        email_sent_at: faker.date.recent({ days: 60 }),
        verified_at: faker.datatype.boolean()
          ? faker.date.recent({ days: 90 })
          : null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });
    }

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
