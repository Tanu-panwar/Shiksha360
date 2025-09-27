
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { FileText, Download } from "lucide-react";

const PerformanceReports = () => {
    const [filter, setFilter] = useState("monthly");

    // Sample data
    const performanceData = [
        { month: "Jan", attendance: 85, performance: 75 },
        { month: "Feb", attendance: 88, performance: 78 },
        { month: "Mar", attendance: 90, performance: 80 },
        { month: "Apr", attendance: 82, performance: 70 },
        { month: "May", attendance: 87, performance: 76 },
    ];

    const dropoutData = [
        { name: "Active Students", value: 85 },
        { name: "Dropouts", value: 15 },
    ];

    const COLORS = ["#4CAF50", "#F44336"];

    return (
        <div className="p-6">
            {/* Page Title */}
            <h1 className="text-2xl font-bold mb-6">📊 Performance & Reports</h1>

            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border px-4 py-2 rounded-lg"
                >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                </select>

                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Download className="w-5 h-5 mr-2" /> Download Report
                </button>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Attendance & Performance Chart */}
                <div className="bg-white p-4 shadow-lg rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Attendance vs Performance</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="attendance" stroke="#8884d8" />
                            <Line type="monotone" dataKey="performance" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Dropout Rate */}
                <div className="bg-white p-4 shadow-lg rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Dropout Rate</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dropoutData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                dataKey="value"
                            >
                                {dropoutData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Reports Section */}
            <div className="bg-white p-4 mt-6 shadow-lg rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Generated Reports</h2>
                <ul className="space-y-3">
                    <li className="flex items-center justify-between border-b pb-2">
                        <span className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-600 mr-2" />
                            Student Performance Report – May 2025
                        </span>
                        <button className="text-blue-600 hover:underline">Download</button>
                    </li>
                    <li className="flex items-center justify-between border-b pb-2">
                        <span className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-600 mr-2" />
                            Attendance Analysis – Q1 2025
                        </span>
                        <button className="text-blue-600 hover:underline">Download</button>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-600 mr-2" />
                            Dropout Trends Report – 2024
                        </span>
                        <button className="text-blue-600 hover:underline">Download</button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default PerformanceReports;
