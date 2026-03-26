import logger from "../../../shared/config/logger.js";
import ResponseFormatter from "../../../shared/utils/responseFormatter.js";

/**
 * Controller class responsible for handling incoming requests to the ingest endpoint. The IngestController class takes an IngestService as a dependency, which is used to process the API hit data. The ingestHit method receives the request, extracts the necessary data, and calls the ingestApiHit method of the IngestService. It also handles the response based on whether the ingestion was successful or if it was rejected by the circuit breaker. The controller ensures that clients receive appropriate feedback based on the outcome of their request.
 * @class IngestController
 * @constructor
 * @param {Object} dependencies - The dependencies required by the IngestController.
 * @param {IngestService} dependencies.ingestService - The ingest service instance for processing API hit data.
 * @throws {Error} - If the required ingestService dependency is not provided.
 */
export class IngestController {
    constructor({ ingestService }) {
        if (!ingestService) throw new Error("IngestController requires ingest service");
        this.ingestService = ingestService;
    };
}