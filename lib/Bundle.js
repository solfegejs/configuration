const Configuration = require("./Configuration");

module.exports = class Bundle {
  getPath() {
    return __dirname;
  }

  initialize(application) {
    application.setParameter("configuration", new Configuration());
  }
};
