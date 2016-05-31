import {Injectable} from '@angular/core';

// TODO remove if unnecessary
/**
 * Profile service.
 */
@Injectable()
export default class ProfileService {

    // TODO remove if unnecessary
    //noinspection JSMethodCanBeStatic
    /**
     * Gets a username (currently only mocked/fake/static data).
     * @returns {Promise<string>}
     */
    getUsername() {
        return Promise.resolve('sample-user');
    }
}