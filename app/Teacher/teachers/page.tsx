"use client"

import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import AddTeacherModal from "@/app/Teacher/components/AddTeacherModal"
import TeacherAuthModal from "@/app/Teacher/components/TeacherAuthModal"
import TeacherDashboard from "@/app/Teacher/components/TeacherDashboard"

type TeachersPageProps = {
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>
  setSelectedAssignment?: React.Dispatch<React.SetStateAction<any>>
}

export default function TeachersPage({
  setActiveTab = () => {},
  setSelectedAssignment = () => {},
}: TeachersPageProps) {

  const [teachers, setTeachers] = useState<any[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null)

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const [loggedInTeacher, setLoggedInTeacher] = useState<any | null>(null)

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers")
      const data = await res.json()
      setTeachers(Array.isArray(data) ? data : data.teachers || [])
    } catch (err) {
      toast.error("Failed to load teachers")
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  // ✅ IF TEACHER LOGGED IN → SHOW DASHBOARD
  if (loggedInTeacher) {
    return <TeacherDashboard teacher={loggedInTeacher} />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">👩‍🏫 Teachers</h1>
          <p className="text-sm text-gray-600">School-wise teacher profiles</p>
        </div>

        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 flex gap-2"
        >
          <Plus size={16} /> Add Teacher
        </Button>
      </div>

      {teachers.length === 0 ? (
        <Card className="rounded-2xl text-center p-6">
          <p className="text-gray-500">No teachers added yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <Card key={t._id} className="rounded-2xl hover:shadow-xl transition">
              <CardHeader>
                <CardTitle>{t.name}</CardTitle>
                <CardDescription>
                  {t.subjects?.join(", ") || "No subjects"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700">
                  Classes: {t.classes?.join(", ") || "Not assigned"}
                </p>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedTeacher(t)
                    setAuthModalOpen(true)
                  }}
                >
                  Login
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddTeacherModal
        open={addModalOpen}
        setOpen={setAddModalOpen}
        onAdded={fetchTeachers}
      />

      <TeacherAuthModal
        open={authModalOpen}
        setOpen={setAuthModalOpen}
        teacher={selectedTeacher}
        onLoginSuccess={(teacher: any) => {
          setLoggedInTeacher(teacher)
        }}
      />
    </div>
  )
}
