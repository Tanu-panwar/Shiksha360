import React, { useState } from "react";
import { CheckCircle, XCircle, Search, PlusCircle } from "lucide-react";

const InstitutionPage = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const institutionsPerPage = 10;

    // Dummy 20+ Schools Data
    const institutions = [
        { id: 1, name: "Delhi Public School", type: "School", status: "Pending", location: "Delhi" },
        { id: 2, name: "SSS School", type: "School", status: "Approved", location: "Mumbai" },
        { id: 3, name: "XYZ International School", type: "School", status: "Rejected", location: "Pune" },
        { id: 4, name: "St. Xavier's School", type: "School", status: "Pending", location: "Kolkata" },
        { id: 5, name: "National Public School", type: "School", status: "Approved", location: "Bangalore" },
        { id: 6, name: "Sunrise Academy", type: "School", status: "Pending", location: "Chennai" },
        { id: 7, name: "Lotus Valley School", type: "School", status: "Rejected", location: "Noida" },
        { id: 8, name: "Cambridge School", type: "School", status: "Approved", location: "Hyderabad" },
        { id: 9, name: "Greenwood High", type: "School", status: "Pending", location: "Ahmedabad" },
        { id: 10, name: "DAV Public School", type: "School", status: "Approved", location: "Patna" },
        { id: 11, name: "Blue Bells School", type: "School", status: "Pending", location: "Indore" },
        { id: 12, name: "Modern School", type: "School", status: "Rejected", location: "Delhi" },
        { id: 13, name: "Heritage School", type: "School", status: "Approved", location: "Jaipur" },
        { id: 14, name: "Tagore International", type: "School", status: "Pending", location: "Lucknow" },
        { id: 15, name: "Springdale School", type: "School", status: "Approved", location: "Chandigarh" },
        { id: 16, name: "City Montessori", type: "School", status: "Rejected", location: "Lucknow" },
        { id: 17, name: "Doon School", type: "School", status: "Approved", location: "Dehradun" },
        { id: 18, name: "Army Public School", type: "School", status: "Pending", location: "Gurgaon" },
        { id: 19, name: "Baldwin School", type: "School", status: "Approved", location: "Bangalore" },
        { id: 20, name: "Sacred Heart School", type: "School", status: "Rejected", location: "Shimla" },
    ];

    // 🔍 Search Filter
    const filtered = institutions.filter((inst) =>
        inst.name.toLowerCase().includes(search.toLowerCase())
    );

    // 📄 Pagination Logic
    const indexOfLast = currentPage * institutionsPerPage;
    const indexOfFirst = indexOfLast - institutionsPerPage;
    const currentInstitutions = filtered.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filtered.length / institutionsPerPage);

    return (
        <div className="p-6">
            {/* Page Title */}
            <h1 className="text-2xl font-bold mb-6">🏫 Institutions Management</h1>

            {/* Search & Add Button */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center border rounded-lg px-3 py-2 w-1/3">
                    <Search className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search institution..."
                        className="outline-none w-full"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1); // reset page on search
                        }}
                    />
                </div>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <PlusCircle className="w-5 h-5 mr-2" /> Add Institution
                </button>
            </div>

            {/* Institutions Table */}
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full border-collapse bg-white rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Type</th>
                            <th className="p-3 text-left">Location</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInstitutions.map((inst) => (
                            <tr key={inst.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{inst.id}</td>
                                <td className="p-3 font-medium">{inst.name}</td>
                                <td className="p-3">{inst.type}</td>
                                <td className="p-3">{inst.location}</td>
                                <td
                                    className={`p-3 font-semibold ${inst.status === "Approved"
                                            ? "text-green-600"
                                            : inst.status === "Rejected"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                        }`}
                                >
                                    {inst.status}
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

export default InstitutionPage;
