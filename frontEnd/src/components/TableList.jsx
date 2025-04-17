import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../utils/api'

export default function TableList({ connection, onTableSelect }) {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (connection) {
      fetchTables()
    }
  }, [connection])

  const fetchTables = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/clickhouse/tables')
      setTables(response.data)
    } catch (error) {
      toast.error('Failed to fetch tables: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Tables</h2>
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tables.map((table) => (
            <li key={table.name} className="py-3">
              <button
                onClick={() => onTableSelect(table.name)}
                className="w-full text-left hover:text-blue-600"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{table.name}</span>
                  <span className="text-sm text-gray-500">{table.engine}</span>
                </div>
                {table.partition_key && (
                  <div className="text-sm text-gray-500">Partition: {table.partition_key}</div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}