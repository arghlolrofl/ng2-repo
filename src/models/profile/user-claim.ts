/**
 * User claim.
 */
export default class UserClaim {

    private static claimTypePreferredCulture: string = "PreferredCulture";
    private static claimTypeRole:             string = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

    public ClaimType: string;
    public ClaimValue: string;

    /**
     * Constructor
     *
     * @param claimType
     * @param claimValue
     */
    constructor(claimType: string, claimValue: string) {
        this.ClaimType = claimType;
        this.ClaimValue = claimValue;
    }

     /**
     * Answer whether I am representing a preferred culture.
     */
    public get IsPreferredCulture(): boolean {
        return this.ClaimType.localeCompare(UserClaim.claimTypePreferredCulture) == 0;;
    }


    /**
     * Answer whether I am representing a role.
     */
    public get IsRole(): boolean {
        return this.ClaimType.localeCompare(UserClaim.claimTypeRole) == 0;;
    }
}

