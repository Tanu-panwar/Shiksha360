"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button";

type StudentDashboardProps = {
    setActiveTab?: React.Dispatch<React.SetStateAction<string>>
    setSelectedClass?: React.Dispatch<React.SetStateAction<any>>
}

export default function StudentDashboard({
    setActiveTab = () => { },
    setSelectedClass = () => { },
}: StudentDashboardProps) {
    const { user } = useAuth()
    const router = useRouter()

    const [schemes, setSchemes] = useState<any[]>([]);
    const [loadingSchemes, setLoadingSchemes] = useState(true);
    const [openSchemeDialog, setOpenSchemeDialog] = useState(false);
    const [selectedScheme, setSelectedScheme] = useState<any>(null);
    const [activeScheme, setActiveScheme] = useState<any>(null);
    // 🔐 PROTECT ROUTE
    useEffect(() => {
        const token = localStorage.getItem("shiksha-token")
        if (!token || !user || user.role !== "STUDENT") {
            router.push("/")
        }
    }, [user, router])

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

    return (
        <div className="p-6 space-y-8">

            {/* DASHBOARD METRICS */}
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
                    description="Completed by you"
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
                                        className={`p-3 mb-2 rounded-md cursor-pointer transition ${selectedScheme?._id === sch._id
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
    )
}

function MetricCard({ title, description, value, color, trend }: any) {
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
    )
}
