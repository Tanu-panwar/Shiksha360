
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Users, FileText } from "lucide-react";

export default function AssignmentDetails({ assignment, setActiveTab }) {
    if (!assignment) return null;

    return (
        <div className="p-6 space-y-6">
            {/* Back Button */}
            <button
                className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                onClick={() => setActiveTab("assignments")}
            >
                <ArrowLeft className="w-4 h-4" /> Back to Assignments
            </button>

            {/* Assignment Info */}
            <Card className="border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        {assignment.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">
                        {assignment.subject} • {assignment.class}
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Due Date */}
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Due Date: {assignment.dueDate}
                    </div>

                    {/* Submissions */}
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <Users className="w-4 h-4 text-green-600" />
                        Submissions: {assignment.submissions}
                    </div>

                    {/* Description */}
                    <div className="flex items-start gap-2 text-gray-700 text-sm">
                        <FileText className="w-4 h-4 text-purple-600 mt-0.5" />
                        <p>
                            <strong>Details:</strong> This assignment requires students
                            to work on <span className="text-gray-900 font-medium">
                                {assignment.subject}
                            </span> concepts and submit before the deadline.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                    Grade Submissions
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                    Download Report
                </button>
            </div>
        </div>
    );
}
