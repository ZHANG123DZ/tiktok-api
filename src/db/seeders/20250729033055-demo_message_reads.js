"use strict";
require("module-alias/register");

const { User, Conversation, Message, UserConversation } = require("@/models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const messageReads = [];

    const conversations = await Conversation.findAll({
      include: [
        {
          model: Message,
          as: "messages",
          order: [["created_at", "ASC"]],
        },
        {
          model: UserConversation,
          as: "participants",
          include: [{ model: User, as: "user" }],
        },
      ],
    });

    for (const conversation of conversations) {
      const messages = conversation.messages;
      const lastMessage = messages[messages.length - 1] || null;

      for (const participant of conversation.participants) {
        const user = participant.user;
        if (!user) continue;

        const shouldRead = Math.random() > 0.4; // 60% đã đọc

        const data = {
          user_id: user.id,
          conversation_id: conversation.id,
          message_id: shouldRead && lastMessage ? lastMessage.id : null,
          read_at:
            shouldRead && lastMessage
              ? new Date(lastMessage.created_at.getTime() + 1000)
              : null,
          created_at: new Date(),
          updated_at: new Date(),
        };

        messageReads.push(data);
      }
    }

    if (messageReads.length > 0) {
      await queryInterface.bulkInsert("message_reads", messageReads);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("message_reads", null, {});
  },
};
