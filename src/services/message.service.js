const pusher = require('@/configs/pusher');
const getAgentByIntent = require('@/function/getAgentByIntent');
const { Message, Conversation, UserConversation, User } = require('@/models');
const intentClassifier = require('@/utils/intentClassifier');
const { Op } = require('sequelize');
const openai = require('@/utils/openai');

class MessageService {
  async checkAccess(conversationId, userId) {
    const exists = await UserConversation.findOne({
      where: { conversationId: conversationId, userId: userId },
    });
    if (!exists) throw new Error('Forbidden');
  }

  async getMessages(conversationId, userId, page = 1, limit = 20) {
    await this.checkAccess(conversationId, userId);

    const offset = (page - 1) * limit;

    // Fetch tin nhắn trong trang hiện tại
    const messages = await Message.findAll({
      where: { conversationId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'name', 'avatar', 'createdAt'],
        },
      ],
      order: [['created_at', 'ASC']],
      limit,
      offset,
    });

    const plainMessages = messages.map((m) => m.toJSON());

    // Lấy tất cả parentId từ những tin nhắn có trả lời
    const parentIds = plainMessages
      .filter((m) => m.parentId)
      .map((m) => m.parentId);

    let parents = [];
    if (parentIds.length > 0) {
      // Lấy tin nhắn cha (nằm ngoài limit) để hiển thị trong replyTo
      parents = await Message.findAll({
        where: { id: parentIds },
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'username', 'name', 'avatar', 'createdAt'],
          },
        ],
      });
    }

    const parentMap = new Map(parents.map((p) => [p.id, p.toJSON()]));

    const result = plainMessages.map((msg) => {
      const isOwnMessage = msg.sender.id === userId;

      const formatted = {
        id: msg.id,
        content: msg.content,
        type: msg.type,
        createdAt: msg.created_at,
        isOwnMessage,
        reactions: JSON.parse(msg.reactions) || [],
        author: {
          name: msg.sender.name,
          username: msg.sender.username,
          avatar: msg.sender.avatar,
          createdAt: msg.sender.createdAt,
        },
      };

      // Gắn replyTo nếu có
      if (msg.parentId && parentMap.has(msg.parentId)) {
        const parent = parentMap.get(msg.parentId);
        formatted.replyTo = {
          id: parent.id,
          content: parent.content,
          type: parent.type,
          isOwnMessage: parent.sender.id === userId,
          author: {
            name: parent.sender.name,
            username: parent.sender.username,
            avatar: parent.sender.avatar,
            createdAt: parent.sender.createdAt,
          },
        };
      }

      return formatted;
    });
    result.reverse();
    return result;
  }

  async create({ conversationId, userId, content, type, parentId }) {
    await this.checkAccess(conversationId, userId);
    console.log(parentId);
    // Tạo tin nhắn mới
    const message = await Message.create({
      conversationId,
      userId,
      content,
      type,
      parentId,
      reactions: [],
    });

    // Cập nhật updated_at cho conversation
    await Conversation.update(
      { updated_at: new Date() },
      { where: { id: conversationId } }
    );

    // Lấy thông tin người gửi
    const sender = await User.findByPk(userId, {
      attributes: ['name', 'username', 'avatar', 'createdAt'],
    });
    let parentMes = null;

    if (message.parentId) {
      const parentMessage = await Message.findByPk(message.parentId, {
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name', 'username', 'avatar', 'createdAt'],
          },
        ],
      });

      if (parentMessage) {
        const plain = parentMessage.toJSON();

        parentMes = {
          id: plain.id,
          content: plain.content,
          type: plain.type,
          isOwnMessage: plain.sender.id === userId,
          author: {
            name: plain.sender.name,
            username: plain.sender.username,
            avatar: plain.sender.avatar,
            createdAt: plain.sender.createdAt,
          },
        };
      }
    }
    // Định dạng lại dữ liệu gửi qua Pusher
    const payload = {
      id: message.id,
      content: message.content,
      type: message.type,
      author: {
        name: sender.name,
        username: sender.username,
        avatar: sender.avatar,
        createdAt: sender.createdAt,
      },
      replyTo: parentMes,
      reactions: message.reactions || [], // vì là JSON field
    };

    // Gửi qua Pusher
    pusher.trigger(`conversation-${conversationId}`, 'new-message', payload);

    return payload;
  }

  async update(messageId, userId, newContent) {
    const message = await Message.findByPk(messageId);
    if (!message) throw new Error('Message not found');
    if (message.userId !== userId) throw new Error('Forbidden');

    message.content = newContent;
    await message.save();
    pusher.trigger(
      `conversation-${message.conversationId}`,
      'new-message',
      message
    );
    return message;
  }

  async remove(messageId, userId) {
    const message = await Message.findByPk(messageId);
    if (!message) throw new Error('Message not found');
    if (message.userId !== userId) throw new Error('Forbidden');

    await message.destroy();
    return { success: true };
  }

  async getById(messageId, userId) {
    const message = await Message.findByPk(messageId, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'name', 'avatar'],
        },
      ],
    });

    if (!message) throw new Error('Message not found');
    await this.checkAccess(message.conversationId, userId);
    pusher.trigger(
      `conversation-${message.conversationId}`,
      'new-message',
      message
    );
    return message;
  }
  async chatAI(conversationId, botId, input) {
    //Gọi ra AI để trả lời để ra content lưu vào DB

    const oldMessages = await Message.findAll({
      where: {
        conversationId: conversationId,
        userId: {
          [Op.ne]: botId, // loại bot ra nếu cần
        },
      },
      limit: 10,
      order: [['created_at', 'DESC']],
      attributes: ['content'],
      raw: true, // trả về plain object thay vì instance
    });
    oldMessages.reverse();
    const messagesWithRole = oldMessages.map((mes) => ({
      ...mes,
      role: mes.userId === botId ? 'bot' : 'user',
    }));

    const intent = await intentClassifier(messagesWithRole);

    const systemPromptAgent = getAgentByIntent(intent);

    const AIMessage = await openai.send({
      input: [
        {
          role: 'system',
          content: systemPromptAgent,
        },
        ...messagesWithRole,
      ],
    });

    const message = await Message.create({
      conversationId: conversationId,
      userId: botId,
      content: AIMessage,
    });

    pusher.trigger(
      `conversation-${message.conversationId}`,
      'new-message',
      message
    );

    message.dataValues.userId = 'other';
    return message;
  }
}

module.exports = new MessageService();
