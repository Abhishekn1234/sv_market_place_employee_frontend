export interface ServiceCategory{
    _id:string;
    name:string;
    slug:string;
    iconUrl:string| File;
    icon?:string|File;
    createdAt:Date;
    updatedAt:Date;
}