import { Categories } from "./enums/Categories";
import Movie from "./enums/Movie";

console.log(Categories.PROGRAMMING)
console.log(Categories.SCIENCE)
console.log(Categories.ENTERTAINMENT)

const movie = new Movie("Interestelar", Categories.SCIENCE)
console.log(movie)