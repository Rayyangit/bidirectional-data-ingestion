import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ColumnSelector from '../components/ColumnSelector'
import api from '../utils/api'

export default function IngestionPage() {
  const [tables, setTables] = useState([])
  const [selectedTable, setSelectedTable] = useState('')
  const [loadingTables, setLoadingTables] = useState(false)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      setLoadingTables(true)
      const response = await api.get('/tables')
      setTables(response.data.map(t => t.name))
    } catch (error) {
      toast.error('Failed to load tables')
    } finally {
      setLoadingTables(false)
    }
  }

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ClickHouse Data Ingestion</h1>

      {/* Table Selector */}
      <div className="mb-6">
        <label htmlFor="tableSelect" className="block text-sm font-medium text-gray-700 mb-1">
          Select Main Table
        </label>
        <select
          id="tableSelect"
          value={selectedTable}
          onChange={handleTableChange}
          className="w-full max-w-sm border-gray-300 rounded-md shadow-sm"
        >
          <option value="">-- Select a Table --</option>
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {/* Column Selector */}
      {selectedTable && (
        <ColumnSelector connection={null} table={selectedTable} />
      )}
    </div>
  )
}
