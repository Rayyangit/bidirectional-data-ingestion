import { useState } from 'react'
import { toast } from 'react-toastify'

export default function ConnectionForm({ onConnect }) {
  const [connection, setConnection] = useState({
    host: 'localhost',
    port: '8123',
    database: 'default',
    username: 'default',
    jwtToken: ''
  })

  const handleChange = (e) => {
    setConnection({ ...connection, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!connection.host || !connection.port) {
      toast.error('Host and Port are required')
      return
    }
    onConnect(connection)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">ClickHouse Connection</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="host" className="block text-sm font-medium text-gray-700">Host</label>
            <input
              type="text"
              name="host"
              id="host"
              value={connection.host}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="port" className="block text-sm font-medium text-gray-700">Port</label>
            <input
              type="text"
              name="port"
              id="port"
              value={connection.port}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="database" className="block text-sm font-medium text-gray-700">Database</label>
            <input
              type="text"
              name="database"
              id="database"
              value={connection.database}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={connection.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="jwtToken" className="block text-sm font-medium text-gray-700">JWT Token (optional)</label>
            <input
              type="password"
              name="jwtToken"
              id="jwtToken"
              value={connection.jwtToken}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Connect
          </button>
        </div>
      </form>
    </div>
  )
}