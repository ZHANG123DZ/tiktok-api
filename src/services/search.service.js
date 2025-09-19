const elastic = require('@/configs/elastics');
const checkFollowManyUsers = require('@/helper/checkFollowManyUsers');
const checkPostInteractions = require('@/helper/checkPostInteractions');
const { Post, User, Tag } = require('@/models/index');

async function searchAll(query, userId) {
  const res = await elastic.search({
    index: ['users', 'posts'],
    query: {
      bool: {
        should: [
          {
            bool: {
              filter: { term: { _index: 'users' } },
              must: {
                multi_match: {
                  query,
                  fields: ['username^2', 'name^3', 'bio'],
                  fuzziness: 'AUTO',
                },
              },
            },
          },
          {
            bool: {
              filter: { term: { _index: 'posts' } },
              must: {
                multi_match: {
                  query,
                  fields: [
                    'title^3',
                    'tags^3',
                    'topics^2',
                    'description^2',
                    'authorName',
                    'authorUserName',
                    'metaTitle',
                    'metaDescription',
                  ],
                  fuzziness: 'AUTO',
                },
              },
            },
          },
        ],
      },
    },
  });
  const hits = res.hits.hits;
  const userIds = hits.filter((h) => h._index === 'users').map((h) => h._id);
  const postIds = hits.filter((h) => h._index === 'posts').map((h) => h._id);

  const [users, posts] = await Promise.all([
    User.findAll({
      where: { id: userIds },
      attributes: ['id', 'username', 'name', 'avatar', 'bio', 'followerCount'],
    }),
    Post.findAll({
      where: { id: postIds },
      include: [
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] },
        },
      ],
    }),
  ]);

  const followMap = await checkFollowManyUsers(
    userId,
    users.map((u) => u.id)
  );

  const usersWithFollow = users.map((u) => {
    const plain = u.get?.({ plain: true }) ?? u;
    return {
      ...plain,
      isFollow: followMap.get(plain.id) || false,
    };
  });

  const interactionMap = await checkPostInteractions(postIds, userId);
  const postsWithInteraction = posts.map((p) => {
    const plain = p.get({ plain: true });
    const { isLiked = false, isBookMarked = false } =
      interactionMap.get(p.id) || {};

    return {
      ...plain,
      author: {
        avatar: plain.authorAvatar,
        username: plain.authorUserName,
        name: plain.authorName,
      },
      tags: plain.tags?.map((t) => t.name) || [],
      isLiked,
      isBookMarked,
    };
  });

  const userResults = hits
    .filter((h) => h._index === 'users')
    .map((h) => {
      const user = usersWithFollow.find((u) => String(u.id) === String(h._id));
      return user ? user : null;
    })
    .filter(Boolean);

  const postResults = hits
    .filter((h) => h._index === 'posts')
    .map((h) => {
      const post = postsWithInteraction.find(
        (p) => String(p.id) === String(h._id)
      );
      return post ? post : null;
    })
    .filter(Boolean);

  return {
    users: userResults,
    posts: postResults,
  };
}

// async function suggestion(input, size = 10) {
//   if (!input || typeof input !== 'string') return [];

//   try {
//     const result = await elastic.search({
//       index: 'suggestions',
//       size,
//       query: {
//         match_phrase_prefix: {
//           term: {
//             query: input,
//             slop: 1,
//           },
//         },
//       },
//     });

//     const suggestions = result.hits.hits.map((hit) => hit._source.term);
//     return [...new Set(suggestions)];
//   } catch (err) {
//     console.error('❌ Suggestion search failed:', err);
//     return [];
//   }
// }

async function suggestion(prefix) {
  const result = await elastic.search({
    index: 'suggestions',
    body: {
      suggest: {
        phrase_suggest: {
          prefix, // ví dụ: 'cach hoc'
          completion: {
            field: 'term',
            fuzzy: {
              fuzziness: 1, // cho phép sai 1 ký tự
            },
            size: 10,
          },
        },
      },
    },
  });

  return result.suggest.phrase_suggest[0].options
    .map((opt) => opt.text)
    .reverse();
}

async function searchUsers(query) {
  // 1. Search Elasticsearch để lấy danh sách user_id
  const res = await elastic.search({
    index: 'users',
    query: {
      multi_match: {
        query,
        fields: ['name^3', 'username^2', 'bio'],
        fuzziness: 'AUTO',
      },
    },
  });

  const ids = res.hits.hits.map((hit) => hit._id);

  if (ids.length === 0) return [];

  // 2. Query DB để lấy dữ liệu chuẩn nhất
  // const [rows] = await db.query(
  //   'SELECT id, username, nickname, bio FROM users WHERE id IN (?)',
  //   [ids]
  // );

  // // 3. Giữ đúng thứ tự theo Elasticsearch
  // const idOrder = new Map(ids.map((id, i) => [id, i]));
  // rows.sort((a, b) => idOrder.get(String(a.id)) - idOrder.get(String(b.id)));

  // return rows;
}

module.exports = { searchAll, searchUsers, suggestion };
