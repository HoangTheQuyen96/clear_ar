/**
 * @typedef {import('../../../infrastructure/data-gateway/data-gateway').DataGateway} DataGateway
 * @typedef {import('../../../infrastructure/logger/logger').Logger} Logger
 */

const { CustomError } = require("../../common/custom-error");
const { CustomErrorEnum } = require("../../common/custom-error-enum");

/**
 * - Description: 
 *  + This business rule will create a promotion using data gateway
 * - Input: {
        "name": "string",
        "title": "string",
        "description": "string",
        "type": "string",
        "method": "string"
    }
 * - Output: {
        "id": "string",
        "name": "string",
        "description": "string",
        "type": "string",
        "method": "string"
    }
 */

module.exports.CreatePromotion = class {
    /**
     * @param {Object} options
     * @param {Object} options.infra
     * @param {DataGateway} options.infra.dataGateway
     */
    constructor(options) {
        this.dataGateway = options.infra.dataGateway;
    }
    /**
    * @param {Object} data
    * @param {Object} data.name
    * @param {Object} data.title
    * @param {Object} data.description
    * @param {Object} data.type
    * @param {Object} data.method
    * @throws {Error}
    */
    async execute(value) {
        console.log('xxx')
        this.validate(value)

        let promotion
        try {
            promotion = await this.dataGateway.createPromotion(value)
        } catch (error) {
            throw new CustomError(
                CustomErrorEnum.CreatePromotionError,
                "An unexpected error occurred on Promotion system's end.",
                error
            )
        }

        return promotion;
    }
    validate(value) {
        if (!value.name) {
            throw new CustomError(
                CustomErrorEnum.MissingRequiredParameter,
                "Your request is missing name parameter. Please, verify and resubmit.",
            )
        }

        if (!value.title) {
            throw new CustomError(
                CustomErrorEnum.MissingRequiredParameter,
                "Your request is missing title parameter. Please, verify and resubmit.",
            );
        }

        if (!value.description) {
            throw new CustomError(
                CustomErrorEnum.MissingRequiredParameter,
                "Your request is missing description parameter. Please, verify and resubmit.",
            )
        }

        if (!value.type) {
            throw new CustomError(
                CustomErrorEnum.MissingRequiredParameter,
                "Your request is missing type parameter. Please, verify and resubmit.",
            )
        }

        if (!value.method) {
            throw new CustomError(
                CustomErrorEnum.MissingRequiredParameter,
                "Your request is missing method parameter. Please, verify and resubmit.",
            )
        }
    }
}