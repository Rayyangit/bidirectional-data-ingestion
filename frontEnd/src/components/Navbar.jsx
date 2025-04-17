import { Link } from 'react-router-dom'
import { ArrowUpTrayIcon, ArrowDownTrayIcon, HomeIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              <HomeIcon className="h-5 w-5 mr-2" />
              ClickHouse Data Tool
            </Link>
            <Link to="/import" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Import
            </Link>
            <Link to="/export" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}