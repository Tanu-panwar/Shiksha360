"use client"

import React, { useState, useEffect, useMemo } from "react"
import AddStudentModal from "@/app/Teacher/components/AddStudentModal"
import { Button } from "@/components/ui/button"

type StudentsPageProps = {
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>
  setSelectedClass?: React.Dispatch<React.SetStateAction<any>>
}

export default function StudentsPage({
  setActiveTab = () => {},
  setSelectedClass = () => {},
}: StudentsPageProps) {

  const [students, setStudents] = useState<any[]>([])
  const [filters, setFilters] = useState({ class: "", section: "", status: "", search: "" })

  // Stats
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.status === "active").length
  const inactiveStudents = students.filter(s => s.status === "inactive").length
  const classesCovered = new Set(students.map(s => s.class)).size

  // Filtered list
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      return (
        (filters.class ? s.class === filters.class : true) &&
        (filters.section ? s.section === filters.section : true) &&
        (filters.status ? s.status === filters.status : true) &&
        (filters.search
          ? s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            String(s.roll).includes(filters.search)
          : true)
      )
    })
  }, [students, filters])

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students")
      const data = await res.json()
      setStudents(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">👨‍🎓 Students Dashboard</h1>
          <p className="text-gray-600 text-sm">Manage, upload & track students</p>
        </div>
        <div className="flex gap-2">
          <AddStudentModal onStudentAdded={(s) => setStudents([...students, s])} />
          <Button className="px-4 py-2 border rounded hover:bg-gray-100">⬆ Upload CSV</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={totalStudents} />
        <StatCard title="Active Students" value={activeStudents} />
        <StatCard title="Inactive Students" value={inactiveStudents} />
        <StatCard title="Classes Covered" value={classesCovered} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mt-4">
        <select className="border px-3 py-2 rounded w-32" onChange={e => setFilters({ ...filters, class: e.target.value })}>
          <option value="">All Classes</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <select className="border px-3 py-2 rounded w-32" onChange={e => setFilters({ ...filters, section: e.target.value })}>
          <option value="">All Sections</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
        <select className="border px-3 py-2 rounded w-32" onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          type="text"
          placeholder="Search name / roll"
          className="border px-3 py-2 rounded flex-1"
          onChange={e => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto mt-4">
        <div className="border rounded-xl bg-white p-4 hover:shadow-lg transition">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 rounded-t-xl">
              <tr>
                <th className="p-3 text-left">Roll</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Section</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s._id || s.roll} className="border-t">
                  <td className="p-3">{s.roll}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.class}</td>
                  <td className="p-3">{s.section}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        s.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="text-blue-600 hover:underline">View</button>
                    <button className="text-gray-600 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// 🔹 Stats Card Component
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="border rounded-xl p-4 hover:shadow-lg transition bg-white">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  )
}
