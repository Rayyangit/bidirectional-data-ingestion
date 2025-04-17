function ProgressBar({ progress }) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <div className="progress-text">{progress}%</div>
    </div>
  )
}

export default ProgressBar