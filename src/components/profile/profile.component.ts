import {Component, EventEmitter, NgZone, Output} from '@angular/core';

import {MIN_PASSWORD_LENGTH} from '../../config';
import {AVAILABLE_CULTURES, AVAILABLE_CULTURE_DISPLAY_NAMES, defaultCulture} from '../../services/culture-service';
import ProfileService from '../../services/profile-service';
import UserClaim from '../../models/profile/user-claim';
import UserClaims from '../../models/profile/user-claims';
import UserClaimPreferredCulture from '../../models/profile/user-claim-preferred-culture';
import SetPassword from '../../models/profile/set-password';
import DropdownValue from '../../ui/key-value-pair';


/**
 * Profile component.
 */
@Component({
    selector: 'fp-profile',
    templateUrl: 'assets/templates/profile/profile.component.html',
    providers: [
        ProfileService
    ]
})
export default class ProfileComponent {
    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();
    @Output() notifyCulture: EventEmitter<string> = new EventEmitter<string>();

    private comboBoxItems: Array<DropdownValue<number, string>>;
    private selectedComboBoxItem: DropdownValue<number, string>;

    private roles: Array<UserClaim>;
    private preferredCulture: UserClaimPreferredCulture;
    private activeCulture: string;
    private originalCulture: string;
    private password: string;
    private passwordRepeated: string;
    private isInitialized = false;

    public get SelectedComboBoxItem(): DropdownValue<number, string> { return this.selectedComboBoxItem; }
    public set SelectedComboBoxItem(val: DropdownValue<number, string>) {
        if (val == null) {
            this.selectedComboBoxItem = null;
            this.activeCulture = this.originalCulture;
            return;
        }

        this.selectedComboBoxItem = this.comboBoxItems[val.Key - 1];
        this.activeCulture = AVAILABLE_CULTURES[AVAILABLE_CULTURE_DISPLAY_NAMES.indexOf(val.Value)];
        if (this.activeCulture !== this.originalCulture) {
            if (this.isInitialized) {
                this.setPreferredCulture();
                this.notifyCulture.emit(this.activeCulture);
            }
        }
    }

    public get SelectedOption(): number {
        if (this.comboBoxItems.length < 1) {
            return null;
        }

        if (this.SelectedComboBoxItem == null) {
            let index = this.activeCultureIndex();
            this.SelectedComboBoxItem = this.comboBoxItems[index];
        }

        return this.SelectedComboBoxItem.Key;
    }

    public set SelectedOption(val: number) {
        this.SelectedComboBoxItem = this.comboBoxItems[val - 1];
    }

    /**
     * @constructor
     * @param {ProfileService} profileService the profile client
     * @param {NgZone} zone a zone to run in.
     */
    constructor(private profileService: ProfileService, private zone: NgZone) {
        this.getUserClaims();

        this.comboBoxItems = new Array<DropdownValue<number, string>>();
        for (let i=0; i < AVAILABLE_CULTURE_DISPLAY_NAMES.length; i++)
        {
            this.comboBoxItems.push(new DropdownValue(i+1, AVAILABLE_CULTURE_DISPLAY_NAMES[i]));
        }
    }

    /**
     * Callback for button "set password".
     */
    public setPasswordClicked(): void {
        if (this.checkPassword()) {
            this.setPassword();
        }
    }

    /**
     * Answer the active culture's index in the culture combobox.
     * @returns {number}
     */
    private activeCultureIndex(): number
    {
        for (let i=0; i < AVAILABLE_CULTURES.length; i++) {
            if (AVAILABLE_CULTURES[i] === this.activeCulture) {
                return i;
            }
        }
        return 0;
    }

    /**
     * Set the selected combobox item (typically after preferred culture is known).
     */
    private setSelectedComboboxItem(): void {
        let index = this.activeCultureIndex();
        this.SelectedComboBoxItem = this.comboBoxItems[index];
    }

    /**
     * Get the user claims.
     */
    private getUserClaims(): void {
        this.profileService.getUserClaims().subscribe(
            (response: Array<UserClaim>) =>
                this.zone.run(() =>
                {
                    let claims: UserClaims = new UserClaims(response);
                    this.roles = claims.AllRoles;
                    //console.dir(this.roles);
                    this.preferredCulture = claims.PreferredCulture;
                    if (this.preferredCulture) {
                        this.activeCulture = this.preferredCulture.Culture;
                        this.originalCulture = this.activeCulture;
                        this.setSelectedComboboxItem();
                    }
                    else {
                        this.activeCulture = defaultCulture();
                    }
                    console.dir(this.activeCulture);
                    this.isInitialized = true;
                }),
            (error: Error) => this.onError.emit(error));
    }

    /**
     * Checks whether the user input for password and repeated password is valid.
     * @returns {boolean}
     */
    private checkPassword(): boolean {
        if (!this.password || !this.passwordRepeated) {
            return false;
        }

        if (this.password.length < MIN_PASSWORD_LENGTH) {
            return false;
        }

        return this.password === this.passwordRepeated;
    }

    /**
     * Call ProfileService to set the password.
     */
    private setPassword(): void {
        let pw: SetPassword = new SetPassword();
        pw.NewPassword = this.password;
        pw.ConfirmPassword = this.passwordRepeated;

        this.profileService.setPassword(pw);

        this.password = null;
        this.passwordRepeated = null;
    }

    /**
     * Call ProfileService to set the preferred culture.
     */
    private setPreferredCulture(): void {
        console.log('setPreferredCulture() called with activeCulture= ' + this.activeCulture + ' and isInitialized= ' + this.isInitialized);
        if (this.isInitialized && this.activeCulture !== this.originalCulture) {
            this.profileService.setPreferredCulture(this.activeCulture);
        }
    }

}