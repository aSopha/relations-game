const WordBlock = ({word, selected, selectWord}) => {
  const styling = selected ? 'word-block-selected' : 'word-block'
  
  return <div className={styling + ' noselect'} onClick={()=> selectWord(word)}>
    {word}
  </div>
}

export default WordBlock