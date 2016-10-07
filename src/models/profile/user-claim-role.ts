import UserClaim from './user-claim';

/**
 * User claim role.
 */
export default class UserClaimRole extends UserClaim {
    public get RoleName() {
        return this.ClaimValue;
    }
}
