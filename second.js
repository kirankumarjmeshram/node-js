const fromThird = require("./third");

function one(){
    console.log("one of two function");

}

function two(){
    console.log(fromThird())
}

module.exports = {one,two};