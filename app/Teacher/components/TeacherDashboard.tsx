"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BookOpenText,
  CheckSquare,
  FilePlus,
  BarChart2,
  Clock,
  Users,
} from "lucide-react";
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

type TeacherDashboardProps = {
  teacher: any;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  setSelectedAssignment?: React.Dispatch<React.SetStateAction<any>>;
};

export default function TeacherDashboard({
  teacher,
  setActiveTab = () => {},
  setSelectedAssignment = () => {},
}: TeacherDashboardProps) {

  /* ------------------ CHART DATA (DUMMY) ------------------ */
  const performanceData = {
    labels: ["Class 6", "Class 7", "Class 8"],
    datasets: [
      {
        label: "Average Score (%)",
        data: [72, 78, 84],
        backgroundColor: "#3B82F6",
      },
      {
        label: "Attendance (%)",
        data: [88, 92, 95],
        backgroundColor: "#10B981",
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  /* ------------------ ACTIVITY (DUMMY) ------------------ */
  const activities = [
    {
      icon: <BookOpenText className="w-5 h-5 text-blue-600" />,
      text: "Math Assignment submitted – Class 8",
      time: "Today, 10:30 AM",
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-green-600" />,
      text: "Attendance marked – Class 7",
      time: "Today, 9:00 AM",
    },
    {
      icon: <Users className="w-5 h-5 text-purple-600" />,
      text: "New student added to Class 6",
      time: "Yesterday",
    },
  ];

  return (
    <div className="p-6 space-y-8">

      {/* ================= METRICS (DUMMY) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="My Classes"
          description="Currently teaching"
          value="3"
          color="text-indigo-700"
          trend="Class 6, 7 & 8"
        />
        <MetricCard
          title="Total Students"
          description="Across your classes"
          value="92"
          color="text-blue-700"
          trend="↑ 4 new students"
        />
        <MetricCard
          title="Pending Reviews"
          description="Assignments to check"
          value="11"
          color="text-red-700"
          trend="Due today"
        />
      </div>

      {/* ================= SCHEDULE + PERFORMANCE ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Teaching Schedule</CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Class 6 – Mathematics (9:00 AM)",
              "Class 7 – Science (11:00 AM)",
              "Class 8 – Mathematics (1:30 PM)",
            ].map((cls, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-md border bg-gray-50"
              >
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-800">{cls}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>Attendance & marks overview</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <Bar data={performanceData} options={chartOptions} />
          </CardContent>
        </Card>
      </section>

      {/* ================= ACTIVITY + QUICK ACTIONS ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Class Activity</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.map((act, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  {act.icon}
                  <span className="text-sm">{act.text}</span>
                </div>
                <span className="text-xs text-gray-400">{act.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Teacher Actions</CardTitle>
            <CardDescription>Daily teaching tools</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {[
              { icon: FilePlus, label: "Create Assignment" },
              { icon: CheckSquare, label: "Mark Attendance" },
              { icon: BookOpenText, label: "Upload Notes" },
              { icon: BarChart2, label: "View Reports" },
            ].map((a, i) => (
              <div
                key={i}
                className="p-4 border rounded-lg text-center hover:bg-gray-100 cursor-pointer"
              >
                <a.icon className="mx-auto mb-2 text-indigo-600" />
                <p className="text-sm font-medium">{a.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

/* ---------------- METRIC CARD ---------------- */
function MetricCard({
  title,
  description,
  value,
  color,
  trend,
}: any) {
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
