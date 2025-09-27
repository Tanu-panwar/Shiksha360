import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import {
  Landmark,

} from "lucide-react"

export function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-8">
      {/* <h1 className="text-3xl font-bold text-blue-900">Student Dashboard</h1> */}
      {/* Row 1: Core Student Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Assignments Received"
          description="Total assigned this month"
          value="18"
          color="text-blue-700"
          trend="↑ 4 from last month"
        />
        <MetricCard
          title="Assignments Submitted"
          description="Completed by student"
          value="14"
          color="text-green-700"
          trend="↑ 2 from last month"
        />
        <MetricCard
          title="Pending Assignments"
          description="Due soon"
          value="4"
          color="text-red-700"
          trend="↓ 1 from last week"
        />
      </div>

      {/* Row 2: Attendance & Meals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Attendance This Month"
          description="Present days"
          value="21/25"
          color="text-purple-700"
          trend="↑ 2 from last month"
        />
        <MetricCard
          title="Mid-Day Meals Taken"
          description="This month"
          value="19"
          color="text-yellow-700"
          trend="↑ 3 from last month"
        />
        <MetricCard
          title="Meals Skipped"
          description="Missed days"
          value="6"
          color="text-teal-700"
          trend="↓ 1 from last month"
        />
      </div>

      {/* Row 3: Assignment Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Timeline</CardTitle>
          <CardDescription>Due dates & status</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <AssignmentTimeline data={assignmentData} /> */}
        </CardContent>
      </Card>

      {/* Row 4: Government Schemes & Eligibility */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-gray-700" />
            Quick Actions
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>📥 Download Report Card</li>
            <li>📅 View Upcoming Assignments</li>
            <li>📊 Check Attendance Summary</li>
          </ul>
        </div>

        {/* Government Activities */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🏛️ Government Activities</h2>
          <ul className="space-y-4">
            <li className="bg-white p-3 rounded-md border-l-4 border-indigo-500 shadow-sm">
              <h3 className="font-medium text-indigo-700">Digital India Scholarship 2024</h3>
              <p className="text-sm text-gray-600">Eligible ✅</p>
            </li>
            <li className="bg-white p-3 rounded-md border-l-4 border-green-500 shadow-sm">
              <h3 className="font-medium text-green-700">Free Uniform Scheme</h3>
              <p className="text-sm text-gray-600">Eligible ✅</p>
            </li>
            <li className="bg-white p-3 rounded-md border-l-4 border-red-500 shadow-sm">
              <h3 className="font-medium text-red-700">Cycle Distribution Program</h3>
              <p className="text-sm text-gray-600">Not Eligible ❌</p>
            </li>
          </ul>
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