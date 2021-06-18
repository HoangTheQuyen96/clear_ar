const { Logger } = require("./infrastructure");

const { GRPCServer } = require("../entrypoints/grpc/grpc-server");
const { HTTPServer } = require("../entrypoints/http/http-server");
const { ListenCreatePromotion } = require("../entrypoints/event-listener/listen-create-promotion");
/**
 * Init gRPC server
 */
 new GRPCServer({
    port: process.env.ENTRYPOINT_GRPC_PORT,
    serverName: process.env.SERVER_NAME,
    logger: new Logger(),
  }).listen();

/**
 * Listen http request
 */
new HTTPServer({
    portHttp: process.env.ENTRYPOINT_HTTP_PORT,
    logger: new Logger(),
}).listen();

new ListenCreatePromotion({
  host: process.env.KAFKA_HOST,
  topic: process.env.KAFKA_TOPIC_CREATE_PROMOTION,
  groupId: `${process.env.NODE_ENV}-${process.env.KAFKA_CONSUMER_GROUP_ID}`,
  connectTimeout: Number.parseFloat(process.env.KAFKA_CONNECT_TIMEOUT),
  logger: new Logger(),
}).listen();
