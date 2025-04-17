export default function SourceTypeSelector({ currentType, onSelect }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Select Data Source</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => onSelect('clickhouse')}
            className={`px-4 py-2 rounded-md ${
              currentType === 'clickhouse'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ClickHouse Database
          </button>
          <button
            onClick={() => onSelect('csv')}
            className={`px-4 py-2 rounded-md ${
              currentType === 'csv'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            CSV File
          </button>
        </div>
      </div>
    )
  }