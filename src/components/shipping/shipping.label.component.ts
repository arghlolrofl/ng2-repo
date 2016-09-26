import {Component} from "@angular/core";
import * as _ from 'lodash';
import {DomSanitizer} from "@angular/platform-browser";

import { Router, ActivatedRoute, Params } from '@angular/router';
import ShippingService from "../../services/shipping.service";
import Base64ConentInfo from "../../models/base64-content-info";

@Component({
    selector: "fp-label",
    templateUrl: "assets/templates/shipping/shipping.label.component.html",
    providers: [ ShippingService]
})


/**
 *  Shipping label component
 */
export default class ShippingLabelComponent {
    /**
     * Error if there is one.
     */
    error: Error;

    /**
     * properties
     */
    content: any;

    constructor(private shippingService: ShippingService,  
                private sanitizer: DomSanitizer,
                private route: ActivatedRoute,    
                private router: Router) {               
    }  

ngOnInit() {
    this.route.params.forEach((params: Params) => {
        let id = +params['id'];
            this.shippingService.getLabel(id).subscribe(
                (result: Base64ConentInfo) => {
                    console.log("success");
                    this.content = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + result.Content);
                },
                (error: Error) => {
                    console.log("failed");
                }
            )    
     });
  }  
}
