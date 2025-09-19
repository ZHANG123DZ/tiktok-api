'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users`
    );
    const [posts] = await queryInterface.sequelize.query(
      `SELECT id FROM posts`
    );

    const bookmarks = [];

    const getRandomPosts = (count) => {
      return posts
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * count) + 1);
    };

    for (const user of users) {
      const randomPosts = getRandomPosts(5);

      for (const post of randomPosts) {
        bookmarks.push({
          user_id: user.id,
          book_mark_able_id: post.id,
          book_mark_able_type: 'post',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('book_marks', bookmarks);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('book_marks', null, {});
  },
};
