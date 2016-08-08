/**
 * Error utilities.
 */
export default class ErrorUtils {

    /**
     * Generate error from undefined error type.
     * @returns {Error|null} the error or null
     */
    static toError(error: any): Error {
        if (error.name === 'EmptyError') {
            return null;
        }
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