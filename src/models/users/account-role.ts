import IdentifiableObject from '../base/identifiable-object';

export default class AccountRole extends IdentifiableObject {
    RoleName: string;

    public static createClone(role: AccountRole): AccountRole {
        let clonedRole = new AccountRole();
        clonedRole.Id = role.Id;
        clonedRole.RoleName = role.RoleName;

        return clonedRole;
    }
}