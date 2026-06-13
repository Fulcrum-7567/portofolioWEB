export default function Marquee() {
  const content =
    'BUSINESS THINKER \u00B7 PROBLEM SOLVER \u00B7 COMPETITOR \u00B7 BUILDER \u00B7 GENERALIST \u00B7 GETS THINGS DONE \u00B7 EXPERIENCE OUTRANKS EVERYTHING \u00B7 '

  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        <span className="marquee-content">{content}</span>
        <span className="marquee-content">{content}</span>
      </div>
    </div>
  )
}
