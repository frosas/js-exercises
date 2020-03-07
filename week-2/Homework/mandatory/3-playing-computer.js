/*
  You have to predict the output of this program WITHOUT EXECUTING IT.

  In order to do this, try writing down the value that all variables take
  during each step of the program execution.

  Answer the following questions:

  1. This program throws an error. Why? (If you can't find it, try executing it).

     Variable b is not defined

  2. Remove the line that throws the error.
  3. What is printed to the console?

     x == 2
     a == 6
     print 2
     print 6
     i == 0
     a == 7
     d == 0 + 2 + 2 == 4
     print 4
     i == 1
     a == 8
     e == 1 + 8 == 9
     print 9
     i == 2
     a == 9
     d == 2 + 2 + 2 == 6
     print 6
     i == 3
     a == 10
     e == 3 + 10 == 13
     print 13
     i == 4
     a == 11
     d == 4 + 2 + 2 == 8
     print 8
     i == 5

  4. How many times is "f1" called?

     3

  5. How many times is "f2" called?

     2

  6. What value does the "a" parameter take in the first "f1" call?

     8

  7. What is the value of the "a" outer variable when "f1" is called for the first time?

     6
*/

let x = 2;
let a = 6;

const f1 = function(a, b) {
  return a + b;
};

const f2 = function(a, b) {
  return a + b + x;
};

console.log(x);
console.log(a);
console.log(b);

for (let i = 0; i < 5; ++i) {
  a = a + 1;
  if (i % 2 === 0) {
    const d = f2(i, x);
    console.log(d);
  } else {
    const e = f1(i, a);
    console.log(e);
  }
}
