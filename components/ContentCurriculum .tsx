
import React, { useState } from "react";
import { Search, PlusCircle, CheckCircle, XCircle, FileText } from "lucide-react";

const ContentCurriculum = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Sample Content & Curriculum Data
    const contents = [
        { id: 1, subject: "Mathematics", grade: "6th", type: "E-Book", status: "Pending" },
        { id: 2, subject: "Science", grade: "7th", type: "Video", status: "Approved" },
        { id: 3, subject: "English", grade: "8th", type: "PDF Notes", status: "Rejected" },
        { id: 4, subject: "History", grade: "9th", type: "Interactive Quiz", status: "Pending" },
        { id: 5, subject: "Geography", grade: "10th", type: "E-Book", status: "Approved" },
        { id: 6, subject: "Physics", grade: "11th", type: "Video Lecture", status: "Pending" },
        { id: 7, subject: "Chemistry", grade: "12th", type: "Lab Manual", status: "Approved" },
        { id: 8, subject: "Biology", grade: "9th", type: "E-Book", status: "Pending" },
        { id: 9, subject: "Civics", grade: "10th", type: "PDF Notes", status: "Rejected" },
        { id: 10, subject: "Computer Science", grade: "11th", type: "Video Lecture", status: "Pending" },
        { id: 11, subject: "Environmental Science", grade: "6th", type: "E-Book", status: "Approved" },
        { id: 12, subject: "Economics", grade: "12th", type: "Interactive Quiz", status: "Pending" },
    ];

    const itemsPerPage = 5;
    const filtered = contents.filter(
        (c) =>
            c.subject.toLowerCase().includes(search.toLowerCase()) ||
            c.grade.toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
        <div className="p-6">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6">📚 Content & Curriculum Management</h1>

            {/* Search + Add */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center border rounded-lg px-3 py-2 w-1/3">
                    <Search className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search by subject or grade..."
                        className="outline-none w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <PlusCircle className="w-5 h-5 mr-2" /> Add Content
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full border-collapse bg-white rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Subject</th>
                            <th className="p-3 text-left">Grade</th>
                            <th className="p-3 text-left">Type</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((c) => (
                            <tr key={c.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{c.id}</td>
                                <td className="p-3 font-medium">{c.subject}</td>
                                <td className="p-3">{c.grade}</td>
                                <td className="p-3 flex items-center space-x-2">
                                    <FileText className="w-4 h-4 text-blue-500" /> <span>{c.type}</span>
                                </td>
                                <td
                                    className={`p-3 font-semibold ${c.status === "Approved"
                                            ? "text-green-600"
                                            : c.status === "Rejected"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                        }`}
                                >
                                    {c.status}
                                </td>
                                <td className="p-3 text-center flex items-center justify-center space-x-3">
                                    <button className="flex items-center text-green-600 hover:text-green-800">
                                        <CheckCircle className="w-5 h-5 mr-1" /> Approve
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

export default ContentCurriculum;
