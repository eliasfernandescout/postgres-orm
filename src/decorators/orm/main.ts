import pgPromise from "pg-promise";

interface Connection {
    query(statement: string, params: any): Promise<any>;
    close(): Promise<void>;
}

class PostgreSQLConnection implements Connection {
    pgPromise: any;
    constructor(){
        this.pgPromise = pgPromise()("postgres://postgres:postgres@127.0.0.1:5432/app"); 
    }

    query(statement: string, params: any): Promise<any> {
        return this.pgPromise.query(statement, params)
    }

    close(): Promise<void> {
        return this.pgPromise.$pool.end();
    }
}

class ORM {
    constructor(readonly connection: Connection){
    }
    async save(entity: Entity){
        // const params: any = [];
        // this.connection.query(`insert into ${entity.schema}.${entity.table}...`, params);
        this.connection.query("insert into branas.book (title, author) values ($1, $2)", ["Harry Potter", "Sophie Alguem"]);
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

async function init () {
    const connection = new PostgreSQLConnection();
    const orm = new ORM(connection);
    const book = new Book("Clean Code", "Robert Martin");
    await orm.save(book);    
    await connection.close();
}

init();