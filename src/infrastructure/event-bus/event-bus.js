const { healthcheck } = require("./methods/healthcheck");
const { checkKafkaMetadata } = require("./methods/check-kafka-metadata");
const { checkKafkaProducer } = require("./methods/check-kafka-producer");
const { checkKafkaConsumer } = require("./methods/check-kafka-consumer");
const { emit } = require("./methods/emit");

class EventBus {
  /**
   *
   * @param {Object} options
   * @param {String} options.kafkaHost
   * @param {String} options.kafkaProducer
   * @param {String} options.kafkaTopics
   * @param {Object} options.infra
   * @param {Object} options.infra.logger
   */
  constructor(options) {
    this.kafkaHost = options.kafkaHost;
    this.kafkaProducer = options.kafkaProducer;
    this.kafkaTopics = options.kafkaTopics;

    this.logger = options.infra.loggerGateway;
  }
}

EventBus.prototype.checkKafkaMetadata = checkKafkaMetadata;
EventBus.prototype.checkKafkaProducer = checkKafkaProducer;
EventBus.prototype.checkKafkaConsumer = checkKafkaConsumer;
EventBus.prototype.healthcheck = healthcheck;
EventBus.prototype.emit = emit;

module.exports.EventBus = EventBus;
