const { Follow } = require('@/models');

async function checkFollowManyUsers(userId, targetUserIds) {
  const map = new Map(targetUserIds.map((id) => [id, false]));

  if (!userId || !targetUserIds?.length) return map;

  const rows = await Follow.findAll({
    where: {
      userId,
      followAbleId: targetUserIds,
      followAbleType: 'user',
    },
    attributes: ['followAbleId'],
    raw: true,
  });

  for (const row of rows) {
    map.set(row.followAbleId, true);
  }

  return map;
}

module.exports = checkFollowManyUsers;
