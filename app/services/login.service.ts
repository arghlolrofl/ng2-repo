import {Injectable, EventEmitter} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';

/**
 * Login service.
 */
@Injectable()
export default class LoginService {

    /**
     * Events for login status change.
     * @type {EventEmitter}
     */
    public loginChange: EventEmitter<any> = new EventEmitter();

    /**
     * Bearer token to be send in requests.
     * @type {string}
     */
    private token: string = null;

    /**
     * @constructor
     * @param cookieService Cookie service to store token information long time
     */
    constructor(private cookieService: CookieService) {
        this.token = this.cookieService.get('token');

        // TODO remove sample code
        setTimeout(() => {
            this.token = 'zsug2daXt9ysjlhVAx9ncg41eekZ_NvNyxbo8JMbMh5f8gns3A9a7S8wKhI56WtisDTBx8Nw19EB0CLahySV98l2RkUV6xR_x4e2nSSfSyApsNfdE7DiOowZW6cXf4IkiNGnPnnY5AgeTg4y10Yr8AWSMAaKF9DS-s09l9tIkomFZzelCSRSRWzKF_nksVh-BRxwjINtW-U7rNYyM_l4hr9CmexylIXOwykPqUjrcpX5-kD4EPMj_pEtG3lSUls81afJoemlJ1NxEx42m9o7GfG-BOCESocI7E-puG1wKZmJ_Uq06bMmelGHgVxK3YZmRI4wtq-qMLkmacYi5FfftL6L7yU8sjjLb4dxCxVmd46e6P_Wp9CcbKFw4tEEuiMybD9KjdMKyc45yNGXYA6vAIU2dh5sLl8ZV7AZTx2Bsl9H0uln_L6poPXY7rSnOydn40qcknC2MRSpOLXdaH5PZ3BPRDNyMWne5Wo30eoo1asBB7NGqNy7vHbUtiGyoZ1oPtPMK-cvLH8_bL5cWJm6Ymod-aWCLDEY8uHRizOxtuHQAS_xjpwEPacKWQpDLhqf';
            this.cookieService.put('token', this.token);
            this.loginChange.emit({
                loggedIn: true,
                token: this.token
            });
        }, 10000);
    }

    /**
     * Returns true if user is logged in and API requests can be done.
     * @returns {boolean}
     */
    public isLoggedIn():boolean {
        return !!this.token;
    }

    /**
     * The API said the user have been logged out.
     */
    public loggedOut() {
        this.token = null;
        this.cookieService.remove('token');
        this.loginChange.emit({
            loggedIn: false,
            token: this.token
        });
    }

    /**
     * Get the bearer token back.
     * @returns {string}
     */
    public getToken():string {
        return this.token;
    }
}