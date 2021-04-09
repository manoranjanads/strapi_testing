const { dilmahLanguages } = require("./languages");

module.exports = {
  processLanguage(lang) {
    var langToSend = "en";
    dilmahLanguages.forEach((l) => {
      if (lang === l.value) {
        langToSend = l.value2;
      }
    });
    
    return langToSend;
  },
};
