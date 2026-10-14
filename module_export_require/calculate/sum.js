//modules protects their variables and function to leak
console.log("This is Sum module")
var x = "Hello Sum Module"
function calculateSum(a,b) {
    const sum = a+b;
    console.log(sum);
}
console.log(module.exports)
module.exports = {x, calculateSum}
console.log(module.exports)