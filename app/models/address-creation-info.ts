import {EAddressType} from "./eaddress-type";

/**
 * AddressCreationInfo model.
 */
export default class AddressCreationInfo {

    CountryId:number;

    FirstName:string;

    LastName:string;

    City:string;

    Company:string;

    IsValidated:boolean;

    Title:string;

    MiddleName:string;

    Region:string;

    RegionAbbreviation:string;

    PostalAddress:string;

    AdditionalPostalAddress:string;

    ZipCode:string;

    AdditionalZipCode:string;

    ValidationHash:string;

    EMailAddress:string;

    PhoneNumber:string;

    MobilePhoneNumber:string;

    FaxNumber:string;

    AdditionalInformation:string;

    IsPostOfficeBox:boolean;

    AddressType:EAddressType = EAddressType.ApplicationAddress;

    AddressGroupId:number;

    Id:number;
}