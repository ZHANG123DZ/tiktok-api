const googleTranslate = require('@vitalets/google-translate-api');

class translateService {
  async translate(text) {
    const defaultLanguage = 'vi';
    if (!text) return '';
    try {
      const res = await googleTranslate.translate(text, {
        to: defaultLanguage,
      });
      return res.text;
    } catch (err) {
      console.log(err);
      return text;
    }
  }
}

module.exports = new translateService();
