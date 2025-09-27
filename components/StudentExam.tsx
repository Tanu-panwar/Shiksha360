
'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, FileText, CheckCircle, Clock } from "lucide-react";

const exams = [
    {
        title: "Mid Term Mathematics",
        subject: "Mathematics",
        date: "05 Oct 2025",
        status: "Upcoming",
    },
    {
        title: "Science Practical",
        subject: "Science",
        date: "10 Oct 2025",
        status: "Upcoming",
    },
    {
        title: "Geography Exam",
        subject: "Geography",
        date: "28 Sep 2025",
        status: "Upcoming",
    },
    {
        title: "Computer Science Viva",
        subject: "Computer Science",
        date: "15 Oct 2025",
        status: "Upcoming",
    },
    {
        title: "History Quiz",
        subject: "History",
        date: "22 Sep 2025",
        status: "Completed",
        score: "85/100",
    },
    {
        title: "English Literature Test",
        subject: "English",
        date: "20 Sep 2025",
        status: "Completed",
        score: "78/100",
    },
];

export default function StudentExams() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">📖 Exams & Tests</h1>
            <p className="text-gray-600 text-sm">Check your upcoming exams and past results</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-xl transition-transform transform hover:scale-105 border border-gray-200"
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                {exam.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-gray-700">
                            <p><span className="font-medium">Subject:</span> {exam.subject}</p>
                            <p className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" /> Date: {exam.date}
                            </p>

                            {/* Status */}
                            {exam.status === "Upcoming" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                    <Clock className="w-4 h-4" /> Upcoming
                                </span>
                            )}
                            {exam.status === "Completed" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
                                    <CheckCircle className="w-4 h-4" /> Completed
                                </span>
                            )}

                            {/* Score for completed exams */}
                            {exam.status === "Completed" && (
                                <p className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">Score:</span> {exam.score}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
