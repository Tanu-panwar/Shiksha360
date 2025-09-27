
import React, { useState } from "react";
import { Search, CheckCircle, XCircle, AlertTriangle, MessageSquare } from "lucide-react";

const FeedbackGrievances = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Sample grievances data
    const grievances = [
        { id: 1, user: "Rohit Sharma", role: "Student", category: "Attendance Issue", message: "Teacher marked me absent wrongly.", status: "Pending" },
        { id: 2, user: "Priya Singh", role: "Teacher", category: "Salary Delay", message: "Salary not credited this month.", status: "In Progress" },
        { id: 3, user: "Aman Kumar", role: "Parent", category: "Exam Concern", message: "Exam schedule was not shared properly.", status: "Resolved" },
        { id: 4, user: "Sneha Patel", role: "Student", category: "Course Material", message: "E-book link is not working.", status: "Pending" },
        { id: 5, user: "Vikas Yadav", role: "Teacher", category: "Infrastructure", message: "Projector not working in classroom.", status: "Pending" },
        { id: 6, user: "Anjali Verma", role: "Parent", category: "Communication", message: "School doesn’t update about holidays.", status: "Resolved" },
        { id: 7, user: "Manoj Kumar", role: "Student", category: "Scholarship", message: "Scholarship application not updating.", status: "In Progress" },
        { id: 8, user: "Kiran Gupta", role: "Teacher", category: "Technical Issue", message: "Unable to login to portal.", status: "Pending" },
    ];

    const itemsPerPage = 5;
    const filtered = grievances.filter(
        (g) =>
            g.user.toLowerCase().includes(search.toLowerCase()) ||
            g.role.toLowerCase().includes(search.toLowerCase()) ||
            g.category.toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
        <div className="p-6">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6">📝 Feedback & Grievances</h1>

            {/* Search */}
            <div className="flex items-center border rounded-lg px-3 py-2 w-1/3 mb-4">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search by name, role or category..."
                    className="outline-none w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full border-collapse bg-white rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">Message</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((g) => (
                            <tr key={g.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{g.id}</td>
                                <td className="p-3 font-medium">{g.user}</td>
                                <td className="p-3">{g.role}</td>
                                <td className="p-3">{g.category}</td>
                                <td className="p-3">{g.message}</td>
                                <td
                                    className={`p-3 font-semibold ${g.status === "Resolved"
                                            ? "text-green-600"
                                            : g.status === "In Progress"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                        }`}
                                >
                                    {g.status}
                                </td>
                                <td className="p-3 text-center flex items-center justify-center space-x-3">
                                    <button className="flex items-center text-green-600 hover:text-green-800">
                                        <CheckCircle className="w-5 h-5 mr-1" /> Mark Resolved
                                    </button>
                                    <button className="flex items-center text-yellow-600 hover:text-yellow-800">
                                        <AlertTriangle className="w-5 h-5 mr-1" /> In Progress
                                    </button>
                                    <button className="flex items-center text-red-600 hover:text-red-800">
                                        <XCircle className="w-5 h-5 mr-1" /> Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 space-x-3">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-2">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default FeedbackGrievances;
