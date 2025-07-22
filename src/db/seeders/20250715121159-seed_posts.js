"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /* 1. Lấy danh sách users (tối đa 1 000 bản ghi) */
    const users = await queryInterface.sequelize.query(
      `SELECT id, full_name, username, avatar_url FROM users LIMIT 1000`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length) {
      throw new Error("Không có user để gán author_id cho posts.");
    }

    /* 2. Hàm sinh nội dung HTML động */
    const generateContent = () => {
      let html = "";

      html += `<h1>${faker.lorem.words({ min: 5, max: 10 })}</h1>`;
      html += `<p>${faker.lorem.paragraph()}</p>`;

      html += `<h2>${faker.lorem.words({ min: 3, max: 6 })}</h2>`;
      html += `<p>${faker.lorem.paragraphs(2, "<br/><br/>")}</p>`;

      html += `<h3>${faker.lorem.words({ min: 2, max: 4 })}</h3>`;
      html += `<img src="${faker.image.url({
        width: 1200,
        height: 600,
        category: "nature",
        randomize: true,
      })}" alt="${faker.lorem.word()}" />`;
      html += "<ul>";
      Array.from({ length: faker.number.int({ min: 3, max: 6 }) }).forEach(
        () => {
          html += `<li><strong>${faker.lorem.word()}:</strong> ${faker.lorem.sentence()}</li>`;
        }
      );
      html += "</ul>";

      html += `<pre><code>${faker.lorem.paragraphs(3, "\n")}</code></pre>`;

      html += `<blockquote><p>${faker.lorem.paragraph()}</p></blockquote>`;

      return html;
    };

    /* 3. Tạo dữ liệu posts */
    const posts = [];

    for (let i = 0; i < 300; i++) {
      const author = faker.helpers.arrayElement(users);

      posts.push({
        title: faker.lorem.sentence({ min: 6, max: 12 }),
        slug: faker.helpers.slugify(faker.lorem.slug()),
        content: generateContent(),
        description: faker.lorem.sentences(2),
        excerpt: faker.lorem.sentences(2),
        author_id: author.id,
        author_name: author.full_name,
        author_avatar: author.avatar_url,
        author_username: author.username,
        meta_title: faker.lorem.words({ min: 3, max: 6 }),
        meta_description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(["published", "draft", "pending"]),
        view_count: faker.number.int({ min: 0, max: 5000 }),
        like_count: faker.number.int({ min: 0, max: 1000 }),
        comment_count: faker.number.int({ min: 0, max: 500 }),
        report_count: faker.number.int({ min: 0, max: 20 }),
        language: faker.helpers.arrayElement(["en", "vi"]),
        visibility: faker.helpers.arrayElement(["public", "private"]),
        moderation_status: faker.helpers.arrayElement([
          "approved",
          "pending",
          "rejected",
        ]),
        cover_url: faker.image.url({
          width: 1200,
          height: 600,
          category: "nature",
          randomize: true,
        }),
        thumbnail_url: faker.image.url({
          width: 400,
          height: 300,
          category: "abstract",
          randomize: true,
        }),
        reading_time: faker.number.int({ min: 2, max: 15 }),
        is_pinned: faker.datatype.boolean() ? 1 : 0,
        is_featured: faker.datatype.boolean() ? 1 : 0,
        has_media: faker.datatype.boolean() ? 1 : 0,
        visibility_updated_at: new Date(),
        published_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("posts", posts);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("posts", null, {});
  },
};
