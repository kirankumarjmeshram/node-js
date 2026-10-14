console.log("Sum Module Executed");

// export var x = "Hello World";

// export function Sum(a, b) {
//     console.log(a+b);
// }
var x = "Hello World";

function Sum(a, b) {
    console.log(a+b);
}
// to export private variable we need to explicitly export
// module.exports  = {
//     x:x,
//     calculateSum:Sum
// }
//also can export like
// module.exports = {
//     x,
//     Sum
// }
module.exports.x = x;
module.exports.Sum = Sum;