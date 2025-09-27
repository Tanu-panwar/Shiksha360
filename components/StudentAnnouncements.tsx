
'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Megaphone, CalendarDays, BookOpen, PartyPopper, AlertCircle } from "lucide-react";

const announcements = [
    {
        title: "Half-Yearly Exams Schedule Released",
        date: "25 Sep 2025",
        category: "Exams",
        description: "The exam timetable for all classes has been released. Please check the Exams section.",
        icon: <BookOpen className="w-5 h-5 text-blue-600" />,
    },
    {
        title: "School Closed on Gandhi Jayanti",
        date: "02 Oct 2025",
        category: "Holiday",
        description: "School will remain closed on 2nd October due to Gandhi Jayanti.",
        icon: <CalendarDays className="w-5 h-5 text-green-600" />,
    },
    {
        title: "Annual Sports Day",
        date: "10 Oct 2025",
        category: "Event",
        description: "Students are invited to participate in the Annual Sports Day. Registrations open till 5th October.",
        icon: <PartyPopper className="w-5 h-5 text-orange-600" />,
    },
    {
        title: "Library Book Submission",
        date: "28 Sep 2025",
        category: "Notice",
        description: "Students must return all pending library books by the due date to avoid fines.",
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    },
];

export default function StudentAnnouncements() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-indigo-600" /> Announcements & Notices
            </h1>
            <p className="text-gray-600 text-sm">Stay updated with latest school news and notifications</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {announcements.map((a, i) => (
                    <Card
                        key={i}
                        className="border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition duration-200"
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {a.icon} {a.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-700">{a.description}</p>
                            <p className="text-xs text-gray-500 mt-2">📅 {a.date}</p>
                            <span
                                className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700"
                            >
                                {a.category}
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
