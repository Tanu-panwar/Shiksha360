
import React, { useState } from "react";
import { Search, PlusCircle, CheckCircle, XCircle, Bell } from "lucide-react";

const GovernmentAnnouncement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Sample announcements data
  const announcements = [
    { id: 1, title: "Exam Schedule Released", audience: "Students", message: "Final exams will start from 15th Oct.", date: "2025-09-01", status: "Published" },
    { id: 2, title: "Teacher Training", audience: "Teachers", message: "Mandatory training session on 5th Oct.", date: "2025-09-02", status: "Pending" },
    { id: 3, title: "Scholarship Deadline", audience: "Students", message: "Last date to apply is 20th Oct.", date: "2025-09-05", status: "Published" },
    { id: 4, title: "Holiday Notice", audience: "All", message: "School will remain closed on 2nd Oct.", date: "2025-09-10", status: "Published" },
    { id: 5, title: "Parent Meeting", audience: "Parents", message: "Meeting scheduled on 18th Oct.", date: "2025-09-12", status: "Pending" },
    { id: 6, title: "Lab Maintenance", audience: "Students", message: "Physics lab closed for repair on 22nd Oct.", date: "2025-09-15", status: "Pending" },
    { id: 7, title: "New Curriculum Update", audience: "Teachers", message: "Updated syllabus available in portal.", date: "2025-09-18", status: "Published" },
    { id: 8, title: "Workshop Registration", audience: "Students", message: "AI workshop on 25th Oct. Register online.", date: "2025-09-20", status: "Pending" },
  ];

  const itemsPerPage = 5;
  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.audience.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">📢 Announcements & Notifications</h1>

      {/* Search + Add */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center border rounded-lg px-3 py-2 w-1/3">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by title or audience..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <PlusCircle className="w-5 h-5 mr-2" /> Add Announcement
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border-collapse bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Audience</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{a.id}</td>
                <td className="p-3 font-medium flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-blue-500" /> <span>{a.title}</span>
                </td>
                <td className="p-3">{a.audience}</td>
                <td className="p-3">{a.message}</td>
                <td className="p-3">{a.date}</td>
                <td
                  className={`p-3 font-semibold ${a.status === "Published" ? "text-green-600" : "text-yellow-600"
                    }`}
                >
                  {a.status}
                </td>
                <td className="p-3 text-center flex items-center justify-center space-x-3">
                  <button className="flex items-center text-green-600 hover:text-green-800">
                    <CheckCircle className="w-5 h-5 mr-1" /> Publish
                  </button>
                  <button className="flex items-center text-red-600 hover:text-red-800">
                    <XCircle className="w-5 h-5 mr-1" /> Remove
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

export default GovernmentAnnouncement;
