
function checkAnswer(answer) {
  let result;
  if (answer === 'It is certain.') {
    result = 1;
  } else if (answer === 'It is decidedly so.') {
    result = 1;
  }

  if (result == 1) {
    return 'Very positive';
  }
}
