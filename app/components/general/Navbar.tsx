
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
          <Link href="/about" className="hover:text-blue-400 transition-colors">Dashboard</Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-blue-400 transition-colors">About</Link>
        </li>
        <li>
          <Link href="/blogs" className="hover:text-blue-400 transition-colors">Blogs</Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
        </li>
      </ul>

      <div className="space-x-4">
        <Link
          href="/signin"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white transition"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded text-blue-400 transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
