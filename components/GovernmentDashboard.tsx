
import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    User, ScrollText,
    School,
    Users,
    GraduationCap,
    Activity,
    UserCheck,
    BarChart3,
    LineChart,
    PieChart,
    BookOpenCheck,
    AlertTriangle,
    Clock,
    CheckCircle,
    BadgeIndianRupee,
    CalendarCheck2
} from "lucide-react";

function MetricCard({
    title,
    description,
    value,
    icon,
    color,
    trend,
}: {
    title: string;
    description: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    trend: string;
}) {
    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <div className="text-right">{icon}</div>
            </CardHeader>
            <CardContent>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground">{trend}</p>
            </CardContent>
        </Card>
    );
}

export default function GovernmentDashboard() {
    return (
        <div className="p-6 space-y-10">
            <h1 className="text-3xl font-bold text-blue-900">Government Schools Dashboard</h1>

            {/* Section 1: Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Students Enrolled"
                    description="Across all institutions"
                    value="12,450"
                    icon={<User className="w-5 h-5 text-blue-600" />}
                    color="text-blue-700"
                    trend="↑ 3% from last month"
                />
                <MetricCard
                    title="Total Teachers Registered"
                    description="Verified teaching staff"
                    value="1,320"
                    icon={<UserCheck className="w-5 h-5 text-green-600" />}
                    color="text-green-700"
                    trend="↑ 2% from last month"
                />
                <MetricCard
                    title="Total Institutions"
                    description="Govt schools & colleges"
                    value="540"
                    icon={<School className="w-5 h-5 text-purple-600" />}
                    color="text-purple-700"
                    trend="↑ 5 new this month"
                />
                <MetricCard
                    title="Parents Connected"
                    description="Via parent portal"
                    value="8,900"
                    icon={<Users className="w-5 h-5 text-yellow-600" />}
                    color="text-yellow-700"
                    trend="↑ 4% engagement"
                />
                <MetricCard
                    title="Scholarships Granted"
                    description="This academic year"
                    value="2,150"
                    icon={<GraduationCap className="w-5 h-5 text-indigo-600" />}
                    color="text-indigo-700"
                    trend="↑ ₹12L disbursed"
                />
                <MetricCard
                    title="Active Users"
                    description="Today / This Month"
                    value="1,240 / 9,800"
                    icon={<Activity className="w-5 h-5 text-teal-600" />}
                    color="text-teal-700"
                    trend="↑ 6% usage spike"
                />
            </div>

            <div className="w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Announcements & Notifications</CardTitle>
                        <CardDescription>Updates for primary government schools (Class 1–8)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-gray-700">
                        {/* Government Circulars */}
                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
                            <ScrollText className="w-5 h-5 text-blue-600" />
                            <div>
                                <h4 className="font-semibold text-blue-800">Mid-Day Meal Hygiene Guidelines updated</h4>
                                <p className="text-gray-600">New hygiene protocols effective from October</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
                            <ScrollText className="w-5 h-5 text-blue-600" />
                            <div>
                                <h4 className="font-semibold text-blue-800">Uniform Distribution Schedule for Term 2</h4>
                                <p className="text-gray-600">District-wise rollout begins next week</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
                            <ScrollText className="w-5 h-5 text-blue-600" />
                            <div>
                                <h4 className="font-semibold text-blue-800">Attendance Digitization Pilot</h4>
                                <p className="text-gray-600">Launching in select districts from October</p>
                            </div>
                        </div>

                        {/* Exams & Policy Changes */}
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-md px-4 py-3">
                            <CalendarCheck2 className="w-5 h-5 text-green-600" />
                            <div>
                                <h4 className="font-semibold text-green-800">Class 5 & 8 Assessments: 10–15 Nov</h4>
                                <p className="text-gray-600">Board-style evaluation across all blocks</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-md px-4 py-3">
                            <CalendarCheck2 className="w-5 h-5 text-green-600" />
                            <div>
                                <h4 className="font-semibold text-green-800">FLN Survey begins 1st October</h4>
                                <p className="text-gray-600">Tracking foundational literacy & numeracy</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-md px-4 py-3">
                            <CalendarCheck2 className="w-5 h-5 text-green-600" />
                            <div>
                                <h4 className="font-semibold text-green-800">Teacher Training Portal login by 5th Oct</h4>
                                <p className="text-gray-600">Mandatory for all primary school teachers</p>
                            </div>
                        </div>

                        {/* Scholarship Deadlines */}
                        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-md px-4 py-3">
                            <BadgeIndianRupee className="w-5 h-5 text-yellow-600" />
                            <div>
                                <h4 className="font-semibold text-yellow-800">Pre-Matric Scholarship (SC/ST)</h4>
                                <p className="text-gray-600">Apply by 20th October</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-md px-4 py-3">
                            <BadgeIndianRupee className="w-5 h-5 text-yellow-600" />
                            <div>
                                <h4 className="font-semibold text-yellow-800">Girls’ Incentive Scheme (Class 6–8)</h4>
                                <p className="text-gray-600">Last date 15th October</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-md px-4 py-3">
                            <BadgeIndianRupee className="w-5 h-5 text-yellow-600" />
                            <div>
                                <h4 className="font-semibold text-yellow-800">Local NGO Merit Awards</h4>
                                <p className="text-gray-600">Nominations open till 30th September</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section 2 & 3: Analytics + Institution Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Analytics & Graphs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Analytics & Graphs</CardTitle>
                        <CardDescription>District-wise performance insights</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-gray-700">
                        <div className="flex items-start gap-3">
                            <BarChart3 className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                                <h4 className="font-semibold">Performance Overview</h4>
                                <p>Average student performance by district/state</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <LineChart className="w-5 h-5 text-green-600 mt-1" />
                            <div>
                                <h4 className="font-semibold">Attendance Trends</h4>
                                <p>Month-wise attendance % comparison</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <PieChart className="w-5 h-5 text-red-600 mt-1" />
                            <div>
                                <h4 className="font-semibold">Dropout Rate Analysis</h4>
                                <p>% of dropouts region-wise</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <BookOpenCheck className="w-5 h-5 text-purple-600 mt-1" />
                            <div>
                                <h4 className="font-semibold">Skill Development Metrics</h4>
                                <p>Students engaged in extra learning/courses</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Institution Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle>Institution Insights</CardTitle>
                        <CardDescription>School performance & approval status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-gray-700">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                                <h4 className="font-semibold">Top Performing Institutions</h4>
                                <p>Schools/colleges with highest academic metrics</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                            <div>
                                <h4 className="font-semibold">Low-Performing Institutions</h4>
                                <p>Schools needing intervention and support</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-600 mt-1" />
                            <div>
                                <h4 className="font-semibold">Pending Approvals</h4>
                                <p>Institutions awaiting verification or onboarding</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}