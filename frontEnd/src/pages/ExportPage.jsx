import { useState } from 'react'
import { toast } from 'react-toastify'
import ColumnSelector from '../components/ColumnSelector'
import ConnectionForm from '../components/ConnectionForm'
import TableList from '../components/TableList'
import api from '../utils/api'

export default function ExportPage() {
  const [connection, setConnection] = useState(null)
  const [selectedTable, setSelectedTable] = useState(null)
  const [selection, setSelection] = useState(null)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!selection) return

    try {
      setExporting(true)
      
      const response = await api.get('/api/clickhouse/export', {
        params: {
          table: selection.table,
          columns: selection.columns.join(','),
          joinTables: selection.joinTables,
          joinConditions: selection.joinConditions,
          joinTypes: selection.joinTypes
        },
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${selection.table}_export_${new Date().toISOString().slice(0,10)}.csv`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      
      toast.success('Export completed successfully')
    } catch (error) {
      toast.error('Export failed: ' + error.message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Export Data from ClickHouse</h1>
      
      {!connection ? (
        <ConnectionForm onConnect={setConnection} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <TableList connection={connection} onTableSelect={setSelectedTable} />
            {selectedTable && (
              <ColumnSelector
                connection={connection}
                table={selectedTable}
                onColumnsSelected={setSelection}
              />
            )}
          </div>
          <div className="lg:col-span-2">
            {selection && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4">Export Options</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Selected {selection.columns.length} columns from {selection.table}
                </p>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${exporting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  {exporting ? 'Exporting...' : 'Export to CSV'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}