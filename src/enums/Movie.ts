export default class Movie {
    readonly name: string
    readonly category: string

    constructor(name: string, category: string){
        this.name = name
        this.category = category
    }
}