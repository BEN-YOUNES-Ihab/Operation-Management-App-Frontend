import { Category } from './category.model'

export class Event {
    _id: string;
    title: string;
    date: string;
    description: string;
    type: string;
    category: Category;
    value: number;
}
