import {ErrorHandler, Injectable} from "@angular/core";
import NotificationService from "../services/notification-service";

@Injectable()
export default class CustomErrorHandler implements ErrorHandler {

    constructor(private notificationService: NotificationService) {
    }

    public handleError(error:any) : void {
        this.notificationService.sendError(error);
    }

}
