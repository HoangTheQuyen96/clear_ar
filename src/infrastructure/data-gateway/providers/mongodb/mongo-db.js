const mongoose = require("mongoose");
const {Promotion} = require('./models/promotion')


module.exports.MongoDb = class {
  constructor(options) {
    this.mongoUrl = options.mongoUrl;
    this.conn = null;
    this.Promotion = Promotion
  }

  async connect() {
    await mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.conn = mongoose.connection;

  }
};
