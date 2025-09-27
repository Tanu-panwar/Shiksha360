
'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, User } from "lucide-react";

const studentClasses = [
    {
        name: "Mathematics",
        teacher: "Mr. Sharma",
        schedule: "Mon–Fri, 9:00–9:45 AM",
        room: "Room 101",
    },
    {
        name: "Science",
        teacher: "Mrs. Gupta",
        schedule: "Mon–Fri, 10:00–10:45 AM",
        room: "Room 203",
    },
    {
        name: "English",
        teacher: "Ms. Johnson",
        schedule: "Mon–Fri, 11:00–11:45 AM",
        room: "Room 305",
    },
    {
        name: "History",
        teacher: "Mr. Verma",
        schedule: "Mon–Fri, 12:00–12:45 PM",
        room: "Room 210",
    },
    {
        name: "Geography",
        teacher: "Mrs. Singh",
        schedule: "Mon–Fri, 1:00–1:45 PM",
        room: "Room 108",
    },
    {
        name: "Computer Science",
        teacher: "Mr. Khan",
        schedule: "Mon–Fri, 2:00–2:45 PM",
        room: "Lab 1",
    },
];

export default function MyClasses() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">📚 My Classes</h1>
            <p className="text-gray-600 text-sm">Here are your subjects and schedules</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentClasses.map((cls, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-xl transition-transform transform hover:scale-105 border border-gray-200"
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BookOpen className="w-5 h-5 text-indigo-600" />
                                {cls.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-gray-700">
                            <p className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500" /> Teacher: {cls.teacher}
                            </p>
                            <p className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-500" /> {cls.schedule}
                            </p>
                            <p className="flex items-center gap-2">
                                🏫 Room: {cls.room}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
