
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
export default function ColumnSelector({ connection, table, onAction }) {
  const [columns, setColumns] = useState([])
  const [selectedColumns, setSelectedColumns] = useState([])
  const [loading, setLoading] = useState(false)
  const [joinTables, setJoinTables] = useState([])
  const [availableTables, setAvailableTables] = useState([])
  const [joinConditions, setJoinConditions] = useState({})
  const [joinTypes, setJoinTypes] = useState({})
  const [previewData, setPreviewData] = useState([])

  const navigate = useNavigate();
  useEffect(() => {
    fetchColumns()
    fetchTablesList()
  }, [table, joinTables, joinConditions])

  const fetchTablesList = async () => {
    try {
      const response = await api.get('/api/clickhouse/tables') // ✅ updated
      setAvailableTables(response.data.map(t => t.name))
    } catch (err) {
      toast.error('Failed to fetch table list')
    }
  }
  const handleImportClick = async () => {
    if (selectedColumns.length === 0) {
      toast.error('Please select at least one column');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare the export request
      const response = await api.get('/api/clickhouse/export', {
        params: {
          table,
          columns: selectedColumns.join(','),
          joinTables: joinTables.filter(t => t).join(','),
          joinConditions: JSON.stringify(joinConditions),
          joinTypes: JSON.stringify(joinTypes)
        },
        responseType: 'blob' // Important for file downloads
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${table}_export_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('CSV export started successfully');
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchColumns = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/clickhouse/columns', {
        params: {
          table,
          joinTables: joinTables.length > 0 ? joinTables : undefined,
          joinConditions: Object.keys(joinConditions).length > 0 ? joinConditions : undefined
        }
      })
      setColumns(response.data)
    } catch (error) {
      toast.error('Failed to fetch columns: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleColumnToggle = (columnName) => {
    setSelectedColumns(prev =>
      prev.includes(columnName)
        ? prev.filter(c => c !== columnName)
        : [...prev, columnName]
    )
  }

  const handleAddJoinTable = () => {
    setJoinTables([...joinTables, ''])
    setJoinConditions({ ...joinConditions, '': '' })
    setJoinTypes({ ...joinTypes, '': 'JOIN' })
  }

  const handleJoinTableChange = (index, value) => {
    const newJoinTables = [...joinTables]
    newJoinTables[index] = value
    setJoinTables(newJoinTables)
  }

  const handleJoinConditionChange = (index, value) => {
    const tableName = joinTables[index]
    if (tableName) {
      setJoinConditions({ ...joinConditions, [tableName]: value })
    }
  }

  const handleJoinTypeChange = (index, value) => {
    const tableName = joinTables[index]
    if (tableName) {
      setJoinTypes({ ...joinTypes, [tableName]: value })
    }
  }

  const handleRemoveJoin = (index) => {
    const tableName = joinTables[index]
    const newJoinTables = joinTables.filter((_, i) => i !== index)
    const newJoinConditions = { ...joinConditions }
    const newJoinTypes = { ...joinTypes }

    if (tableName) {
      delete newJoinConditions[tableName]
      delete newJoinTypes[tableName]
    }

    setJoinTables(newJoinTables)
    setJoinConditions(newJoinConditions)
    setJoinTypes(newJoinTypes)
  }

  const handlePreviewData = async () => {
    try {
      const response = await api.post('/api/clickhouse/preview', {
        table,
        columns: selectedColumns,
        joinTables,
        joinConditions,
        joinTypes
      })
      setPreviewData(response.data)
    } catch (err) {
      toast.error('Preview failed: ' + err.message)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Columns from {table}</h2>

      {/* JOIN TABLES SECTION */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Join Tables</h3>
        {joinTables.map((joinTable, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-3">
              <select
                value={joinTable}
                onChange={(e) => handleJoinTableChange(index, e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select table</option>
                {availableTables.filter(t => t !== table).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-span-3">
              <select
                value={joinTypes[joinTable] || 'JOIN'}
                onChange={(e) => handleJoinTypeChange(index, e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="JOIN">INNER JOIN</option>
                <option value="LEFT JOIN">LEFT JOIN</option>
                <option value="RIGHT JOIN">RIGHT JOIN</option>
              </select>
            </div>
            <div className="col-span-5">
              <input
                type="text"
                placeholder="e.g., main.id = other.id"
                value={joinConditions[joinTable] || ''}
                onChange={(e) => handleJoinConditionChange(index, e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div className="col-span-1">
              <button
                type="button"
                onClick={() => handleRemoveJoin(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddJoinTable}
          className="mt-2 px-3 py-1 bg-gray-700 text-white text-sm rounded"
        >
          Add Join Table
        </button>
      </div>

      {/* COLUMNS CHECKBOX */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {columns.map((column) => (
            <div key={column.name} className="flex items-center">
              <input
                id={`column-${column.name}`}
                type="checkbox"
                checked={selectedColumns.includes(column.name)}
                onChange={() => handleColumnToggle(column.name)}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor={`column-${column.name}`} className="ml-2 text-sm text-gray-900">
                {column.name} <span className="text-gray-500">({column.type})</span>
                {column.table !== table && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    from {column.table}
                  </span>
                )}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW BUTTON */}
      <div className="mt-4 flex space-x-3">
        <button
          onClick={handlePreviewData}
          disabled={selectedColumns.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Preview Data
        </button>
        <button
          disabled={selectedColumns.length === 0}
          onClick={handleImportClick}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Import to CSV
        </button>
      </div>

      {/* PREVIEW TABLE */}
      {previewData.length > 0 && (
        <div className="mt-6 overflow-auto max-h-96">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {Object.keys(previewData[0]).map((col) => (
                  <th key={col} className="p-2 border">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="p-2 border">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
