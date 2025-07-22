"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const badgeTemplates = [
      { name: "Top Author", icon: "🏆" },
      { name: "Early Adopter", icon: "🚀" },
      { name: "Community Helper", icon: "🤝" },
      { name: "Mentor", icon: "🎓" },
      { name: "Bug Hunter", icon: "🔍" },
    ];
    const badgeColors = ["primary", "secondary", "success", "warning", "info"];

    const badges = badgeTemplates.map((badge, i) => ({
      name: badge.name,
      icon: badge.icon,
      color: badgeColors[i % badgeColors.length],
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("badges", badges);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("badges", null, {});
  },
};
