import {Injectable, EventEmitter, Output} from "@angular/core";
import NotfificationMessage from "../models/notification-message"
import ErrorUtils from "../utils/error-utils"

@Injectable()
export default class NotificationService {

    @Output() onNotification : EventEmitter<NotfificationMessage> = new EventEmitter<NotfificationMessage>();

    public sendError(error:any) : void {
        console.log(error);

        let realError = ErrorUtils.toError(error);
        let message = new NotfificationMessage(realError.message);
        this.onNotification.emit(message);
    }

    public sendMessage(message:string) : void {
        this.onNotification.emit(new NotfificationMessage(message));
    }
}
