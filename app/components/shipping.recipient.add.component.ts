import {Component, ViewChild, EventEmitter, Input, OnInit} from '@angular/core';
import {ControlGroup, FormBuilder} from "@angular/common";
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'fp-shipping-recipient-add',
    templateUrl: 'app/templates/shipping.recipient.add.component.html',
    directives: [
        MODAL_DIRECTIVES
    ],
    pipes: [
        TranslatePipe
    ]
})

/**
 * Shipping Sender component.
 */
export default class ShippingRecipientAddComponent implements OnInit {

    @Input()
    public showChange:EventEmitter<boolean>;

    /**
     * Modal dialog for sender
     */
    @ViewChild('modalAddRecipient')
    private modal:ModalComponent;

    /**
     * Add formula.
     */
    private addForm:ControlGroup;

    /**
     * @constructor
     * @param {FormBuilder} formBuilder the angular2 form builder
     */
    constructor(private formBuilder:FormBuilder) {
        this.addForm = formBuilder.group();
    }

    /**
     * Initialize the change events.
     */
    public ngOnInit() {
        this.showChange.subscribe((show) => {
            if (show) {
                this.modal.open();
            } else {
                this.modal.close();
            }
        });
    }

    /**
     * Add sender.
     */
    public save() {
        console.log('save recipient');
    }
}
