// import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import api from '../utils/api';
// import ColumnSelector from './ColumnSelector';
// import ConnectionForm from './ConnectionForm';
// import DataPreview from './DataPreview';
// import FileUpload from './FileUpload';
// import TableList from './TableList';

// export default function ImportPage() {
//   const [connection, setConnection] = useState(null);
//   const [tables, setTables] = useState([]);
//   const [selectedTable, setSelectedTable] = useState(null);
//   const [selection, setSelection] = useState(null);
//   const [currentView, setCurrentView] = useState('connection');
//   const [previewData, setPreviewData] = useState([]);

//   useEffect(() => {
//     if (connection) {
//       fetchTables();
//     }
//   }, [connection]);

//   const fetchTables = async () => {
//     try {
//       const response = await api.get('/api/clickhouse/tables');
//       setTables(response.data);
//       setCurrentView('tables');
//     } catch (error) {
//       toast.error('Failed to fetch tables: ' + error.message);
//     }
//   };

//   const handleTableSelect = (table) => {
//     setSelectedTable(table);
//     setCurrentView('columns');
//   };

//   const handleAction = async (action, selectionData) => {
//     if (selectionData.columns.length === 0) {
//       toast.error('Please select at least one column');
//       return;
//     }

//     setSelection(selectionData);

//     try {
//       if (action === 'preview') {
//         const response = await api.post('/api/clickhouse/preview', {
//           table: selectionData.table,
//           columns: selectionData.columns,
//           joinTables: selectionData.joinTables,
//           joinConditions: selectionData.joinConditions,
//           joinTypes: selectionData.joinTypes,
//           limit: 100
//         });
//         setPreviewData(response.data);
//         setCurrentView('preview');
//       } else if (action === 'import') {
//         setCurrentView('import');
//       }
//     } catch (error) {
//       toast.error(`Failed to ${action}: ${error.message}`);
//     }
//   };

//   const handleUploadComplete = () => {
//     setCurrentView('tables');
//     setSelectedTable(null);
//     setSelection(null);
//   };

//   return (
//     <div className="space-y-6 p-4">
//       <h1 className="text-2xl font-bold text-gray-900">ClickHouse Data Manager</h1>
      
//       {currentView === 'connection' && (
//         <ConnectionForm onConnect={setConnection} />
//       )}

//       {currentView === 'tables' && (
//         <TableList 
//           tables={tables} 
//           onTableSelect={handleTableSelect} 
//         />
//       )}

//       {currentView === 'columns' && selectedTable && (
//         <ColumnSelector
//           table={selectedTable}
//           tables={tables}
//           onAction={handleAction}
//         />
//       )}

//       {currentView === 'preview' && (
//         <DataPreview 
//           data={previewData} 
//           columns={selection?.columns || []}
//           onBack={() => setCurrentView('columns')}
//           onImport={() => setCurrentView('import')}
//         />
//       )}

//       {currentView === 'import' && (
//         <FileUpload
//           table={selection?.table}
//           columns={selection?.columns}
//           onUploadComplete={handleUploadComplete}
//         />
//       )}
//     </div>
//   );
// }



import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function ImportPage() {
  // App state
  const [connection, setConnection] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [currentView, setCurrentView] = useState('connection');
  const [previewData, setPreviewData] = useState([]);
  
  // File upload state
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeaders, setHasHeaders] = useState(true);

  // Fetch tables when connection is established
  useEffect(() => {
    if (connection) {
      api.get('/api/clickhouse/tables')
        .then(res => setTables(res.data))
        .catch(err => toast.error('Failed to fetch tables: ' + err.message))
        .finally(() => setCurrentView('tables'));
    }
  }, [connection]);

  // Handle table selection
  const selectTable = (table) => {
    setSelectedTable(table);
    setCurrentView('columns');
  };

  // Handle column selection
  const selectColumns = (columns) => {
    if (columns.length === 0) return toast.error('Select at least one column');
    setSelectedColumns(columns);
    setCurrentView('preview');
  };

  // Preview data
  const previewData = async () => {
    try {
      const res = await api.post('/api/clickhouse/preview', {
        table: selectedTable,
        columns: selectedColumns,
        limit: 100
      });
      setPreviewData(res.data);
      setCurrentView('preview');
    } catch (err) {
      toast.error('Preview failed: ' + err.message);
    }
  };

  // Handle file upload
  const uploadFile = async () => {
    if (!file) return toast.error('Select a file first');
    if (!selectedTable || !selectedColumns.length) return toast.error('Select table and columns');

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('table', selectedTable);
      formData.append('columns', JSON.stringify(selectedColumns));
      formData.append('file', file);
      formData.append('delimiter', delimiter);
      formData.append('hasHeaders', hasHeaders);

      const res = await axios.post('/api/clickhouse/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setProgress(Math.round((e.loaded * 100) / e.total))
      });

      toast.success(`Imported ${res.data.records} records`);
      resetFlow();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Reset the flow
  const resetFlow = () => {
    setCurrentView('tables');
    setSelectedTable(null);
    setSelectedColumns([]);
    setFile(null);
  };

  // Render current view
  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">ClickHouse Data Manager</h1>

      {/* Connection Form */}
      {currentView === 'connection' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Connect to ClickHouse</h2>
          {/* Add your connection form fields here */}
          <button 
            onClick={() => setConnection({ connected: true })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Connect
          </button>
        </div>
      )}

      {/* Table Selection */}
      {currentView === 'tables' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Select Table</h2>
          <div className="space-y-2">
            {tables.map(table => (
              <div 
                key={table.name} 
                onClick={() => selectTable(table.name)}
                className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
              >
                {table.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Column Selection */}
      {currentView === 'columns' && selectedTable && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Columns from {selectedTable}</h2>
            <button 
              onClick={() => setCurrentView('tables')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Tables
            </button>
          </div>
          
          <div className="space-y-2">
            {/* Replace with actual columns from your API */}
            {['id', 'name', 'email'].map(column => (
              <div key={column} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column)}
                  onChange={() => setSelectedColumns(prev => 
                    prev.includes(column) 
                      ? prev.filter(c => c !== column) 
                      : [...prev, column]
                  )}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2">{column}</label>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentView('preview')}
            disabled={!selectedColumns.length}
            className={`mt-4 px-4 py-2 rounded-md ${
              !selectedColumns.length ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            Preview Data
          </button>
        </div>
      )}

      {/* Data Preview */}
      {currentView === 'preview' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Preview Data</h2>
            <button 
              onClick={() => setCurrentView('columns')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Columns
            </button>
          </div>
          
          {/* Simple preview table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selectedColumns.map(col => (
                    <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {selectedColumns.map(col => (
                      <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row[col] || 'NULL'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => setCurrentView('upload')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Continue to Upload
          </button>
        </div>
      )}

      {/* File Upload */}
      {currentView === 'upload' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Upload to {selectedTable}</h2>
            <button 
              onClick={() => setCurrentView('preview')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Preview
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2">CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={e => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploading}
              />
            </div>

            {file && (
              <div className="p-3 bg-gray-50 rounded">
                <p>Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Delimiter</label>
                <select
                  value={delimiter}
                  onChange={e => setDelimiter(e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={uploading}
                >
                  <option value=",">Comma (,)</option>
                  <option value="\t">Tab (\t)</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasHeaders}
                  onChange={e => setHasHeaders(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={uploading}
                />
                <label className="ml-2">CSV has headers</label>
              </div>
            </div>

            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            <button
              onClick={uploadFile}
              disabled={!file || uploading}
              className={`px-4 py-2 rounded-md ${
                !file || uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {uploading ? `Uploading... ${progress}%` : 'Start Import'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}