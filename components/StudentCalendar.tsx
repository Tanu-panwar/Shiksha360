
'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, BookOpen, FileText } from "lucide-react";

const events = [
    {
        title: "Math Class",
        type: "class",
        date: "2025-09-28",
        time: "9:00 AM - 9:45 AM",
    },
    {
        title: "Science Lab",
        type: "class",
        date: "2025-09-28",
        time: "10:00 AM - 10:45 AM",
    },
    {
        title: "Algebra Homework Due",
        type: "assignment",
        date: "2025-09-28",
        time: "11:59 PM",
    },
    {
        title: "History Exam",
        type: "exam",
        date: "2025-10-05",
        time: "9:00 AM",
    },
    {
        title: "English Essay Due",
        type: "assignment",
        date: "2025-09-30",
        time: "11:59 PM",
    },
];

export default function StudentCalendar() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">📅 Calendar & Schedule</h1>
            <p className="text-gray-600 text-sm">Check your upcoming classes, exams, and assignments</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar Events */}
                <Card className="border border-gray-200 hover:shadow-xl transition">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-indigo-600" /> Upcoming Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {events.map((event, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border text-sm flex flex-col gap-1 ${event.type === "class"
                                        ? "border-blue-300 bg-blue-50"
                                        : event.type === "assignment"
                                            ? "border-yellow-300 bg-yellow-50"
                                            : "border-red-300 bg-red-50"
                                    }`}
                            >
                                <span className="font-semibold">{event.title}</span>
                                <span className="text-gray-700">📅 {event.date}</span>
                                <span className="text-gray-600">⏰ {event.time}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Weekly Timetable (Simplified) */}
                <Card className="border border-gray-200 hover:shadow-xl transition">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-green-600" /> Weekly Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border">Day</th>
                                    <th className="p-2 border">Subject</th>
                                    <th className="p-2 border">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2 border">Mon–Fri</td>
                                    <td className="p-2 border">Mathematics</td>
                                    <td className="p-2 border">9:00–9:45 AM</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border">Mon–Fri</td>
                                    <td className="p-2 border">Science</td>
                                    <td className="p-2 border">10:00–10:45 AM</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border">Mon–Fri</td>
                                    <td className="p-2 border">English</td>
                                    <td className="p-2 border">11:00–11:45 AM</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border">Mon–Fri</td>
                                    <td className="p-2 border">History</td>
                                    <td className="p-2 border">12:00–12:45 PM</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border">Mon–Fri</td>
                                    <td className="p-2 border">Geography</td>
                                    <td className="p-2 border">1:00–1:45 PM</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border">Mon–Fri</td>
                                    <td className="p-2 border">Computer Science</td>
                                    <td className="p-2 border">2:00–2:45 PM</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
