"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Landmark, Megaphone } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function StudentDashboard() {
  const { user } = useAuth();

  const [schemes, setSchemes] = useState([]);
  const [openSchemesDialog, setOpenSchemesDialog] = useState(false);
  const [activeScheme, setActiveScheme] = useState(null);

  useEffect(() => {
    fetch("/api/schemes")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setSchemes(result.data);
      })
      .catch((err) => console.error("Failed to fetch schemes", err));
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Row 1: Dashboard Stats */}
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

      {/* Row 4: Quick Actions & Government Schemes */}
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

        {/* Government Schemes stat box */}
        <div
          className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => setOpenSchemesDialog(true)}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-red-600 animate-pulse" />
            🏛️ Government Schemes For You
          </h2>
          <p className="text-sm text-gray-600">
            tap to view all available government schemes based on your eligibility
          </p>
        </div>
      </section>

      {/* GOVT SCHEMES DIALOG */}
      <Dialog open={openSchemesDialog} onOpenChange={() => setOpenSchemesDialog(false)}>
        <DialogContent className="max-w-4xl max-h-[600px] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-indigo-700 text-xl mb-2">
              Government Schemes & Notifications
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
            {/* LEFT — LIST */}
            <div className="overflow-y-auto pr-2 border-r">
              {schemes.length > 0 ? (
                schemes.map((scheme) => (
                  <div
                    key={scheme._id}
                    className={`p-3 mb-2 rounded-md border cursor-pointer transition ${
                      activeScheme?._id === scheme._id
                        ? "bg-indigo-50 border-indigo-500"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveScheme(scheme)}
                  >
                    <h3 className="font-semibold text-gray-800">{scheme.title}</h3>
                    <p className="text-xs text-gray-500">
                      {scheme.fieldType.toUpperCase()} • {scheme.status}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No schemes available.</p>
              )}
            </div>

            {/* RIGHT — DETAILS */}
            <div className="overflow-y-auto pl-2">
              {activeScheme ? (
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-indigo-700">
                    {activeScheme.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <strong>Category:</strong> {activeScheme.fieldType}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {activeScheme.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Eligibility:</strong> {activeScheme.eligibility || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Deadline:</strong> {activeScheme.deadline || "N/A"}
                  </p>
                  <hr />
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {activeScheme.description}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center text-gray-400 text-sm h-full">
                  Select any scheme to view complete details →
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({ title, description, value, color, trend }) {
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
