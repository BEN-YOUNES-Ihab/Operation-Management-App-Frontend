import { Contractor } from './contractor.model'
 
export class Domain {
    _id: string;
    name: string;
    contractor: Contractor;
    expiration_date: any;
    price: number;
}