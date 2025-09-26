
'use cleint'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { FileText, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { useState } from "react";

export default function TeacherAssignments({ setActiveTab, setSelectedAssignment }) {

    const assignments = [
        {
            title: "Algebra Homework",
            subject: "Mathematics",
            class: "Class 8A",
            dueDate: "28 Sep 2025",
            submissions: "25/32",
            status: "Pending",
        },
        {
            title: "Science Lab Report",
            subject: "Science",
            class: "Class 7B",
            dueDate: "25 Sep 2025",
            submissions: "28/28",
            status: "Completed",
        },
        {
            title: "Essay on Freedom Fighters",
            subject: "English",
            class: "Class 6C",
            dueDate: "30 Sep 2025",
            submissions: "10/30",
            status: "Overdue",
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        📑 Assignments
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Track, manage, and grade your class assignments
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition" onClick={() => setActiveTab("add-assignment")}
                >
                    <Plus className="w-4 h-4" />
                    New Assignment
                </button>
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assgn, idx) => (
                    <Card
                        key={idx}
                        className="hover:shadow-lg transition border border-gray-200"
                    >
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {assgn.title}
                                <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${assgn.status === "Completed"
                                        ? "bg-green-100 text-green-700"
                                        : assgn.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {assgn.status}
                                </span>
                            </CardTitle>
                            <CardDescription>
                                {assgn.subject} • {assgn.class}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Deadline */}
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Clock className="w-4 h-4 text-blue-600" />
                                Due: {assgn.dueDate}
                            </div>

                            {/* Submissions */}
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <FileText className="w-4 h-4 text-purple-600" />
                                Submissions: {assgn.submissions}
                            </div>

                            {/* Quick Status */}
                            {assgn.status === "Completed" && (
                                <div className="flex items-center gap-2 text-sm text-green-700">
                                    <CheckCircle className="w-4 h-4" />
                                    All students submitted
                                </div>
                            )}
                            {assgn.status === "Pending" && (
                                <div className="flex items-center gap-2 text-sm text-yellow-700">
                                    <AlertCircle className="w-4 h-4" />
                                    Awaiting more submissions
                                </div>
                            )}
                            {assgn.status === "Overdue" && (
                                <div className="flex items-center gap-2 text-sm text-red-700">
                                    <AlertCircle className="w-4 h-4" />
                                    Submissions overdue
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-3">
                                <button className="px-3 py-1 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition" onClick={() => {
                                    setSelectedAssignment(assgn);
                                    setActiveTab("assignment-details");
                                }}>
                                    View Details
                                </button>
                                <button className="px-3 py-1 text-xs rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
                                    Grade
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
