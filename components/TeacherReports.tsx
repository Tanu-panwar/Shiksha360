
'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart2, Users, FileText, Utensils } from "lucide-react";

export default function TeacherReports() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">📊 Reports</h1>
            <p className="text-gray-600 text-sm">View overall statistics and performance metrics</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition border border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" /> Attendance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 text-sm">Class-wise attendance overview.</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition border border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-600" /> Assignments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 text-sm">Submitted vs pending assignments.</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition border border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-yellow-600" /> Mid-Day Meal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 text-sm">Meals served per class.</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition border border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-purple-600" /> Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 text-sm">Average grades & skill progression.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
