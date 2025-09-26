
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, FileUp } from "lucide-react";

export default function AddAssignment() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">➕ Add New Assignment</h1>
                <p className="text-gray-600 text-sm">
                    Create and assign homework/tasks to your students easily.
                </p>
            </div>

            {/* Form Card */}
            <Card className="shadow-sm border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-700">
                        Assignment Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Assignment Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Algebra Homework - Chapter 5"
                            className="mt-1"
                        />
                    </div>

                    {/* Subject & Class */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="e.g. Mathematics"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="class">Class</Label>
                            <Input
                                id="class"
                                placeholder="e.g. Class 8A"
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <div className="relative mt-1">
                            <Input id="dueDate" type="date" className="pl-10" />
                            <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Description / Instructions</Label>
                        <Textarea
                            id="description"
                            placeholder="Write assignment instructions..."
                            className="mt-1"
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <Label htmlFor="fileUpload">Attach File (Optional)</Label>
                        <div className="flex items-center gap-3 mt-1">
                            <Input
                                id="fileUpload"
                                type="file"
                                className="cursor-pointer"
                            />
                            <FileUp className="w-5 h-5 text-gray-500" />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Save Assignment
                        </Button>
                        <Button variant="outline">Reset</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
