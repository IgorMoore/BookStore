export class Book{
    select:boolean;
    id: number;
    author: string;
    title: string;
    price: number;
    action : Action
    constructor() {}
}

export enum Action {
    add = 1,
    remove = 2,
    update = 3,
    none = 4
}