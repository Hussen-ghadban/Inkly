import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold tracking-wide">
        <Link href="/">MyBlogs</Link>
      </div>
      
      <ul className="flex items-center space-x-6">
        <li>
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        </li>
        <li>
          <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-blue-400 transition-colors">About</Link>
        </li>
        <li>
          <Link href="/posts" className="hover:text-blue-400 transition-colors">Blogs</Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
        </li>
      </ul>
      
      <div>
        <Link
          href="/auth"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Get Started
        </Link>
      </div>
    </nav>
  )
}

export default Navbar