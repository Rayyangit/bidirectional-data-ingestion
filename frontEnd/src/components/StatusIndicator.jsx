function StatusIndicator({ status }) {
  if (!status.message) return null

  const statusClasses = {
    idle: 'status-idle',
    loading: 'status-loading',
    success: 'status-success',
    error: 'status-error'
  }

  return (
    <div className={`status-indicator ${statusClasses[status.type] || ''}`}>
      {status.type === 'loading' && (
        <div className="spinner"></div>
      )}
      {status.message}
    </div>
  )
}

export default StatusIndicator