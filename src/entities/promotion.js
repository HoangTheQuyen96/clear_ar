module.exports.Promotion = class {
    /**
     * @param {Object} values
     * @param {String} values.id
     * @param {String} values.name
     * @param {String} values.title
     * @param {String} values.description
     * @param {String} values.type
     * @param {String} values.method
     */
    constructor(values) {
      this.id = values.id;
      this.name = values.name;
      this.title = values.title;
      this.description = values.description;
      this.type = values.type;
      this.method = values.method;
    }
};


  