import {Input} from "@angular/core"

export default class NotificationMessage {
    @Input() message: string;

    constructor(message:string) {
        this.message = message;
    }

}
