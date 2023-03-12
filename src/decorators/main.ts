import { OrganizeImportsMode } from "typescript";


interface Connection {
    query(statement: string, params: any): Promise<any>;
    close(): Promise<void>;
}
class ORM{
    async save(entity: Entity){

    }

}

class Entity{


}

class Book extends Entity {
    title: string;
    author: string

    constructor(title: string, author: string){
        super();
        this.title = title;
        this.author = author;
    }
}

async function init() {
    const book = new Book("Clean Code", "Robert Martin");
    const orm = new ORM();
    await orm.save(book);    
}