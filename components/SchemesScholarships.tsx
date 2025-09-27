
import React, { useState } from "react";
import { Search, GraduationCap, Clock } from "lucide-react";

const SchemesScholarships = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Dummy scholarship/scheme data
    const schemes = [
        {
            id: 1,
            name: "National Merit Scholarship",
            description: "Scholarship for meritorious students scoring above 85% in board exams.",
            eligibility: "Class 10th & 12th Students",
            deadline: "2025-10-15",
            status: "Open",
        },
        {
            id: 2,
            name: "SC/ST Welfare Scheme",
            description: "Financial assistance for SC/ST students pursuing higher education.",
            eligibility: "SC/ST category students",
            deadline: "2025-12-01",
            status: "Open",
        },
        {
            id: 3,
            name: "Girls Education Initiative",
            description: "Scholarship to promote higher education among girl students.",
            eligibility: "Female students up to UG level",
            deadline: "2025-11-10",
            status: "Open",
        },
        {
            id: 4,
            name: "Research Fellowship Program",
            description: "Fellowship for students pursuing research in STEM fields.",
            eligibility: "Postgraduate & PhD students",
            deadline: "2025-09-30",
            status: "Closed",
        },
        {
            id: 5,
            name: "Sports Excellence Grant",
            description: "Scholarship for students representing state/national level in sports.",
            eligibility: "Sports players (State/National level)",
            deadline: "2025-11-25",
            status: "Upcoming",
        },
    ];

    const itemsPerPage = 3;
    const filtered = schemes.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.eligibility.toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
        <div className="p-6">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6">🎓 Schemes & Scholarships</h1>

            {/* Search */}
            <div className="flex items-center border rounded-lg px-3 py-2 w-1/3 mb-4">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search by scheme or eligibility..."
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
                            <th className="p-3 text-left">Scheme/Scholarship</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-left">Eligibility</th>
                            <th className="p-3 text-left">Deadline</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((s) => (
                            <tr key={s.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{s.id}</td>
                                <td className="p-3 font-medium flex items-center space-x-2">
                                    <GraduationCap className="w-4 h-4 text-blue-600" />
                                    <span>{s.name}</span>
                                </td>
                                <td className="p-3">{s.description}</td>
                                <td className="p-3">{s.eligibility}</td>
                                <td className="p-3 flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span>{s.deadline}</span>
                                </td>
                                <td
                                    className={`p-3 font-semibold ${s.status === "Open"
                                            ? "text-green-600"
                                            : s.status === "Closed"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                        }`}
                                >
                                    {s.status}
                                </td>
                                <td className="p-3 text-center">
                                    {s.status === "Open" ? (
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                            Apply Now
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
                                        >
                                            Not Available
                                        </button>
                                    )}
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

export default SchemesScholarships;
