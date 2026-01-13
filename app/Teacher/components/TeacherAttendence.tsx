"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Users,
  CheckCircle,
  XCircle,
  Percent,
  Plus,
} from "lucide-react"
import * as XLSX from "xlsx"
import { AddClassForm, ClassFormData } from "@/components/AddClassForm"

/* ---------- TYPES ---------- */
type ClassRow = {
  _id: string
  className: string
  section: string
  teacher: string
  students: number
  lastAttendanceDate?: string
}

type AttendanceRow = {
  rollNo: string
  name: string
  status: "P" | "A"
}

export default function AttendancePage() {
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [openAddClass, setOpenAddClass] = useState(false)
  const [activeClassId, setActiveClassId] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percent: 0,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ---------- LOAD DATA ---------- */
  const loadClasses = async () => {
    const res = await fetch("/api/classes")
    const data = await res.json()
    setClasses(Array.isArray(data) ? data : [])
  }

  const loadStats = async () => {
    const res = await fetch(`/api/attendance/stats?date=${selectedDate}`)
    const data = await res.json()
    setStats(data || { total: 0, present: 0, absent: 0, percent: 0 })
  }

  useEffect(() => {
    loadClasses()
  }, [])

  useEffect(() => {
    loadStats()
  }, [selectedDate])

  /* ---------- ADD CLASS ---------- */
  const handleAddClass = async (data: ClassFormData) => {
    await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    await loadClasses()
  }

  /* ---------- FILE PICK ---------- */
  const openFilePicker = (classId: string) => {
    setActiveClassId(classId)
    fileInputRef.current?.click()
  }

  /* ---------- UPLOAD ---------- */
  const handleFileChange = (file: File) => {
    if (!activeClassId) return

    const reader = new FileReader()

    reader.onload = async (e) => {
      const workbook = XLSX.read(
        new Uint8Array(e.target?.result as ArrayBuffer),
        { type: "array" }
      )

      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json: any[] = XLSX.utils.sheet_to_json(sheet)

      const records: AttendanceRow[] = json.map((r) => ({
        rollNo: String(r.RollNo).trim(),
        name: r.Name,
        status: r.Status === "P" ? "P" : "A",
      }))

      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: activeClassId,
          date: selectedDate,
          records,
        }),
      })

      // 🔥 IMPORTANT
      await loadStats()
      await loadClasses()

      alert("Attendance uploaded successfully")

      // reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="p-6 space-y-6">

      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-sm text-gray-600">
            Upload & track daily attendance
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />

          <Button onClick={() => setOpenAddClass(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Class
          </Button>
        </div>
      </div>

      {/* ---------- STATS ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.total} icon={<Users />} />
        <StatCard title="Present" value={stats.present} icon={<CheckCircle />} color="green" />
        <StatCard title="Absent" value={stats.absent} icon={<XCircle />} color="red" />
        <StatCard title="Attendance %" value={`${stats.percent}%`} icon={<Percent />} />
      </div>

      {/* ---------- CLASS LIST ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Attendance</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {classes.map((cls) => {
            const uploadedToday = cls.lastAttendanceDate === selectedDate

            return (
              <div
                key={cls._id}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 rounded-lg"
              >
                <div className="font-semibold">
                  Class {cls.className}-{cls.section}
                </div>

                <div>{cls.teacher}</div>
                <div>{cls.students} Students</div>

                <Badge
                  className={
                    uploadedToday
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {uploadedToday ? "Uploaded" : "Pending"}
                </Badge>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openFilePicker(cls._id)}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* ---------- HIDDEN FILE INPUT ---------- */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        hidden
        onChange={(e) =>
          e.target.files && handleFileChange(e.target.files[0])
        }
      />

      <AddClassForm
        open={openAddClass}
        setOpen={setOpenAddClass}
        onSubmit={handleAddClass}
      />
    </div>
  )
}

/* ---------- STAT CARD ---------- */
function StatCard({ title, value, icon, color = "blue" }: any) {
  const map: any = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
  }

  return (
    <Card>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${map[color]}`}>{value}</p>
        </div>
        <div className={map[color]}>{icon}</div>
      </CardContent>
    </Card>
  )
}
