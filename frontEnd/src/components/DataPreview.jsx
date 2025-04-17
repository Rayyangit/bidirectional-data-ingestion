import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import DataPreview from './DataPreview'; // Make sure the path is correct

export default function ColumnSelector() {
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedJoinTables, setSelectedJoinTables] = useState([]);
  const [joinConditions, setJoinConditions] = useState([]);
  const [joinTypes, setJoinTypes] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [previewSelection, setPreviewSelection] = useState({});
  const [step, setStep] = useState('select'); // 'select' or 'preview'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available tables for selection
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await api.get('/api/clickhouse/tables');
      // Populate tables for selection (you can update this as per your API)
      setAvailableTables(response.data);
    } catch (err) {
      console.error("Failed to fetch tables", err);
    }
  };

  const handlePreview = async () => {
    try {
      setLoading(true);

      // Transform join conditions and join types into objects
      const joinConditionMap = {};
      const joinTypeMap = {};

      selectedJoinTables.forEach((table, index) => {
        if (joinConditions[index]) {
          joinConditionMap[table] = joinConditions[index];
        }
        if (joinTypes[index]) {
          joinTypeMap[table] = joinTypes[index];
        }
      });

      const selection = {
        table: selectedTable,
        columns: selectedColumns,
        joinTables: selectedJoinTables,
        joinConditions: joinConditionMap,
        joinTypes: joinTypeMap,
      };

      const response = await api.post('/api/clickhouse/preview', {
        ...selection,
        limit: 100
      });

      setPreviewData(response.data);
      setPreviewSelection(selection);
      setStep('preview');
    } catch (err) {
      toast.error('Preview failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('select');
  };

  return (
    <div className="container">
      {step === 'select' && (
        <div>
          <h1 className="text-xl font-medium">Column Selection</h1>
          <div className="form-group">
            <label>Table</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="form-control"
            >
              <option value="">Select Table</option>
              {availableTables?.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Columns</label>
            <select
              multiple
              value={selectedColumns}
              onChange={(e) => setSelectedColumns(Array.from(e.target.selectedOptions, option => option.value))}
              className="form-control"
            >
              {/* Replace with columns based on selectedTable */}
              <option value="column1">Column 1</option>
              <option value="column2">Column 2</option>
              <option value="column3">Column 3</option>
              {/* Add logic to fetch available columns for the table */}
            </select>
          </div>

          {/* Add logic for selecting join tables */}
          <div className="form-group">
            <label>Join Tables</label>
            <select
              multiple
              value={selectedJoinTables}
              onChange={(e) => setSelectedJoinTables(Array.from(e.target.selectedOptions, option => option.value))}
              className="form-control"
            >
              <option value="table1">Table 1</option>
              <option value="table2">Table 2</option>
            </select>
          </div>

          {/* Add logic for entering join conditions */}
          <div className="form-group">
            <label>Join Conditions</label>
            <input
              type="text"
              value={joinConditions.join(', ')}
              onChange={(e) => setJoinConditions(e.target.value.split(', '))}
              className="form-control"
            />
          </div>

          {/* Add logic for selecting join types */}
          <div className="form-group">
            <label>Join Types</label>
            <select
              multiple
              value={joinTypes}
              onChange={(e) => setJoinTypes(Array.from(e.target.selectedOptions, option => option.value))}
              className="form-control"
            >
              <option value="inner">INNER</option>
              <option value="left">LEFT</option>
              <option value="right">RIGHT</option>
            </select>
          </div>

          <div className="form-group">
            <button onClick={handlePreview} disabled={loading} className="btn btn-primary">
              {loading ? 'Loading...' : 'Preview'}
            </button>
          </div>
        </div>
      )}

      {step === 'preview' && (
        <DataPreview
          data={previewData}
          columns={previewSelection.columns}
          onBack={handleBack}
          onImport={() => console.log('Importing data...')}
        />
      )}
    </div>
  );
}
