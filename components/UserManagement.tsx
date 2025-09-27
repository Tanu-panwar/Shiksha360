
import React, { useState } from "react";
import { Search } from "lucide-react";

const UserManagement = () => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    // Dummy Users Data (Students, Teachers, Parents)
    const users = [
        { id: 1, name: "Rahul Sharma", role: "Student", email: "rahul@student.com", status: "Active" },
        { id: 2, name: "Priya Verma", role: "Teacher", email: "priya@teacher.com", status: "Active" },
        { id: 3, name: "Amit Kumar", role: "Parent", email: "amit@parent.com", status: "Inactive" },
        { id: 4, name: "Neha Singh", role: "Student", email: "neha@student.com", status: "Active" },
        { id: 5, name: "Ravi Patel", role: "Teacher", email: "ravi@teacher.com", status: "Active" },
        { id: 6, name: "Sunita Devi", role: "Parent", email: "sunita@parent.com", status: "Active" },
        { id: 7, name: "Anjali Gupta", role: "Student", email: "anjali@student.com", status: "Inactive" },
        { id: 8, name: "Vikram Rao", role: "Teacher", email: "vikram@teacher.com", status: "Active" },
        { id: 9, name: "Meena Sharma", role: "Parent", email: "meena@parent.com", status: "Active" },
        { id: 10, name: "Karan Singh", role: "Student", email: "karan@student.com", status: "Active" },
        { id: 11, name: "Alok Yadav", role: "Teacher", email: "alok@teacher.com", status: "Inactive" },
        { id: 12, name: "Pooja Kumari", role: "Parent", email: "pooja@parent.com", status: "Active" },
        { id: 13, name: "Arjun Mehta", role: "Student", email: "arjun@student.com", status: "Active" },
        { id: 14, name: "Sneha Rani", role: "Teacher", email: "sneha@teacher.com", status: "Active" },
        { id: 15, name: "Rajesh Kumar", role: "Parent", email: "rajesh@parent.com", status: "Inactive" },
    ];

    // 🔍 Search + Filter
    const filtered = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "All" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // 📄 Pagination Logic
    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentUsers = filtered.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filtered.length / usersPerPage);

    return (
        <div className="p-6">
            {/* Page Title */}
            <h1 className="text-2xl font-bold mb-6">👤 User Management</h1>

            {/* Search & Filter */}
            <div className="flex items-center justify-between mb-4">
                {/* Search Bar */}
                <div className="flex items-center border rounded-lg px-3 py-2 w-1/3">
                    <Search className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search user..."
                        className="outline-none w-full"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* Role Filter */}
                <select
                    className="border px-4 py-2 rounded-lg"
                    value={roleFilter}
                    onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="All">All Roles</option>
                    <option value="Student">Students</option>
                    <option value="Teacher">Teachers</option>
                    <option value="Parent">Parents</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full border-collapse bg-white rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{user.id}</td>
                                <td className="p-3 font-medium">{user.name}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">{user.email}</td>
                                <td
                                    className={`p-3 font-semibold ${user.status === "Active" ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {user.status}
                                </td>
                                <td className="p-3 text-center space-x-3">
                                    <button className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                        Activate
                                    </button>
                                    <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                        Deactivate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-3 mt-6">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Prev
                </button>
                <span className="font-semibold">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                            ? "bg-gray-300"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserManagement;
