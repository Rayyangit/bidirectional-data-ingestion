import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ColumnSelector from '../components/ColumnSelector'
import ConnectionForm from '../components/ConnectionForm'
import FileUpload from '../components/FileUpload'
import PreviewData from '../components/PreviewData'
import ProgressBar from '../components/ProgressBar'
import StatusIndicator from '../components/StatusIndicator'

function IngestionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const direction = queryParams.get('direction')

  const [step, setStep] = useState(1)
  const [connectionInfo, setConnectionInfo] = useState({
    host: '',
    port: '',
    database: '',
    user: '',
    jwtToken: '',
    file: null,
    delimiter: ','
  })
  const [tables, setTables] = useState([])
  const [selectedTable, setSelectedTable] = useState('')
  const [columns, setColumns] = useState([])
  const [selectedColumns, setSelectedColumns] = useState([])
  const [previewData, setPreviewData] = useState([])
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [progress, setProgress] = useState(0)
  const [recordCount, setRecordCount] = useState(0)
  const [joinConditions, setJoinConditions] = useState([])
  const [selectedTablesForJoin, setSelectedTablesForJoin] = useState([])

  const isClickHouseToFile = direction === 'clickhouse-to-file'

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleStartIngestion = async () => {
    setStatus({ type: 'loading', message: 'Starting data ingestion...' })
    setProgress(0)
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setStatus({ type: 'success', message: 'Ingestion completed successfully!' })
      setRecordCount(12345) // Mock count
    }, 3000)
  }

  const handleConnect = async () => {
    setStatus({ type: 'loading', message: 'Connecting to ClickHouse...' })
    
    // Simulate API call
    setTimeout(() => {
      setStatus({ type: 'success', message: 'Connected successfully!' })
      setTables(['uk_price_paid', 'ontime', 'sample_table']) // Mock tables
      handleNext()
    }, 1500)
  }

  const handleLoadColumns = async () => {
    setStatus({ type: 'loading', message: 'Loading columns...' })
    
    // Simulate API call
    setTimeout(() => {
      const mockColumns = isClickHouseToFile 
        ? ['id', 'price', 'date', 'postcode', 'property_type']
        : ['column1', 'column2', 'column3', 'column4']
      
      setColumns(mockColumns)
      setSelectedColumns(mockColumns)
      setStatus({ type: 'success', message: 'Columns loaded successfully!' })
      handleNext()
    }, 1500)
  }

  const handlePreview = async () => {
    setStatus({ type: 'loading', message: 'Loading preview data...' })
    
    // Simulate API call
    setTimeout(() => {
      const mockData = Array(10).fill(0).map((_, i) => {
        const obj = {}
        selectedColumns.forEach(col => {
          obj[col] = `Sample ${col} ${i + 1}`
        })
        return obj
      })
      
      setPreviewData(mockData)
      setStatus({ type: 'success', message: 'Preview data loaded!' })
      handleNext()
    }, 1500)
  }

  const handleAddJoinCondition = () => {
    setJoinConditions([...joinConditions, { leftTable: '', rightTable: '', leftColumn: '', rightColumn: '' }])
  }

  const handleJoinConditionChange = (index, field, value) => {
    const updatedConditions = [...joinConditions]
    updatedConditions[index][field] = value
    setJoinConditions(updatedConditions)
  }

  return (
    <div className="ingestion-container">
      <h2>{isClickHouseToFile ? 'ClickHouse to Flat File' : 'Flat File to ClickHouse'}</h2>
      
      <div className="stepper">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. {isClickHouseToFile ? 'ClickHouse Connection' : 'File Upload'}</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Select {isClickHouseToFile ? 'Table' : 'File'} & Columns</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Preview Data</div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Start Ingestion</div>
      </div>

      <StatusIndicator status={status} />

      {step === 1 && (
        <div className="step-content">
          {isClickHouseToFile ? (
            <ConnectionForm 
              connectionInfo={connectionInfo}
              setConnectionInfo={setConnectionInfo}
              onConnect={handleConnect}
            />
          ) : (
            <FileUpload 
              connectionInfo={connectionInfo}
              setConnectionInfo={setConnectionInfo}
              onNext={handleNext}
            />
          )}
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <ColumnSelector 
            isClickHouseToFile={isClickHouseToFile}
            tables={tables}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            columns={columns}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            onLoadColumns={handleLoadColumns}
            showJoin={isClickHouseToFile && tables.length > 0}
            joinConditions={joinConditions}
            selectedTablesForJoin={selectedTablesForJoin}
            setSelectedTablesForJoin={setSelectedTablesForJoin}
            onAddJoinCondition={handleAddJoinCondition}
            onJoinConditionChange={handleJoinConditionChange}
          />
        </div>
      )}

      {step === 3 && (
        <div className="step-content">
          <PreviewData 
            data={previewData} 
            columns={selectedColumns} 
            onPreview={handlePreview}
          />
        </div>
      )}

      {step === 4 && (
        <div className="step-content">
          <div className="ingestion-summary">
            <h3>Ingestion Summary</h3>
            <p><strong>Direction:</strong> {isClickHouseToFile ? 'ClickHouse to Flat File' : 'Flat File to ClickHouse'}</p>
            {isClickHouseToFile && (
              <>
                <p><strong>Table:</strong> {selectedTable || 'N/A'}</p>
                {selectedTablesForJoin.length > 0 && (
                  <p><strong>Joined Tables:</strong> {selectedTablesForJoin.join(', ')}</p>
                )}
              </>
            )}
            <p><strong>Selected Columns:</strong> {selectedColumns.join(', ')}</p>
          </div>

          <ProgressBar progress={progress} />

          <div className="action-buttons">
            <button onClick={handleBack} className="secondary-btn">Back</button>
            <button onClick={handleStartIngestion} className="primary-btn">
              Start Ingestion
            </button>
          </div>
        </div>
      )}

      {status.type === 'success' && recordCount > 0 && (
        <div className="result-container">
          <h3>Ingestion Results</h3>
          <p>Total records processed: <strong>{recordCount.toLocaleString()}</strong></p>
        </div>
      )}

      <button onClick={() => navigate('/')} className="back-home-btn">
        ← Back to Home
      </button>
    </div>
  )
}

export default IngestionPage