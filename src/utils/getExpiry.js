const ACTION_EXPIRY = {
  reset_password: 5 * 60 * 1000, // 5 phút
  verify_email: 15 * 60 * 1000, // 15 phút
  confirm_transaction: 2 * 60 * 1000, // 2 phút
};

function getExpiry(action) {
  return new Date(Date.now() + (ACTION_EXPIRY[action] || 5 * 60 * 1000));
}
module.exports = getExpiry;
