"use client";
import { useState } from "react";
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
import { Calendar } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import Swal from "sweetalert2"; // <-- ADDED

export default function AddScheme({ setActiveTab }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    schemeName: "",
    description: "",
    fieldType: "",
    eligibility: "",
    deadline: "",
    status: "",
  });

  const handleReset = () => {
    setFormData({
      schemeName: "",
      description: "",
      fieldType: "",
      eligibility: "",
      deadline: "",
      status: "",
    });
  };

  const handleSubmit = async () => {
    // validation check
    if (
      !formData.schemeName ||
      !formData.description ||
      !formData.fieldType ||
      !formData.eligibility ||
      !formData.deadline ||
      !formData.status
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please fill all required fields before submitting.",
      });
    }

    setLoading(true);
    try {
      await axios.post("/api/schemes", {
        title: formData.schemeName,
        description: formData.description,
        fieldType: formData.fieldType,
        eligibility: formData.eligibility,
        deadline: formData.deadline,
        status: formData.status,
      });

      Swal.fire({
        icon: "success",
        title: "🎉 Scheme Added Successfully!",
        text: "The scheme has been saved in the system.",
        confirmButtonColor: "#4F46E5",
      });

      handleReset();

      // 👇 After success go back to schemes list page
      if (setActiveTab) setActiveTab("schemes");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Save",
        text: error.response?.data?.error || "Something went wrong!",
      });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Scheme</h1>
        <p className="text-gray-600 text-sm">
          Upload and manage government schemes for public access and review.
        </p>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Scheme Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="schemeName">Scheme Name</Label>
            <Input
              id="schemeName"
              value={formData.schemeName}
              onChange={(e) =>
                setFormData({ ...formData, schemeName: e.target.value })
              }
              placeholder="e.g. Pradhan Mantri Awas Yojana"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief overview of the scheme..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="fieldType">Field / Type</Label>
            <Select
              value={formData.fieldType}
              onValueChange={(value) =>
                setFormData({ ...formData, fieldType: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="employment">Employment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="eligibility">Eligibility Criteria</Label>
            <Textarea
              id="eligibility"
              value={formData.eligibility}
              onChange={(e) =>
                setFormData({ ...formData, eligibility: e.target.value })
              }
              placeholder="Who can apply for this scheme?"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="deadline">Application Deadline</Label>
            <div className="relative mt-1">
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="pl-10"
              />
              <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Scheme"}
            </Button>

            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
