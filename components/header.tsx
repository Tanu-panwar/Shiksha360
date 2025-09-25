export default function Header() {
  return (
    <header className="w-full bg-blue-100 border-b border-blue-200 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-800">Shiksha360</h1>
        <nav className="space-x-4 text-blue-700 text-sm">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact</a>
        </nav>
      </div>
    </header>
  )
}