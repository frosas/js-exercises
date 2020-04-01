/*
Task 1
=======
Write JavaScript below that logs:
    1. all the "p" element nodes of the document,
    --> should log a list of nodes with a length of 6

    2. the first div element node
    --> should log the ".site-header" node

    3. the element with id "jumbotron-text"
    --> should log the "#jumbotron-text" node

    4. all the "p" elements of contained inside  the .primary-content element node
    --> should log a list of nodes with a length of 3

*/

// 1
console.log(document.querySelectorAll("p"));

// 2
console.log(document.querySelector("div"));

// 3
console.log(document.querySelector("#jumbotron-text"));

// 4
console.log(document.querySelector(".primary-content p"));

/*
Task 2
======

When a user clicks the 'ALERT' button, an alert box should pop up with the text "Thanks for visiting Bikes for Refugees!"
*/

document
  .querySelector("#alertBtn")
  .addEventListener("click", () =>
    alert("Thanks for visiting Bikes for Refugees!")
  );

/*
Task 3
=======

Write JavaScript below that changes the background colour of the page when the 'Change colour' button is clicked.
*/

const getRandomPrimaryColor = () =>
  Math.floor(Math.random() * 256).toString(16);

const getRandomColor = () =>
  `#${getRandomPrimaryColor()}${getRandomPrimaryColor()}${getRandomPrimaryColor()}`;

document
  .querySelector("#bgrChangeBtn")
  .addEventListener(
    "click",
    () => (document.body.style.backgroundColor = getRandomColor())
  );

/*
Task 4
======

When a user clicks the 'Add some text' button, a new paragraph should be added below the buttons that says "Read more below."
*/

document.querySelector("#addTextBtn").addEventListener("click", () => {
  const buttonsEl = document.querySelector(".buttons");
  const pEl = document.createElement("p");
  pEl.textContent = "Read more below. ";
  buttonsEl.parentNode.insertBefore(pEl, buttonsEl.nextSibling);
});

/*
Task 5
======

When the 'Larger links!' button is clicked, the text of all links on the page should increase.
*/

document.querySelector("#largerLinksBtn").addEventListener("click", () => {
  document.querySelectorAll("a").forEach((aEl) => {
    aEl.style.fontSize = `${parseFloat(aEl.style.fontSize) + 0.1}em`;
  });
});
