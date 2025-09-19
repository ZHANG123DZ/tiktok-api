require('module-alias/register');
const elastic = require('../configs/elastics');
const { User, Post, Tag, Topic } = require('../models');

async function setupElasticPost(post) {
  try {
    if (!post) {
      console.log('ℹ️ No post data provided to seed');
      return;
    }

    // Check nếu index đã tồn tại
    const exists = await elastic.indices.exists({ index: 'posts' });

    if (!exists) {
      // Tạo index với cấu hình analyzer
      await elastic.indices.create({
        index: 'posts',
        body: {
          settings: {
            analysis: {
              analyzer: {
                autocomplete_index: {
                  tokenizer: 'autocomplete_tokenizer',
                  filter: ['lowercase', 'asciifolding'],
                },
                autocomplete_search: {
                  tokenizer: 'standard',
                  filter: ['lowercase', 'asciifolding'],
                },
                fulltext_search: {
                  tokenizer: 'standard',
                  filter: ['lowercase', 'asciifolding'],
                },
              },
              tokenizer: {
                autocomplete_tokenizer: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 20,
                  token_chars: ['letter', 'digit'],
                },
              },
            },
          },
          mappings: {
            properties: {
              title: {
                type: 'text',
                fields: {
                  autocomplete: {
                    type: 'text',
                    analyzer: 'autocomplete_index',
                    search_analyzer: 'autocomplete_search',
                  },
                  fulltext: {
                    type: 'text',
                    analyzer: 'fulltext_search',
                  },
                  keyword: {
                    type: 'keyword',
                  },
                },
              },
              description: {
                type: 'text',
                analyzer: 'fulltext_search',
                search_analyzer: 'autocomplete_search',
              },
              authorName: {
                type: 'text',
                analyzer: 'autocomplete_index',
                search_analyzer: 'autocomplete_search',
              },
              authorUserName: {
                type: 'text',
                analyzer: 'autocomplete_index',
                search_analyzer: 'autocomplete_search',
              },
              metaTitle: {
                type: 'text',
                analyzer: 'fulltext_search',
                search_analyzer: 'autocomplete_search',
              },
              metaDescription: {
                type: 'text',
                analyzer: 'fulltext_search',
                search_analyzer: 'autocomplete_search',
              },
              tags: {
                type: 'text',
                analyzer: 'fulltext_search',
                search_analyzer: 'autocomplete_search',
              },
              topics: {
                type: 'text',
                analyzer: 'fulltext_search',
                search_analyzer: 'autocomplete_search',
              },
            },
          },
        },
      });

      console.log('✅ Index "posts" created with edge_ngram');
    } else {
      console.log('ℹ️ Index "posts" already exists');
    }

    // Chuẩn bị dữ liệu để seed
    const body = [
      { index: { _index: 'posts', _id: post.id.toString() } },
      {
        title: post.title || '',
        description: post.description || '',
        metaTitle: post?.metaTitle || '',
        metaDescription: post?.metaDescription || '',
        authorName: post.author?.name || '',
        authorUserName: post.author?.username || '',
        tags: post.tags?.map((t) => t.name) || [],
        topics: post.topics?.map((t) => t.name) || [],
      },
    ];

    // Seed dữ liệu vào Elasticsearch
    await elastic.bulk({ refresh: true, body });

    console.log(`✅ Seeded post ID ${post.id} to Elasticsearch successfully`);
  } catch (err) {
    console.error(
      '❌ Elastic setup failed:',
      err.meta?.body?.error || err.message || err
    );
  }
}

async function setupElasticUser(user) {
  try {
    if (!user) {
      console.log('ℹ️ No user data provided to seed');
      return;
    }

    const indexName = 'users';

    // Kiểm tra index đã tồn tại chưa
    const exists = await elastic.indices.exists({ index: indexName });

    if (!exists) {
      await elastic.indices.create({
        index: indexName,
        body: {
          settings: {
            analysis: {
              analyzer: {
                autocomplete_index: {
                  tokenizer: 'autocomplete_tokenizer',
                  filter: ['lowercase', 'asciifolding'],
                },
                autocomplete_search: {
                  tokenizer: 'standard',
                  filter: ['lowercase', 'asciifolding'],
                },
                fulltext_search: {
                  tokenizer: 'standard',
                  filter: ['lowercase', 'asciifolding'],
                },
              },
              tokenizer: {
                autocomplete_tokenizer: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 20,
                  token_chars: ['letter', 'digit'],
                },
              },
            },
          },
          mappings: {
            properties: {
              name: {
                type: 'text',
                fields: {
                  autocomplete: {
                    type: 'text',
                    analyzer: 'autocomplete_index',
                    search_analyzer: 'autocomplete_search',
                  },
                  fulltext: {
                    type: 'text',
                    analyzer: 'fulltext_search',
                  },
                  keyword: {
                    type: 'keyword',
                  },
                },
              },
              username: {
                type: 'text',
                fields: {
                  autocomplete: {
                    type: 'text',
                    analyzer: 'autocomplete_index',
                    search_analyzer: 'autocomplete_search',
                  },
                  fulltext: {
                    type: 'text',
                    analyzer: 'fulltext_search',
                  },
                  keyword: {
                    type: 'keyword',
                  },
                },
              },
              bio: {
                type: 'text',
                analyzer: 'fulltext_search',
                search_analyzer: 'autocomplete_search',
              },
            },
          },
        },
      });

      console.log(`✅ Index "${indexName}" created with analyzers`);
    } else {
      console.log(`ℹ️ Index "${indexName}" already exists`);
    }

    // Tạo document Elasticsearch từ user
    const elasticUser = {
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
    };

    // Index vào Elasticsearch
    await elastic.index({
      index: indexName,
      id: user.id.toString(),
      document: elasticUser,
      refresh: true,
    });

    console.log(`✅ Seeded user ID ${user.id} to Elasticsearch`);
  } catch (err) {
    console.error(
      '❌ Elasticsearch user setup failed:',
      err.meta?.body?.error || err.message || err
    );
  }
}

async function setupSuggestion() {
  const indexName = 'suggestions';

  // 1. Kiểm tra và tạo lại index nếu chưa tồn tại
  const exists = await elastic.indices.exists({ index: indexName });

  if (!exists) {
    await elastic.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            term: {
              type: 'completion',
              analyzer: 'simple',
              preserve_separators: true,
              preserve_position_increments: true,
            },
            type: {
              type: 'keyword',
            },
          },
        },
      },
    });
    console.log('✅ Created index "suggestions"');
  }

  // 2. Lấy dữ liệu từ các nguồn
  const users = await User.findAll({ attributes: ['name', 'username', 'bio'] });
  const posts = await Post.findAll({
    attributes: ['title', 'description', 'metaTitle', 'metaDescription'],
  });
  const tags = await Tag.findAll({ attributes: ['name'] });
  const topics = await Topic.findAll({ attributes: ['name'] });

  const phraseSet = new Set();

  // --- Từ Users ---
  for (const user of users) {
    if (user.name) phraseSet.add(user.name);
    if (user.username) phraseSet.add(user.username);
    if (user.bio && user.bio.length > 10) phraseSet.add(user.bio);
  }

  // --- Từ Posts ---
  for (const post of posts) {
    if (post.title) phraseSet.add(post.title);
    if (post.description) phraseSet.add(post.description);
    if (post.metaTitle) phraseSet.add(post.metaTitle);
    if (post.metaDescription) phraseSet.add(post.metaDescription);
  }

  // --- Từ Tags & Topics ---
  for (const tag of tags) {
    if (tag.name) phraseSet.add(tag.name);
  }

  for (const topic of topics) {
    if (topic.name) phraseSet.add(topic.name);
  }

  // 3. Chuẩn hóa, lọc trùng, loại bỏ rác
  const phrases = [...phraseSet]
    .map((p) => p.trim())
    .filter(
      (p) =>
        p.length >= 3 &&
        p.length <= 100 &&
        !/[^a-zA-Z0-9À-ỹ\s.,!?'"()\-]/.test(p)
    );

  if (phrases.length === 0) {
    console.log('⚠️ No suggestion phrases found');
    return;
  }

  // 4. Đưa vào Elasticsearch với completion suggester
  const body = phrases.flatMap((phrase) => [
    { index: { _index: indexName } },
    {
      term: {
        input: [phrase],
      },
      type: 'phrase',
    },
  ]);

  await elastic.bulk({ refresh: true, body });
  console.log(`✅ Indexed ${phrases.length} suggestion phrases`);
}

setupSuggestion();
module.exports = { setupElasticPost, setupElasticUser, setupSuggestion };
