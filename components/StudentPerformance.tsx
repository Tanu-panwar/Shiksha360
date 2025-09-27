
'use client'
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { BarChart2, TrendingUp } from "lucide-react";

const subjectPerformance = [
    { subject: "Mathematics", score: 85 },
    { subject: "Science", score: 78 },
    { subject: "English", score: 74 },
    { subject: "History", score: 80 },
    { subject: "Geography", score: 82 },
    { subject: "Computer Science", score: 90 },
];

const progressData = [
    { month: "Jan", average: 72 },
    { month: "Feb", average: 75 },
    { month: "Mar", average: 78 },
    { month: "Apr", average: 80 },
    { month: "May", average: 83 },
    { month: "Jun", average: 85 },
];

export default function StudentPerformance() {
    const [view, setView] = useState("subject");

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">📊 Performance & Reports</h1>
            <p className="text-gray-600 text-sm">Check your progress and subject-wise performance</p>

            {/* Toggle View */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setView("subject")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view === "subject"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Subject Performance
                </button>
                <button
                    onClick={() => setView("progress")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view === "progress"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Progress Over Time
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Wise Performance */}
                {view === "subject" && (
                    <Card className="border border-gray-200 hover:shadow-xl transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-blue-600" /> Subject Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjectPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="subject" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="score" fill="#6366F1" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Progress Over Time */}
                {view === "progress" && (
                    <Card className="border border-gray-200 hover:shadow-xl transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" /> Progress Over Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={progressData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="average" stroke="#10B981" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
