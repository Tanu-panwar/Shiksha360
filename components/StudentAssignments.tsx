
'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const assignments = [
    {
        title: "Algebra Homework",
        subject: "Mathematics",
        dueDate: "28 Sep 2025",
        status: "Pending",
    },
    {
        title: "Science Lab Report",
        subject: "Science",
        dueDate: "25 Sep 2025",
        status: "Completed",
    },
    {
        title: "Essay on Freedom Fighters",
        subject: "English",
        dueDate: "30 Sep 2025",
        status: "Overdue",
    },
    {
        title: "History Project",
        subject: "History",
        dueDate: "29 Sep 2025",
        status: "Pending",
    },
    {
        title: "Geography Map Assignment",
        subject: "Geography",
        dueDate: "27 Sep 2025",
        status: "Completed",
    },
    {
        title: "Coding Task",
        subject: "Computer Science",
        dueDate: "26 Sep 2025",
        status: "Pending",
    },
];

export default function StudentAssignments() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">📝 Assignments & Homework</h1>
            <p className="text-gray-600 text-sm">Track your pending, completed, and overdue tasks</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((a, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-xl transition-transform transform hover:scale-105 border border-gray-200"
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                {a.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-gray-700">
                            <p><span className="font-medium">Subject:</span> {a.subject}</p>
                            <p className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" /> Due: {a.dueDate}
                            </p>

                            {/* Status Badge */}
                            {a.status === "Completed" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold">
                                    <CheckCircle className="w-4 h-4" /> Completed
                                </span>
                            )}
                            {a.status === "Pending" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                    <Clock className="w-4 h-4" /> Pending
                                </span>
                            )}
                            {a.status === "Overdue" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">
                                    <AlertTriangle className="w-4 h-4" /> Overdue
                                </span>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
