var title = ["Date", "Number", "Size", "Location", "Age"];
var urls = ['foo', 'bar', 'baz', "Location", "Location"];

 let test = title.reduce((result, title, index) => {
    result[index] = title;
    return result;
  }, {});

console.log(test)

var keys = ['foo', 'bar', 'baz'];
var values = [11, 22, 33]

var result = {};
keys.forEach((key, i) => result[key] = values[i]);
console.log(result);
