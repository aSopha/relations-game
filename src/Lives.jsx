const Lives = ({remaining, max}) => {

const dots = []

for (let i = 0; i < remaining; i++) {
  dots.push(<span class="dot-full"></span>)
}
for (let i = dots.length; i < max; i++) {
  dots.push(<span class="dot-empty"></span>)
}
  
  return <div className={'lives noselect'}>
    {dots}
  </div>
}

export default Lives