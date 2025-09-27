import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    FilePlus,
    ImagePlus,
    CheckSquare,
    FileText,
    Megaphone,
    BarChart2,
    Landmark,
    BookOpenText,
    School,
    Utensils,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom",
            labels: {
                boxWidth: 12,
                font: { size: 12 },
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { stepSize: 10 },
        },
    },
};

const performanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
        {
            label: "Overall Performance",
            data: [78, 82, 85, 80, 88, 90],
            backgroundColor: "#3B82F6",
        },
        {
            label: "Assignment Scores",
            data: [72, 75, 78, 74, 80, 83],
            backgroundColor: "#10B981",
        },
        {
            label: "Attendance Rate",
            data: [90, 92, 89, 94, 96, 95],
            backgroundColor: "#06B6D4",
        },
    ],
};

export function TeacherDashboard() {
    const { user } = useAuth();

    const activityFeed = [
        {
            icon: <BookOpenText className="w-5 h-5 text-blue-600" />,
            text: "Math Assignment submitted by Class 8A",
            status: "Completed",
            note: "Students have submitted the homework",
            time: "Today, 10:15 AM",
        },
        {
            icon: <School className="w-5 h-5 text-green-600" />,
            text: "Attendance marked for Class 7B",
            status: "Completed",
            note: "All students present today",
            time: "Today, 9:00 AM",
        },
        {
            icon: <Utensils className="w-5 h-5 text-yellow-600" />,
            text: "Mid-day meal distribution",
            status: "Completed",
            note: "Meal distributed to all students",
            time: "Yesterday, 12:30 PM",
        },
        {
            icon: <Megaphone className="w-5 h-5 text-red-600 animate-pulse" />,
            text: "New govt scheme notification",
            status: "New",
            note: "Click here to know more",
            time: "Just now",
        },
    ];

    return (
        <div className="p-6 space-y-8">
            {/* <h1 className="text-3xl font-bold text-blue-900">Teacher Dashboard</h1> */}
            {/* Row 1: Core Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Students"
                    description="Across 5 classes"
                    value="156"
                    color="text-blue-700"
                    trend="↑ 2% from last month"
                />
                <MetricCard
                    title="Active Classes"
                    description="Currently teaching"
                    value="3"
                    color="text-purple-700"
                    trend="↑ 1 from last month"
                />
                <MetricCard
                    title="Today's Attendance"
                    description="Live attendance rate"
                    value="94%"
                    color="text-green-700"
                    trend="↑ 2% from last month"
                />
            </div>

            {/* Row 2: Mid-Day Meal & Reviews */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Pending Reviews"
                    description="Assignments to grade"
                    value="12"
                    color="text-red-700"
                    trend="↑ 3 from last month"
                />
                <MetricCard
                    title="Mid-Day Meals Served"
                    description="Today’s distribution"
                    value="145"
                    color="text-yellow-700"
                    trend="↑ 2 from yesterday"
                />
                <MetricCard
                    title="Meal Attendance Rate"
                    description="Weekly average"
                    value="89%"
                    color="text-teal-700"
                    trend="↑ 1% from last month"
                />
            </div>

            {/* Row 3: Performance & Activity */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Student Performance Trends</CardTitle>
                        <CardDescription>Monthly overview (Jan–Jun)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-74 w-full">
                            <Bar data={performanceData} options={chartOptions} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates from your classes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activityFeed.map((item, idx) => (
                            <div
                                key={idx}
                                className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-sm font-medium text-gray-800">
                                            {item.text}
                                        </span>
                                    </div>
                                    <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === "New"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-600">{item.note}</div>
                                <div className="text-[10px] text-gray-400 mt-1">
                                    {item.time}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>

            {/* Dual Section: Quick Actions + Government Activities */}
            <section className="w-full px-4 py-6 md:px-8 lg:px-12 bg-white rounded-lg shadow-md mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Quick Actions */}
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Landmark className="w-5 h-5 text-gray-700" />
                            Quick Actions
                        </h2>
                        <ul className="space-y-3">
                            <li className="bg-white hover:bg-gray-100 p-3 rounded-md border border-gray-300 cursor-pointer transition flex items-start gap-3">
                                <FilePlus className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-800">Add Assignment</p>
                                    <p className="text-xs text-gray-500">Create assignments by class & subject</p>
                                </div>
                            </li>
                            <li className="bg-white hover:bg-gray-100 p-3 rounded-md border border-gray-300 cursor-pointer transition flex items-start gap-3">
                                <ImagePlus className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-800">Upload Photos</p>
                                    <p className="text-xs text-gray-500">Share class activity snapshots</p>
                                </div>
                            </li>
                            <li className="bg-white hover:bg-gray-100 p-3 rounded-md border border-gray-300 cursor-pointer transition flex items-start gap-3">
                                <CheckSquare className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-800">Mark Attendance</p>
                                    <p className="text-xs text-gray-500">Daily student attendance</p>
                                </div>
                            </li>
                            <li className="bg-white hover:bg-gray-100 p-3 rounded-md border border-gray-300 cursor-pointer transition flex items-start gap-3">
                                <FileText className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-800">Upload Policy</p>
                                    <p className="text-xs text-gray-500">Share updated school policies</p>
                                </div>
                            </li>
                            <li className="bg-white hover:bg-gray-100 p-3 rounded-md border border-gray-300 cursor-pointer transition flex items-start gap-3">
                                <Megaphone className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-800">Send Announcement</p>
                                    <p className="text-xs text-gray-500">Notify students & parents</p>
                                </div>
                            </li>
                            <li className="bg-white hover:bg-gray-100 p-3 rounded-md border border-gray-300 cursor-pointer transition flex items-start gap-3">
                                <BarChart2 className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-800">Generate Report</p>
                                    <p className="text-xs text-gray-500">Performance & attendance reports</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Government Activities */}
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">🏛️ Government Activities</h2>
                        <ul className="space-y-4">
                            <li className="bg-white p-3 rounded-md border-l-4 border-indigo-500 shadow-sm">
                                <h3 className="font-medium text-indigo-700">Digital India Scholarship 2024</h3>
                                <p className="text-sm text-gray-600">Govt. scholarship for meritorious students.</p>
                                <span className="text-xs text-gray-500">Priority: High • Tag: Government Scheme</span>
                            </li>
                            <li className="bg-white p-3 rounded-md border-l-4 border-green-500 shadow-sm">
                                <h3 className="font-medium text-green-700">Mid-Day Meal Quality Check</h3>
                                <p className="text-sm text-gray-600">Weekly nutrition assessment.</p>
                                <span className="text-xs text-gray-500">Priority: Low • Tag: Health</span>
                            </li>
                            <li className="bg-white p-3 rounded-md border-l-4 border-yellow-500 shadow-sm">
                                <h3 className="font-medium text-yellow-700">Parent-Teacher Meeting</h3>
                                <p className="text-sm text-gray-600">Scheduled for next week.</p>
                                <span className="text-xs text-gray-500">Priority: Medium</span>
                            </li>
                            <li className="bg-white p-3 rounded-md border-l-4 border-red-500 shadow-sm">
                                <h3 className="font-medium text-red-700">Sports Day Preparation</h3>
                                <p className="text-sm text-gray-600">Coordination with sports committee.</p>
                                <span className="text-xs text-gray-500">Priority: Medium</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Reusable Metric Card Component
function MetricCard({
    title,
    description,
    value,
    color,
    trend,
}: {
    title: string;
    description: string;
    value: string;
    color: string;
    trend: string;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground">{trend}</p>
            </CardContent>
        </Card>
    );
}