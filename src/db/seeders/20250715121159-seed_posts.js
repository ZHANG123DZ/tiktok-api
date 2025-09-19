'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Lấy users để random author
    const users = await queryInterface.sequelize.query(
      'SELECT id, username, name, avatar FROM users',
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!users.length) {
      throw new Error('Không có user nào để gán author cho post');
    }

    // Lấy tiktok_musics (id, tiktok_id)
    const tiktokMusics = await queryInterface.sequelize.query(
      `SELECT id, tiktok_id FROM tiktok_musics`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Lấy musics
    const musics = await queryInterface.sequelize.query(
      `SELECT id, slug FROM musics`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Tạo map: tiktok_musics.id -> musics.id
    const musicMap = new Map();
    for (const tm of tiktokMusics) {
      const slug = `tiktok-music-${tm.tiktok_id}`;
      const music = musics.find((m) => m.slug === slug);
      if (music) {
        musicMap.set(tm.id, music.id);
      }
    }

    // Lấy tiktok_videos
    const videos = await queryInterface.sequelize.query(
      `SELECT id, tiktok_id, music_id, title, description, content, thumbnail 
       FROM tiktok_videos`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!videos.length) {
      throw new Error('Không có dữ liệu tiktok_videos để tạo posts');
    }

    const posts = videos.map((video) => {
      const author = faker.helpers.arrayElement(users);

      // Map music_id từ tiktok_videos -> musics.id
      const mappedMusicId = video.music_id
        ? musicMap.get(video.music_id) || null
        : null;

      return {
        title: video.title || `TikTok Video ${video.tiktok_id}`,
        slug: `${video.tiktok_id}`,
        thumbnail: video.thumbnail,
        content: video.content,
        type: 'video',
        description: video.description || faker.lorem.sentences(2),
        music_id: mappedMusicId,
        author_id: author.id,
        author_name: author.name,
        author_username: author.username,
        author_avatar: author.avatar,
        meta_title: '',
        meta_description: '',
        status: 'draft',
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        book_mark_count: 0,
        share_count: 0,
        report_count: 0,
        language: 'vi',
        visibility: 'public',
        moderation_status: 'approved',
        is_pinned: 0,
        is_featured: 0,
        visibility_updated_at: null,
        published_at: faker.date.recent(30),
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
    });

    await queryInterface.bulkInsert('posts', posts, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', {
      slug: {
        [Sequelize.Op.like]: '%',
      },
    });
  },
};
