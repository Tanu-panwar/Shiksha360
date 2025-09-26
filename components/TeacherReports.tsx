
'use client'
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart2, Users, FileText, Utensils } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const classData = {
    "Class 8A": { attendance: 90, assignments: 25, meals: 32, performance: 85 },
    "Class 7B": { attendance: 88, assignments: 28, meals: 28, performance: 82 },
    "Class 6C": { attendance: 92, assignments: 10, meals: 30, performance: 78 },
    "Class 9D": { attendance: 85, assignments: 15, meals: 25, performance: 80 },
    "Class 10E": { attendance: 87, assignments: 20, meals: 27, performance: 88 },
    "Class 8F": { attendance: 89, assignments: 18, meals: 29, performance: 83 },
};

export default function TeacherReports() {
    const [selectedClass, setSelectedClass] = useState("Class 8A");
    const chartInfo = classData[selectedClass];

    const chartData = [
        { name: "Attendance", value: chartInfo.attendance },
        { name: "Assignments", value: chartInfo.assignments },
        { name: "Meals", value: chartInfo.meals },
        { name: "Performance", value: chartInfo.performance },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">📊 Reports</h1>
            <p className="text-gray-600 text-sm">View overall statistics and performance metrics</p>

            {/* Class Selector */}
            <div className="mb-4">
                <label className="text-gray-700 font-medium mr-2">Select Class:</label>
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {Object.keys(classData).map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {["Attendance", "Assignments", "Meals", "Performance"].map((item) => (
                    <Card
                        key={item}
                        className="hover:shadow-xl transition-transform transform hover:scale-105 border border-gray-200"
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {item === "Attendance" && <Users className="w-5 h-5 text-blue-600" />}
                                {item === "Assignments" && <FileText className="w-5 h-5 text-green-600" />}
                                {item === "Meals" && <Utensils className="w-5 h-5 text-yellow-600" />}
                                {item === "Performance" && <BarChart2 className="w-5 h-5 text-purple-600" />}
                                {item}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData.filter(c => c.name === item)}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#6366F1" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}


// 'use client'
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { BarChart2, Users, FileText, Utensils } from "lucide-react";

// export default function TeacherReports() {
//     return (
//         <div className="p-6 space-y-6">
//             <h1 className="text-2xl font-bold text-gray-800">📊 Reports</h1>
//             <p className="text-gray-600 text-sm">View overall statistics and performance metrics</p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <Card className="hover:shadow-lg transition border border-gray-200">
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <Users className="w-5 h-5 text-blue-600" /> Attendance
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-gray-700 text-sm">Class-wise attendance overview.</p>
//                     </CardContent>
//                 </Card>

//                 <Card className="hover:shadow-lg transition border border-gray-200">
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <FileText className="w-5 h-5 text-green-600" /> Assignments
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-gray-700 text-sm">Submitted vs pending assignments.</p>
//                     </CardContent>
//                 </Card>

//                 <Card className="hover:shadow-lg transition border border-gray-200">
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <Utensils className="w-5 h-5 text-yellow-600" /> Mid-Day Meal
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-gray-700 text-sm">Meals served per class.</p>
//                     </CardContent>
//                 </Card>

//                 <Card className="hover:shadow-lg transition border border-gray-200">
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <BarChart2 className="w-5 h-5 text-purple-600" /> Performance
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-gray-700 text-sm">Average grades & skill progression.</p>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     )
// }
