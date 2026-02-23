"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function TeacherDashboard() {
  const { user } = useAuth();

  // STATES
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [openSchemeDialog, setOpenSchemeDialog] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  // FETCH GOVERNMENT SCHEMES
  useEffect(() => {
    fetch("/api/schemes")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setSchemes(result.data);
        setLoadingSchemes(false);
      })
      .catch((err) => {
        console.error("Failed to fetch schemes", err);
        setLoadingSchemes(false);
      });
  }, []);

  // SAMPLE ACTIVITY FEED
  const activityFeed = [
    {
      icon: <BookOpenText className="w-5 h-5 text-blue-600" />,
      text: "Math Assignment submitted by Class 8A",
      status: "Completed",
      note: "Students have submitted the homework",
      time: "Today, 10:15 AM",
      isScheme: false,
    },
    {
      icon: <School className="w-5 h-5 text-green-600" />,
      text: "Attendance marked for Class 7B",
      status: "Completed",
      note: "All students present today",
      time: "Today, 9:00 AM",
      isScheme: false,
    },
    {
      icon: <Utensils className="w-5 h-5 text-yellow-600" />,
      text: "Mid-day meal distribution",
      status: "Completed",
      note: "Meal distributed to all students",
      time: "Yesterday, 12:30 PM",
      isScheme: false,
    },
    {
      icon: <Megaphone className="w-5 h-5 text-red-600 animate-pulse" />,
      text: "New govt scheme notification",
      status: "New",
      note: "Click here to know more",
      time: "Just now",
      isScheme: true,
    },
  ];

  // CHART DATA
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

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="p-6 space-y-8">
      {/* ROW 1: METRICS */}
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

      {/* ROW 2: MID-DAY MEAL & REVIEWS */}
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

      {/* ROW 3: PERFORMANCE + ACTIVITY */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Performance Trends</CardTitle>
            <CardDescription>Monthly overview (Jan–Jun)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
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
                className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                onClick={() => item.isScheme && setOpenSchemeDialog(true)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm font-medium text-gray-800">{item.text}</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.status === "New" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600">{item.note}</div>
                <div className="text-[10px] text-gray-400 mt-1">{item.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ROW 4: QUICK ACTIONS + GOVERNMENT ACTIVITIES */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-gray-700" />
            Quick Actions
          </h2>
          <ul className="space-y-3">
            {[
              { icon: FilePlus, title: "Add Assignment", desc: "Create assignments by class & subject" },
              { icon: ImagePlus, title: "Upload Photos", desc: "Share class activity snapshots" },
              { icon: CheckSquare, title: "Mark Attendance", desc: "Daily student attendance" },
              { icon: FileText, title: "Upload Policy", desc: "Share updated school policies" },
              { icon: Megaphone, title: "Send Announcement", desc: "Notify students & parents" },
              { icon: BarChart2, title: "Generate Report", desc: "Performance & attendance reports" },
            ].map((action, i) => (
              <li
                key={i}
                className="bg-white hover:bg-gray-100 p-3 rounded-md border border-gray-300 cursor-pointer transition flex items-start gap-3"
              >
                <action.icon className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🏛️ Government Activities</h2>
          <ul className="space-y-4">
            {[
              { title: "Digital India Scholarship 2024", desc: "Govt. scholarship for meritorious students", color: "indigo-500" },
              { title: "Mid-Day Meal Quality Check", desc: "Weekly nutrition assessment", color: "green-500" },
              { title: "Parent-Teacher Meeting", desc: "Scheduled for next week", color: "yellow-500" },
              { title: "Sports Day Preparation", desc: "Coordination with sports committee", color: "red-500" },
            ].map((act, i) => (
              <li key={i} className={`bg-white p-3 rounded-md border-l-4 border-${act.color} shadow-sm`}>
                <h3 className={`font-medium text-${act.color}`}>{act.title}</h3>
                <p className="text-sm text-gray-600">{act.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* GOVT SCHEMES DIALOG */}
      <Dialog open={openSchemeDialog} onOpenChange={setOpenSchemeDialog}>
        <DialogContent className="max-w-4xl max-h-[650px] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Government Schemes & Notifications</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[520px]">
            {/* LEFT: SCHEME LIST */}
            <div className="overflow-y-auto p-2 border-r">
              {loadingSchemes && schemes.length === 0 ? (
                <p className="text-sm text-gray-500">Loading schemes...</p>
              ) : schemes.length === 0 ? (
                <p className="text-sm text-gray-500">No schemes found.</p>
              ) : (
                schemes.map((sch) => (
                  <div
                    key={sch._id}
                    onClick={() => setSelectedScheme(sch)}
                    className={`p-3 mb-2 rounded-md cursor-pointer transition ${
                      selectedScheme?._id === sch._id
                        ? "bg-indigo-50 border-indigo-500 border"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-semibold text-gray-800">{sch.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{sch.description}</p>
                    <div className="text-xs text-gray-400 mt-1">{sch.fieldType?.toUpperCase()} • {sch.status}</div>
                  </div>
                ))
              )}
            </div>

            {/* RIGHT: SCHEME DETAILS */}
            <div className="overflow-y-auto p-4">
              {!selectedScheme ? (
                <div className="flex h-full items-center justify-center text-gray-400 text-center">
                  <p>Select a scheme to view details</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-indigo-700">{selectedScheme.title}</h3>
                  <p className="text-sm text-gray-600"><strong>Category:</strong> {selectedScheme.fieldType || "N/A"}</p>
                  <p className="text-sm text-gray-600"><strong>Status:</strong> {selectedScheme.status || "N/A"}</p>
                  <p className="text-sm text-gray-600"><strong>Eligibility:</strong> {selectedScheme.eligibility || "N/A"}</p>
                  <p className="text-sm text-gray-600"><strong>Deadline:</strong> {selectedScheme.deadline || "N/A"}</p>
                  <hr />
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedScheme.description}</p>
                  <div className="flex gap-3 mt-4">
                    <Button variant="default">Apply / More</Button>
                    <Button variant="outline" onClick={() => setSelectedScheme(null)}>Back to list</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <div className="flex justify-end w-full">
              <Button onClick={() => setOpenSchemeDialog(false)}>Close</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- MetricCard Component ---------- */
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
