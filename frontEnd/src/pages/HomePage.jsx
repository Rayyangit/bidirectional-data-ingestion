import { useState } from 'react'
import ConnectionForm from '../components/ConnectionForm'
import TableList from '../components/TableList'
import ColumnSelector from '../components/ColumnSelector'
import DataPreview from '../components/DataPreview'

export default function HomePage() {
  const [connection, setConnection] = useState(null)
  const [selectedTable, setSelectedTable] = useState(null)
  const [selection, setSelection] = useState(null)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ClickHouse Data Tool</h1>
      
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
            {selection && <DataPreview selection={selection} />}
          </div>
        </div>
      )}
    </div>
  )
}