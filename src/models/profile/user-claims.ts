import UserClaim from './user-claim';
import UserClaimRole from './user-claim-role';
import UserClaimPreferredCulture from './user-claim-preferred-culture';

/**
 * Collection of UserClaim objects.
 */
export default class UserClaims {
    private static claimTypePreferredCulture: string = "PreferredCulture";
    private static claimTypeRole: string = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

    private userClaims: UserClaim[];

    /**
     * Constructor
     * @param arr
     */

    constructor(arr: UserClaim[]) {
        this.userClaims = new Array();
        for (let claim of arr) {
            if (claim.ClaimType.localeCompare(UserClaims.claimTypePreferredCulture) === 0) {
                this.addUserClaim(new UserClaimPreferredCulture(claim.ClaimType, claim.ClaimValue));
            }
            else if (claim.ClaimType.localeCompare(UserClaims.claimTypeRole) === 0) {
                this.addUserClaim(new UserClaimRole(claim.ClaimType, claim.ClaimValue));
            }
            else {
                this.addUserClaim(new UserClaim(claim.ClaimType, claim.ClaimValue));
            }
        }
    }

    /**
     * Add a user claim to my collection.
     * @param userClaim
     */
    private addUserClaim(userClaim: UserClaim): void {
        this.userClaims.push(userClaim);
    }

    /**
     *  Answer an Array of all roles.
     * @returns {UserClaim[]}
     */
    public get AllRoles() {
        return this.userClaims.filter(claim => claim.IsRole);
    }

    /**
     * Answer the preferred culture.
     * @returns {UserClaimPreferredCulture}
     */
    public get PreferredCulture(): UserClaimPreferredCulture {
        let cultures: UserClaim[] = this.userClaims.filter(claim => claim.IsPreferredCulture);

        if (cultures.length >= 1) {
            return <UserClaimPreferredCulture>cultures[0];
        }
        else {
            return null;
        }
    }

}