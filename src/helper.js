export const shuffle = (array) => {
  const shuffledWords = [...array];
  for (var i = shuffledWords.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffledWords[i];
    shuffledWords[i] = shuffledWords[j];
    shuffledWords[j] = temp;
  }
  return shuffledWords;
};