import pgPromise, { Column } from "pg-promise";

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
        const columns = entity.columns.map(column => column.column).join(",")
        const params = entity.columns.map((column, index)=> `$${index + 1}`).join(",");
        const values = entity.columns.map(column => entity[column.property]);
        const statement = `insert into ${entity.schema}.${entity.table} (${columns}) values (${params})`;
        this.connection.query(statement, [...values]);
    }
}

class Entity {
    declare schema: string;
    declare table: string;
    declare columns : {property: string, column : string}[];
    [key: string]: any;
}

function entity(config: {schema: string, table: string}){
    return (constructor: Function) => {
        constructor.prototype.schema = config.schema;
        constructor.prototype.table = config.table;
    }
}

function column(config: {name: string}){
    return (target: Entity, propertyKey: string) => {
        target.columns = target.columns || [];
        target.columns.push({property: propertyKey, column: config.name});
    }
}


@entity({schema: "branas", table: "book"})
class Book extends Entity {
    @column({name: "title"})
    title: string;
    @column({name: "author"})
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