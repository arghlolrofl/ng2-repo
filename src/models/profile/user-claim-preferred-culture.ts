import UserClaim from './user-claim';

/**
 * User claim preferred culture.
 */
export default class UserClaimPreferredCulture extends UserClaim {

    /**
     * Answer representation for ui.
     */
    public get Culture() {
        return this.ClaimValue;
    }
}
