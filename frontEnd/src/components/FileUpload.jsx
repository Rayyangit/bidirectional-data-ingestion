// import axios from 'axios';
// import React, { useState } from 'react';
// import { toast } from 'react-toastify';

// const FileUpload = ({ table, columns, onUploadComplete }) => {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [delimiter, setDelimiter] = useState(',');
//   const [hasHeaders, setHasHeaders] = useState(true);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       // Basic file validation
//       if (!selectedFile.name.endsWith('.csv')) {
//         toast.error('Please upload a CSV file');
//         return;
//       }
//       setFile(selectedFile);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       toast.error('Please select a file first');
//       return;
//     }

//     if (!table || !columns || columns.length === 0) {
//       toast.error('Please select a table and columns first');
//       return;
//     }

//     try {
//       setUploading(true);
//       setProgress(0);

//       const formData = new FormData();
//       formData.append('table', table);
//       formData.append('columns', JSON.stringify(columns));
//       formData.append('file', file);
//       formData.append('delimiter', delimiter);
//       formData.append('hasHeaders', hasHeaders);

//       const response = await axios.post('/api/clickhouse/import', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setProgress(percentCompleted);
//         }
//       });

//       toast.success(`Successfully imported ${response.data.records} records`);
//       if (onUploadComplete) {
//         onUploadComplete();
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 
//                          error.message || 
//                          'Upload failed';
//       toast.error(`Upload failed: ${errorMessage}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <h2 className="text-lg font-medium mb-4">Upload CSV File</h2>
      
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           CSV File
//         </label>
//         <div className="flex items-center">
//           <input
//             type="file"
//             onChange={handleFileChange}
//             accept=".csv"
//             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             disabled={uploading}
//           />
//         </div>
//       </div>

//       {file && (
//         <div className="mb-4">
//           <div className="flex justify-between text-sm text-gray-600 mb-2">
//             <span>Selected file: {file.name}</span>
//             <span>{(file.size / 1024).toFixed(2)} KB</span>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Delimiter
//           </label>
//           <select
//             value={delimiter}
//             onChange={(e) => setDelimiter(e.target.value)}
//             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//             disabled={uploading}
//           >
//             <option value=",">Comma (,)</option>
//             <option value=";">Semicolon (;)</option>
//             <option value="\t">Tab (\t)</option>
//             <option value="|">Pipe (|)</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             CSV Contains Headers
//           </label>
//           <div className="mt-1">
//             <input
//               type="checkbox"
//               checked={hasHeaders}
//               onChange={(e) => setHasHeaders(e.target.checked)}
//               className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               disabled={uploading}
//             />
//           </div>
//         </div>
//       </div>

//       {uploading && (
//         <div className="mb-4">
//           <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div
//               className="bg-blue-600 h-2.5 rounded-full"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//           <div className="text-right text-sm text-gray-600 mt-1">
//             {progress}% complete
//           </div>
//         </div>
//       )}

//       <div className="flex justify-end">
//         <button
//           onClick={handleUpload}
//           disabled={!file || uploading || !table || !columns || columns.length === 0}
//           className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
//             !file || uploading || !table || !columns || columns.length === 0
//               ? 'bg-gray-400'
//               : 'bg-blue-600 hover:bg-blue-700'
//           } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//         >
//           {uploading ? 'Uploading...' : 'Upload'}
//         </button>
//       </div>

//       <div className="mt-4 text-xs text-gray-500">
//         <p>Note: The CSV file should match the selected table structure.</p>
//         <p>Selected columns: {columns?.join(', ') || 'None'}</p>
//       </div>
//     </div>
//   );
// };

// export default FileUpload;

import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const FileUpload = ({ table, columns, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeaders, setHasHeaders] = useState(true);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Please upload a CSV file');
        return;
      }
      setFile(selectedFile);
    }
  };

  const validateData = (data) => {
    if (!table || !columns || columns.length === 0) {
      throw new Error('Please select a table and columns first');
    }

    // Basic validation - ensure all required columns exist in the data
    if (data.length > 0) {
      const firstRow = data[0];
      const missingColumns = columns.filter(col => !firstRow.hasOwnProperty(col));
      if (missingColumns.length > 0) {
        throw new Error(`CSV is missing columns: ${missingColumns.join(', ')}`);
      }
    }

    // Convert empty strings to null for database insertion
    return data.map(row => {
      const newRow = {};
      columns.forEach(col => {
        newRow[col] = row[col] === '' ? null : row[col];
      });
      return newRow;
    });
  };

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const lines = content.split('\n');
          const headers = hasHeaders ? lines[0].split(delimiter) : 
            columns.map((_, i) => `column_${i+1}`);
          
          const result = [];
          const startLine = hasHeaders ? 1 : 0;
          
          for (let i = startLine; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(delimiter);
            const row = {};
            
            headers.forEach((header, index) => {
              row[header.trim()] = index < values.length ? values[index].trim() : null;
            });
            
            result.push(row);
          }
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
  
    try {
      setUploading(true);
  
      const parsedData = await parseCSV(file);
      const validatedData = validateData(parsedData);
  
      const formData = new FormData();
      formData.append('table', table);
      formData.append('columns', JSON.stringify(columns));
      formData.append('file', file);
      formData.append('delimiter', delimiter);
      formData.append('hasHeaders', hasHeaders);
      const response = await axios.post('/api/clickhouse/import', formData); // let axios set headers
  
      toast.success(`Successfully imported ${response.data.records} records`);
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      toast.error(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Upload CSV File</h2>
      
      {/* File Input */}
      <div className="mb-4">
        <label className="block mb-2">CSV File</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={uploading}
        />
      </div>

      {/* Delimiter Selection */}
      <div className="mb-4">
        <label className="block mb-2">Delimiter</label>
        <select
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={uploading}
        >
          <option value=",">Comma (,)</option>
          <option value="\t">Tab (\t)</option>
          <option value=";">Semicolon (;)</option>
          <option value="|">Pipe (|)</option>
        </select>
      </div>

      {/* Headers Checkbox */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="hasHeaders"
          checked={hasHeaders}
          onChange={(e) => setHasHeaders(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          disabled={uploading}
        />
        <label htmlFor="hasHeaders" className="ml-2">CSV contains headers</label>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading || !table || !columns || columns.length === 0}
        className={`px-4 py-2 rounded-md ${
          !file || uploading || !table || !columns || columns.length === 0
            ? 'bg-gray-400'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {/* Selected Columns Info */}
      {columns && columns.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Will import to columns: {columns.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;