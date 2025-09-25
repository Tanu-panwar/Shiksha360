
export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-6">
                    <img src="/student_avatar.png" className="mx-auto h-20 w-20 rounded-full" alt="Student" />
                    <h1 className="text-2xl font-bold text-blue-700 mt-2">Welcome Back!</h1>
                    <p className="text-gray-600 text-sm">Please login to your student dashboard</p>
                </div>
                <form>
                    <input
                        type="text"
                        placeholder="Enter Student ID"
                        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600 text-sm">
                    Don’t have an account?{" "}
                    <a href="/register" className="text-blue-700 font-medium hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}
