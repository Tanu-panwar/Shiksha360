
'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, FileText, Calendar } from "lucide-react";

export default function ClassDetails({ selectedClass, setActiveTab }) {
    if (!selectedClass) return <div className="p-6 text-gray-500">No class selected</div>;

    return (
        <div className="p-6 space-y-6">
            <button
                onClick={() => setActiveTab("classes")}
                className="px-3 py-1 text-xs rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
                ← Back to Classes
            </button>

            <h1 className="text-2xl font-bold text-gray-800">{selectedClass.name} 📘</h1>
            <p className="text-gray-600 text-sm">{selectedClass.subject}</p>

            <Card className="border border-gray-200">
                <CardHeader>
                    <CardTitle>Class Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="w-4 h-4 text-blue-600" />
                        Students: {selectedClass.students}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FileText className="w-4 h-4 text-green-600" />
                        Pending Assignments: {selectedClass.assignments}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        Schedule: {selectedClass.schedule}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
