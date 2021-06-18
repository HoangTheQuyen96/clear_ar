const { CustomErrorEnum } = require("../../common/custom-error-enum");
const { CustomError } = require("../../common/custom-error");
const { CreatePromotion } = require('../create-promotion/interactor')
const { Promotion } = require('../../../entities/promotion')

let mockError;
let mockInject;
let mockInput;
let mockOutput;

beforeEach(() => {
    mockError = new Error("Oops")
    mockInput = {
        name: "The awesome promotion",
        title: "title promotion",
        description: "This is an importance promotion",
        type: "APP_FOR_CART",
        method: "FIXED_DISCOUNT_AMOUNT",
    };

    mockOutput = new Promotion({
        id: 1,
        name: "The awesome promotion",
        title: "title promotion",
        description: "This is an importance promotion",
        type: "APP_FOR_CART",
        method: "FIXED_DISCOUNT_AMOUNT",
    })
    mockInject = {
        infra: {
            dataGateway: {
                createPromotion: jest.fn().mockResolvedValue(mockOutput)
            },
        },
    };
})

describe("Validating input", () => {
    test("should throw error if the input is missing 'name'", async () => {
        delete mockInput.name;

        const interactor = new CreatePromotion(mockInject);
        let actualError;
        try {
            await interactor.execute(mockInput);
        } catch (error) {
            actualError = error;
        }

        const expectedError = new CustomError(
            CustomErrorEnum.MissingRequiredParameter,
            "Your request is missing name parameter. Please, verify and resubmit.",
        );
        expect(actualError.code).toEqual(expectedError.code);
        expect(actualError.message).toEqual(expectedError.message);
    })

    test("should throw error if the input is missing 'title'", async () => {
        delete mockInput.title;

        const interactor = new CreatePromotion(mockInject);
        let actualError;
        try {
            await interactor.execute(mockInput);
        } catch (error) {
            actualError = error;
        }

        const expectedError = new CustomError(
            CustomErrorEnum.MissingRequiredParameter,
            "Your request is missing title parameter. Please, verify and resubmit.",
        );
        expect(actualError.code).toEqual(expectedError.code);
        expect(actualError.message).toEqual(expectedError.message);
    })

    test("should throw error if the input is missing 'description'", async () => {
        delete mockInput.description;

        const interactor = new CreatePromotion(mockInject);
        let actualError;
        try {
            await interactor.execute(mockInput);
        } catch (error) {
            actualError = error;
        }

        const expectedError = new CustomError(
            CustomErrorEnum.MissingRequiredParameter,
            "Your request is missing description parameter. Please, verify and resubmit.",
        );
        expect(actualError.code).toEqual(expectedError.code);
        expect(actualError.message).toEqual(expectedError.message);
    })

    test("should throw error if the input is missing 'type'", async () => {
        delete mockInput.type;

        const interactor = new CreatePromotion(mockInject);
        let actualError;
        try {
            await interactor.execute(mockInput);
        } catch (error) {
            actualError = error;
        }

        const expectedError = new CustomError(
            CustomErrorEnum.MissingRequiredParameter,
            "Your request is missing type parameter. Please, verify and resubmit.",
        );
        expect(actualError.code).toEqual(expectedError.code);
        expect(actualError.message).toEqual(expectedError.message);
    })

    test("should throw error if the input is missing 'method'", async () => {
        delete mockInput.method;

        const interactor = new CreatePromotion(mockInject);
        let actualError;
        try {
            await interactor.execute(mockInput);
        } catch (error) {
            actualError = error;
        }

        const expectedError = new CustomError(
            CustomErrorEnum.MissingRequiredParameter,
            "Your request is missing method parameter. Please, verify and resubmit.",
        );
        expect(actualError.code).toEqual(expectedError.code);
        expect(actualError.message).toEqual(expectedError.message);
    })
})


describe("create promotion using dataGateway", () => {
    test("Should throw an internal error if datagateway create promotion throw error", async () => {
        mockInject.infra.dataGateway.createPromotion.mockRejectedValue(mockError)

        const interactor = new CreatePromotion(mockInject);

        let actualError;
        try {
            await interactor.execute(mockInput);

        } catch (error) {
            actualError = error;
        }

        const expectedError = new CustomError(
            CustomErrorEnum.CreatePromotionError,
            "An unexpected error occurred on Promotion system's end.",
            mockError
        );
        
        expect(actualError.message).toEqual(expectedError.message);
        expect(actualError.code).toEqual(expectedError.code);
    })

    test("Should return a promotion if datagateway create promotion success", async () => {
        const interactor = new CreatePromotion(mockInject);
        const result = await interactor.execute(mockInput);

        expect(result).toEqual(mockOutput)
    })
})