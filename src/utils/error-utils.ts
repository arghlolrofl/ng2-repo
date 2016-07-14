/**
 * Error utilities.
 */
export default class ErrorUtils {

    /**
     * Generate error from undefined error type.
     */
    static toError(error: any): Error {
        if (error._body) {
            try {
                const body = JSON.parse(error._body);
                if (body.Message) {
                    return new Error(body.Message);
                }
            } catch (e) {
                // ignore
            }
            return new Error(error._body);
        }
        return error;
    }
}