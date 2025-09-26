
"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Users, CheckCircle, AlertCircle, FileText, Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MidDayMeal() {
    const [classes] = useState([
        { name: "Class 8A", students: 32, served: 30 },
        { name: "Class 7B", students: 28, served: 28 },
        { name: "Class 6C", students: 30, served: 25 },
    ])

    const [menu] = useState([
        { day: "Monday", meal: "Rice, Dal, Sabzi, Salad" },
        { day: "Tuesday", meal: "Chapati, Paneer Curry, Veg Salad" },
        { day: "Wednesday", meal: "Khichdi, Curd, Salad" },
        { day: "Thursday", meal: "Rice, Chicken Curry, Veg Salad" },
        { day: "Friday", meal: "Chapati, Mixed Veg Curry, Salad" },
    ])

    const [stock] = useState([
        { item: "Rice", quantity: "50 kg" },
        { item: "Dal", quantity: "20 kg" },
        { item: "Vegetables", quantity: "30 kg" },
        { item: "Paneer", quantity: "10 kg" },
        { item: "Milk", quantity: "40 liters" },
    ])

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">🍽️ Mid-Day Meal Dashboard</h1>
                    <p className="text-gray-600 text-sm">Track meals, student participation, menu, and stock</p>
                </div>
                <Button className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
                    <Plus className="w-4 h-4" />
                    Add Menu / Stock
                </Button>
            </div>

            {/* Daily Meal Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls, idx) => {
                    const status = cls.served === cls.students ? "Completed" : cls.served > 0 ? "Partial" : "Missed"
                    const statusColor = status === "Completed" ? "bg-green-100 text-green-700"
                        : status === "Partial" ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"

                    return (
                        <Card key={idx} className="hover:shadow-lg transition border border-gray-200">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">{cls.name}</CardTitle>
                                <CardDescription>{cls.students} Students</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className={`px-2 py-1 rounded-full text-sm font-medium w-max ${statusColor}`}>
                                    {status} ({cls.served}/{cls.students})
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Weekly Menu */}
            <h2 className="text-xl font-semibold text-gray-800 mt-6">📅 Weekly Menu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.map((m, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition border border-gray-200">
                        <CardHeader>
                            <CardTitle>{m.day}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{m.meal}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Stock / Inventory */}
            <h2 className="text-xl font-semibold text-gray-800 mt-6">📦 Stock & Inventory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stock.map((s, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition border border-gray-200">
                        <CardHeader>
                            <CardTitle>{s.item}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{s.quantity}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
