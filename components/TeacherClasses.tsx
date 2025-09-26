
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Users, BookOpen, Calendar, FileText } from "lucide-react";

export default function TeacherClasses({ setActiveTab, setSelectedClass }) {
    // Dummy class data – API se fetch karoge toh ye dynamic ho jayega
    const classes = [
        {
            name: "Class 8A",
            subject: "Mathematics",
            students: 32,
            schedule: "Mon–Fri, 9:00–9:45 AM",
            assignments: 4,
        },
        {
            name: "Class 7B",
            subject: "Science",
            students: 28,
            schedule: "Mon–Fri, 10:00–10:45 AM",
            assignments: 3,
        },
        {
            name: "Class 6C",
            subject: "English",
            students: 30,
            schedule: "Mon–Fri, 11:00–11:45 AM",
            assignments: 2,
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800">📘 My Classes</h1>
            <p className="text-gray-600 text-sm">
                Overview of all classes you are currently handling
            </p>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls, idx) => (
                    <Card
                        key={idx}
                        className="hover:shadow-lg transition border border-gray-200"
                    >
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {cls.name}
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                    {cls.subject}
                                </span>
                            </CardTitle>
                            <CardDescription>{cls.schedule}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Users className="w-4 h-4 text-blue-600" />
                                {cls.students} Students
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <FileText className="w-4 h-4 text-green-600" />
                                {cls.assignments} Pending Assignments
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                {cls.schedule}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex gap-3 mt-3">
                                <button className="px-3 py-1 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition" onClick={() => {
                                    setSelectedClass(cls);
                                    setActiveTab("class-details");
                                }}>
                                    View Class
                                </button>
                                <button className="px-3 py-1 text-xs rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition" onClick={() => setActiveTab("add-assignment")}>
                                    Add Assignment
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
