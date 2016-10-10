import IdentifiableObject from './base/identifiable-object';

export default class FileContentInfo extends IdentifiableObject {
    FileName: string;
    ContentType: number;
    DocumentType: number;
    IsCompressed: boolean;
    HasErrors: boolean;
    IsProcessed: boolean;
    CreationDate: Date;

    public static createClone(fci: FileContentInfo): FileContentInfo {
        let fciInfo = new FileContentInfo();
        fciInfo.CreationDate = fci.CreationDate;
        fciInfo.FileName = fci.FileName;
        fciInfo.Id = fci.Id;
        fciInfo.ContentType = fci.ContentType;
        fciInfo.DocumentType = fci.DocumentType;
        fciInfo.IsCompressed = fci.IsCompressed;
        fciInfo.HasErrors = fci.HasErrors;
        fciInfo.IsProcessed = fci.IsProcessed;
        return fciInfo;
    }
}