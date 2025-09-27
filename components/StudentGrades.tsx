
'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { GraduationCap } from "lucide-react";

const grades = [
    { subject: "Mathematics", marks: 88, grade: "A" },
    { subject: "Science", marks: 76, grade: "B+" },
    { subject: "English", marks: 82, grade: "A-" },
    { subject: "History", marks: 70, grade: "B" },
    { subject: "Geography", marks: 85, grade: "A" },
    { subject: "Computer Science", marks: 92, grade: "A+" },
];

export default function StudentGrades() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-indigo-600" /> Grades
            </h1>
            <p className="text-gray-600 text-sm">View your marks and grades for each subject</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Table Section */}
                <Card className="border border-gray-200 hover:shadow-xl transition">
                    <CardHeader>
                        <CardTitle>📋 Grade Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Marks</TableHead>
                                    <TableHead>Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {grades.map((g, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{g.subject}</TableCell>
                                        <TableCell>{g.marks}</TableCell>
                                        <TableCell className="font-semibold">{g.grade}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Chart Section */}
                <Card className="border border-gray-200 hover:shadow-xl transition">
                    <CardHeader>
                        <CardTitle>📊 Subject-wise Marks</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={grades}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="subject" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="marks" fill="#6366F1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
