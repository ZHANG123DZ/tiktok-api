const pusher = require("@/configs/pusher");
const { Message, Conversation, UserConversation, User } = require("@/models");

class MessageService {
  async checkAccess(conversationId, userId) {
    const exists = await UserConversation.findOne({
      where: { conversation_id: conversationId, user_id: userId },
    });
    if (!exists) throw new Error("Forbidden");
  }

  async getMessages(conversationId, userId) {
    await this.checkAccess(conversationId, userId);

    const messages = await Message.findAll({
      where: { conversation_id: conversationId },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username", "full_name", "avatar_url"],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    const plainMessages = messages.map((mes) => {
      const plain = mes.toJSON();
      return {
        ...plain,
        author: plain.sender.id === userId ? "me" : "other",
      };
    });
    return plainMessages;
  }

  async create(conversationId, userId, content) {
    await this.checkAccess(conversationId, userId);

    const message = await Message.create({
      conversation_id: conversationId,
      user_id: userId,
      content,
    });

    await Conversation.update(
      { updated_at: new Date() },
      { where: { id: conversationId } }
    );
    pusher.trigger(
      `conversation-${message.conversation_id}`,
      "new-message",
      message
    );

    message.dataValues.author =
      message.dataValues.user_id === userId ? "me" : "other";

    return message;
  }

  async update(messageId, userId, newContent) {
    const message = await Message.findByPk(messageId);
    if (!message) throw new Error("Message not found");
    if (message.user_id !== userId) throw new Error("Forbidden");

    message.content = newContent;
    await message.save();
    pusher.trigger(
      `conversation-${message.conversation_id}`,
      "new-message",
      message
    );
    return message;
  }

  async remove(messageId, userId) {
    const message = await Message.findByPk(messageId);
    if (!message) throw new Error("Message not found");
    if (message.user_id !== userId) throw new Error("Forbidden");

    await message.destroy();
    return { success: true };
  }

  async getById(messageId, userId) {
    const message = await Message.findByPk(messageId, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username", "full_name", "avatar_url"],
        },
      ],
    });

    if (!message) throw new Error("Message not found");
    await this.checkAccess(message.conversation_id, userId);
    pusher.trigger(
      `conversation-${message.conversation_id}`,
      "new-message",
      message
    );
    return message;
  }
}

module.exports = new MessageService();
