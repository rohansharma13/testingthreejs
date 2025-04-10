export function splitTextToSpans(text, type = 'word') {
  const items = type === 'letter' ? text.split('') : text.split(' ')
  return items.map((item, index) => (
    <span
      key={index}
      className="inline-block overflow-hidden"
      style={{ marginRight: type === 'word' ? '0.25em' : '0' }}
    >
      <span className="inline-block word">{item}</span>
    </span>
  ))
}
