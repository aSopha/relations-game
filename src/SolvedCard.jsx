const SolvedCard = ({category, words}) => {
  
  return <div className={'solved-card noselect'}>
    <div className="category">{category}</div>
    <div className="solved-words">
      {words.map((word) => <div className="word">{word}</div>)}
    </div>
  </div>
}

export default SolvedCard