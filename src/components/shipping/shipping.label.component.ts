import {Component} from "@angular/core";
import * as fileSaver from 'file-saver'
import {DomSanitizer} from "@angular/platform-browser";

import {ActivatedRoute, Params} from '@angular/router';
import ShippingService from "../../services/shipping.service";
import Base64ContentInfo from "../../models/base64-content-info";

@Component({
    selector: "fp-label",
    templateUrl: "assets/templates/shipping/shipping.label.component.html",
    providers: [ShippingService]
})


/**
 *  Shipping label component
 */
export default class ShippingLabelComponent {
    /**
     * properties
     */
    src: any;
    content: string;
    shipmentId: number;

    constructor(private shippingService: ShippingService,
                private sanitizer: DomSanitizer,
                private route: ActivatedRoute ) {
    }

    public download() {
        let binary = atob(this.content)
        let blob = new Blob([binary], {type: 'application/pdf'});
        let nameParts = ["shipment_label_", this.shipmentId, ".pdf"];
        let name = nameParts.join('');
        fileSaver.saveAs(blob, name);
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.shipmentId = +params['id'];
            this.shippingService.getLabel(this.shipmentId).subscribe(
                (result: Base64ContentInfo) => {
                    this.content = result.Content;
                    this.src = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + this.content);
                }
            )
        });
    }
}
