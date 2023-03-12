import pgPromise from "pg-promise";

interface Connection {
    query(statement: string, params: any): Promise<any>;
    close(): Promise<void>;
}

class PostgreSQLConnection implements Connection {
    pgPromise: any;
    constructor(){
        this.pgPromise = pgPromise()("postgres://postgres:123456@localhost:5432/app"); 
    }

    query(statement: string, params: any): Promise<any> {
        return this.pgPromise.query(statement, params)
    }

    close(): Promise<void> {
        throw new Error("Method not implemented.")
    }
}

class ORM {
    constructor(readonly connection: Connection){
    }
    async save(entity: Entity){
        const params: any = [];
        this.connection.query(`insert into ${entity.schema}.${entity.table}...`, params);
    }
}

class Entity {
    declare schema: string;
    declare table: string;
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