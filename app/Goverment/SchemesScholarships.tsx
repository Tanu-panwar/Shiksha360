"use client";
import React, { useState, useEffect } from "react";
import { Search, GraduationCap, Clock, Plus } from "lucide-react";
import axios from "axios";

const SchemesScholarships = ({ setActiveTab, setSelectedScheme }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 4;

  // Fetch schemes from DB
  const fetchSchemes = async () => {
    try {
      const res = await axios.get("/api/schemes");
      setSchemes(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log("Fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const filtered = schemes.filter(
    (s) =>
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.eligibility?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  if (loading) return <div className="p-6 text-lg font-semibold">Loading Schemes...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Government Schemes</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md"
          onClick={() => setActiveTab("add-scheme")}
        >
          <Plus className="w-4 h-4" />
          New Scheme
        </button>
      </div>

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
        <table className="w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Scheme</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Eligibility</th>
              <th className="p-3 text-left">Deadline</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  {s.title}
                </td>
                <td className="p-3">{s.description}</td>
                <td className="p-3">{s.eligibility}</td>
                <td className="p-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {s.deadline || "Not mentioned"}
                </td>
                <td
                  className={`p-3 font-semibold ${
                    s.status === "active"
                      ? "text-green-600"
                      : s.status === "inactive"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {s.status}
                </td>
                <td className="p-3 text-center">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => setSelectedScheme(s)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-3">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span>
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
