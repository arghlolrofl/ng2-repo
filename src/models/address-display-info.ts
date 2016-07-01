import CountryInfo from "./country-info";
/**
 * AddressDisplayInfo model.
 */
export default class AddressDisplayInfo {

    Country:CountryInfo;

    FirstName:string;

    LastName:string;

    City:string;

    Company:string;

    IsValidated: boolean;

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

    AddressType:number;

    Id:number;
    
}