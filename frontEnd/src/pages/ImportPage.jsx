// import { useState } from 'react'
// import { toast } from 'react-toastify'
// import ColumnSelector from '../components/ColumnSelector'
// import ConnectionForm from '../components/ConnectionForm'
// import FileUpload from '../components/FileUpload'
// import ProgressBar from '../components/ProgressBar'
// import SourceTypeSelector from '../components/SourceTypeSelector'
// import TableList from '../components/TableList'
// import api from '../utils/api'

// export default function ImportPage() {
//   const [connection, setConnection] = useState(null)
//   const [selectedTable, setSelectedTable] = useState(null)
//   const [selection, setSelection] = useState(null)
//   const [sourceType, setSourceType] = useState('clickhouse') // 'clickhouse' or 'csv'
//   const [importing, setImporting] = useState(false)
//   const [progress, setProgress] = useState(0)

//   const handleColumnsSelected = (selection, shouldImportDirectly) => {
//     setSelection(selection)
    
//     if (shouldImportDirectly && sourceType === 'clickhouse') {
//       handleImportFromClickHouse(selection)
//     }
//   }

//   const handleImportFromClickHouse = async (selection) => {
//     try {
//       setImporting(true)
//       setProgress(0)
      
//       const response = await api.post('/api/clickhouse/import', {
//         table: selection.table,
//         columns: selection.columns,
//         joinTables: selection.joinTables,
//         joinConditions: selection.joinConditions,
//         joinTypes: selection.joinTypes
//       }, {
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           )
//           setProgress(percentCompleted)
//         }
//       })

//       toast.success(`Successfully imported ${response.data.records} records`)
//       setSelectedTable(null)
//       setSelection(null)
//     } catch (error) {
//       toast.error('Import failed: ' + error.message)
//     } finally {
//       setImporting(false)
//       setProgress(0)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-gray-900">Import Data</h1>
      
//       <SourceTypeSelector 
//         currentType={sourceType}
//         onSelect={setSourceType}
//       />
      
//       {sourceType === 'clickhouse' && (
//         <>
//           {!connection ? (
//             <ConnectionForm onConnect={setConnection} />
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-1 space-y-6">
//                 <TableList connection={connection} onTableSelect={setSelectedTable} />
//                 {selectedTable && (
//                   <ColumnSelector
//                     connection={connection}
//                     table={selectedTable}
//                     onColumnsSelected={handleColumnsSelected}
//                     sourceType={sourceType}
//                   />
//                 )}
//               </div>
//               <div className="lg:col-span-2">
//                 {importing && <ProgressBar progress={progress} />}
//               </div>
//             </div>
//           )}
//         </>
//       )}
      
//       {sourceType === 'csv' && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-1">
//             {selection && (
//               <div className="bg-white p-4 rounded-lg shadow">
//                 <h3 className="font-medium mb-2">Selected Columns</h3>
//                 <ul className="space-y-1">
//                   {selection.columns.map(col => (
//                     <li key={col} className="text-sm">{col}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//           <div className="lg:col-span-2">
//             <FileUpload
//               table={selection?.table}
//               columns={selection?.columns}
//               onUploadComplete={() => {
//                 setSelection(null)
//                 toast.success('CSV import completed successfully')
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function ImportPage() {
  // App state
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [currentView, setCurrentView] = useState('tables'); // 'tables', 'columns', 'upload'
  
  // File upload state
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [delimiter, setDelimiter] = useState(',');

  // Load tables on mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('/api/clickhouse/tables');
        setTables(response.data);
      } catch (error) {
        toast.error('Failed to load tables: ' + error.message);
      }
    };
    fetchTables();
  }, []);

  // Handle table selection
  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setCurrentView('columns');
  };

  // Handle column selection
  const handleColumnSelect = (columns) => {
    if (columns.length === 0) {
      toast.error('Please select at least one column');
      return;
    }
    setSelectedColumns(columns);
    setCurrentView('upload');
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('table', selectedTable);
      formData.append('columns', JSON.stringify(selectedColumns));
      formData.append('delimiter', delimiter);

      const response = await axios.post('/api/clickhouse/import', formData);
      toast.success(`Successfully imported ${response.data.records} records`);
      resetFlow();
    } catch (error) {
      toast.error('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  // Reset the flow
  const resetFlow = () => {
    setCurrentView('tables');
    setSelectedTable('');
    setSelectedColumns([]);
    setFile(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Data Import Tool</h1>

      {/* Table Selection View */}
      {currentView === 'tables' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Select a Table</h2>
          <div className="space-y-2">
            {tables.map((table) => (
              <div
                key={table.name}
                onClick={() => handleTableSelect(table.name)}
                className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
              >
                {table.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Column Selection View */}
      {currentView === 'columns' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Select Columns from {selectedTable}</h2>
            <button
              onClick={() => setCurrentView('tables')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Tables
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {/* Replace with actual columns from your API */}
            {['id', 'name', 'email', 'created_at'].map((column) => (
              <div key={column} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedColumns([...selectedColumns, column]);
                    } else {
                      setSelectedColumns(selectedColumns.filter(c => c !== column));
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2">{column}</label>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleColumnSelect(selectedColumns)}
            disabled={selectedColumns.length === 0}
            className={`px-4 py-2 rounded-md ${
              selectedColumns.length === 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            Continue to Upload
          </button>
        </div>
      )}

      {/* File Upload View */}
      {currentView === 'upload' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Upload to {selectedTable}</h2>
            <button
              onClick={() => setCurrentView('columns')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Columns
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2">CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block mb-2">Delimiter</label>
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={uploading}
              >
                <option value=",">Comma (,)</option>
                <option value="\t">Tab (\t)</option>
                <option value=";">Semicolon (;)</option>
              </select>
            </div>

            {file && (
              <div className="p-3 bg-gray-50 rounded">
                <p>Selected file: {file.name}</p>
                <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                <p>Selected columns: {selectedColumns.join(', ')}</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`px-4 py-2 rounded-md ${
                !file || uploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {uploading ? 'Uploading...' : 'Start Import'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}