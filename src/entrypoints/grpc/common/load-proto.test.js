const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");

const utils = require("./load-proto");

jest.mock("grpc", () => ({
  loadPackageDefinition: jest.fn(),
}));

jest.mock("@grpc/proto-loader", () => ({
  loadSync: jest.fn(),
}));

describe("Testing of loadProto function", () => {
  test("", () => {
    const fakeFilePath = "~/";

    const loadProtoMock = jest.spyOn(utils, "loadProto");
    utils.loadProto(fakeFilePath);

    expect(loadProtoMock).toHaveBeenCalledWith(fakeFilePath);

    expect(protoLoader.loadSync).toHaveBeenCalled();
    expect(grpc.loadPackageDefinition).toHaveBeenCalled();
  });
});
