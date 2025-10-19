const faker = require('@faker-js/faker');

const {
  Conversation,
  UserConversation,
  User,
  Message,
  MessageRead,
  sequelize,
} = require('@/models');
const { Sequelize } = require('@/models');
const { Op } = Sequelize;

class ConversationService {
  // Tạo mới conversation cho 2 người trở lên
  async create(userId, participantsId, conversationData = {}) {
    participantsId.push(userId);
    if (participantsId.length > 2) {
      conversationData.avatar = faker.image.avatar();
    }
    const users = await User.findAll({
      where: { id: participantsId },
    });
    if (users.length < 2) throw new Error('User(s) not found');
    if (users.length === 2) {
      conversationData.name = null;
    } else {
      if (!conversationData.name) {
        conversationData.name = `${users[0].name} và ${
          users.length - 1
        } người khác`;
      }
      if (!conversationData.avatar) {
        conversationData.avatar = faker.image.avatar();
      }
    }
    const conversation = await Conversation.create(conversationData);

    await UserConversation.bulkCreate(
      participantsId.map((id) => ({
        userId: id,
        conversationId: conversation.id,
      })),
      { ignoreDuplicates: true }
    );
    return conversation;
  }

  async getAllByUser(userId) {
    const conversations = await Conversation.findAll({
      include: [
        {
          model: UserConversation,
          as: 'participants',
          where: { userId },
          attributes: [],
        },
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name', 'avatar', 'username', 'role'],
          through: { attributes: [] },
        },
        {
          model: Message,
          as: 'messages',
          separate: true,
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
        {
          model: MessageRead,
          as: 'listReader',
          where: { userId },
          required: false,
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    const convIds = conversations.map((c) => c.id);

    // Lấy messageId cuối đã đọc
    const reads = await MessageRead.findAll({
      where: { userId },
      attributes: ['conversationId', 'messageId'],
      raw: true,
    });

    const lastReadMap = new Map(
      reads.map((r) => [r.conversationId, r.messageId])
    );

    const { Op } = Sequelize;

    // Đếm số tin chưa đọc
    const unreadCountsArr = await Promise.all(
      convIds.map(async (convId) => {
        const lastReadId = lastReadMap.get(convId) || 0;

        const count = await Message.count({
          where: {
            conversationId: convId,
            userId: { [Op.ne]: userId },
            id: { [Op.gt]: lastReadId },
          },
        });

        return { conversationId: convId, unreadCount: count };
      })
    );

    const unreadMap = new Map(
      unreadCountsArr.map((u) => [u.conversationId, u.unreadCount])
    );

    // ✅ Lấy trạng thái `status` của người còn lại trong UserConversation
    const partnerStatuses = await UserConversation.findAll({
      where: {
        conversationId: { [Op.in]: convIds },
        userId: { [Op.eq]: userId },
      },
      attributes: ['conversationId', 'status'],
      raw: true,
    });

    const statusMap = new Map(
      partnerStatuses.map((p) => [p.conversationId, p.status])
    );

    const accepted = [];
    const pending = [];
    const blocked = [];

    for (const conv of conversations) {
      const data = conv.get({ plain: true });

      if (data.users.length === 2) {
        const speaker = data.users.find((u) => u.id !== userId);
        data.name = speaker.name;
        data.avatar = speaker.avatar;
        data.username = speaker.username;
      }

      data.lastMessage = data.messages?.[0] ?? null;
      data.unreadCount = unreadMap.get(data.id) || 0;
      delete data.messages;
      delete data.listReaders;

      const status = statusMap.get(data.id);
      data.status = status || null;

      if (status === 'accepted') {
        accepted.push(data);
      } else if (status === 'pending') {
        pending.push(data);
      } else {
        blocked.push(data);
      }
    }

    return { accepted, pending, blocked };
  }

  async getById(id, userId) {
    const isParticipant = await UserConversation.findOne({
      where: { conversationId: id, userId },
      attributes: ['status'],
      raw: true,
    });

    if (!isParticipant) throw new Error('Forbidden');

    const conversation = await Conversation.findByPk(id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name', 'avatar', 'username'],
          through: { attributes: [] },
        },
        {
          model: Message,
          as: 'messages',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'username', 'name', 'avatar'],
            },
          ],
        },
      ],
      order: [[{ model: Message, as: 'messages' }, 'createdAt', 'DESC']],
    });

    if (!conversation) throw new Error('Conversation not found');

    const plainConversation = conversation.toJSON();

    if (plainConversation.users.length === 2) {
      const otherUser = plainConversation.users.find((u) => u.id !== userId);
      plainConversation.avatar = otherUser?.avatar || null;
      plainConversation.username = otherUser?.username;
      plainConversation.name = otherUser?.name;
    }

    plainConversation.messages = (plainConversation.messages || []).map(
      (mes) => ({
        ...mes,
        isOwnMessage: mes.userId === userId,
      })
    );

    plainConversation.status = isParticipant.status;

    return plainConversation;
  }

  async update(id, userId, data) {
    const isParticipant = await UserConversation.findOne({
      where: { conversationId: id, userId: userId },
    });
    if (!isParticipant) throw new Error('Forbidden');

    await Conversation.update(data, { where: { id } });
    return await this.getById(id, userId);
  }

  async remove(id, userId) {
    const isParticipant = await UserConversation.findOne({
      where: { conversationId: id, userId: userId },
    });
    if (!isParticipant) throw new Error('Forbidden');

    await Conversation.update({ deletedAt: new Date() }, { where: { id } });
    return true;
  }

  async getOrCreate(userId, targetUserId) {
    // Tìm tất cả conversation có 2 người (userId và targetUserId)
    const conversations = await Conversation.findAll({
      include: [
        {
          model: UserConversation,
          as: 'participants',
          where: {
            userId: {
              [Op.in]: [userId, targetUserId],
            },
          },
          attributes: ['userId', 'status'], // Lấy thêm trường status
        },
      ],
    });

    for (const convo of conversations) {
      const participants = convo.participants;
      const userIds = participants.map((p) => p.userId);

      const isSamePair =
        userIds.includes(userId) &&
        userIds.includes(targetUserId) &&
        userIds.length === 2;

      if (isSamePair) {
        // Lấy tin nhắn cuối cùng trong conversation
        const lastMessage = await Message.findOne({
          where: { conversationId: convo.id },
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'content', 'type', 'createdAt'],
        });

        // Đếm số tin nhắn chưa đọc
        const [result] = await sequelize.query(
          `
        SELECT COUNT(*) AS unreadCount
        FROM messages m
        WHERE m.conversation_id = :conversationId
          AND m.user_id != :userId
          AND NOT EXISTS (
            SELECT 1 FROM message_reads mr
            WHERE mr.message_id = m.id AND mr.user_id = :userId
          )
        `,
          {
            replacements: { conversationId: convo.id, userId },
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        const unreadCount = parseInt(result.unreadCount, 10);

        // Lấy status của userId trong conversation
        const userParticipant = participants.find((p) => p.userId === userId);
        const status = userParticipant?.status || 'unknown';

        return {
          ...convo.toJSON(),
          lastMessage,
          unreadCount,
          status,
        };
      }
    }

    // Nếu chưa có conversation, tạo mới
    const newConvo = await Conversation.create();

    // Tạo participants với status mặc định (ví dụ 'pending')
    await UserConversation.bulkCreate([
      { conversationId: newConvo.id, userId, status: 'accepted' },
      { conversationId: newConvo.id, userId: targetUserId, status: 'pending' },
    ]);

    const other = await User.findByPk(targetUserId);

    return {
      ...newConvo.toJSON(),
      participants: [
        { userId, status: 'pending' },
        { userId: targetUserId, status: 'pending' },
      ],
      name: other.name,
      username: other.username,
      avatar: other.avatar,
      lastMessage: null,
      unreadCount: 0,
      status: 'pending',
    };
  }

  async markedRead(userId, conversationId, messageId = null, readAt = null) {
    const [record, created] = await MessageRead.findOrCreate({
      where: { userId: userId, conversationId: conversationId },
      defaults: {
        messageId: messageId,
        readAt: readAt,
      },
    });

    if (!created) {
      if (record.messageId === null || record.messageId < messageId) {
        await record.update({
          messageId: messageId,
          readAt: readAt,
        });
      }
    }
  }

  async setStatus(userId, conversationId, status) {
    try {
      await UserConversation.update(
        { status: status },
        { where: { userId, conversationId } }
      );
      return;
    } catch (err) {
      console.log(err);
      return;
    }
  }
}

module.exports = new ConversationService();

// {
//     id: 1,
//     avatar:
//       'https://maunailxinh.com/wp-content/uploads/2025/05/anh-meo-ngao-cute-1.jpg',
//     name: 'Hello',
//     unreadCount: 2,
//     acceptMessages: true,
//     lastMessage: {
//       id: 2,
//       content: 'Đã chấp nhận yêu cầu nhắn tin. Bạn có thể bắt đầu trò chuyện.',
//       type: 'system',
//       createdAt: '2025-08-12 18:02:00.956',
//     },
//   },

// {
//   "isGroup": false,
//   "acceptMessages": false,
//   "id": 6,
//   "name": null,
//   "updatedAt": "2025-10-18T13:17:32.257Z",
//   "createdAt": "2025-10-18T13:17:32.257Z"
// }

// {
//   "id": 6,
//   "avatar": null,
//   "name": null,
//   "isGroup": false,
//   "acceptMessages": false,
//   "createdAt": "2025-10-18T13:17:32.000Z",
//   "updatedAt": "2025-10-18T13:17:32.000Z",
//   "deletedAt": null,
//   "participants": [
//     {
//       "userId": 32
//     },
//     {
//       "userId": 773
//     }
//   ]
// }
