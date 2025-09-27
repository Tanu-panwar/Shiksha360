
'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Utensils, Apple, Drumstick, Salad } from "lucide-react";

const meals = [
    {
        day: "Monday",
        menu: ["Rice & Dal", "Chapati & Mix Veg", "Salad"],
        calories: "550 kcal",
    },
    {
        day: "Tuesday",
        menu: ["Pulao", "Chole & Chapati", "Fruit"],
        calories: "600 kcal",
    },
    {
        day: "Wednesday",
        menu: ["Khichdi", "Paneer Curry", "Curd"],
        calories: "580 kcal",
    },
    {
        day: "Thursday",
        menu: ["Veg Biryani", "Dal Tadka", "Salad"],
        calories: "610 kcal",
    },
    {
        day: "Friday",
        menu: ["Rajma Rice", "Chapati & Veg", "Sweet Dish"],
        calories: "590 kcal",
    },
];

export default function StudentMidDayMeal() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">🍲 Mid-Day Meal</h1>
            <p className="text-gray-600 text-sm">
                Check your weekly meal schedule & nutrition info
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal, index) => (
                    <Card
                        key={index}
                        className="border border-gray-200 hover:shadow-xl transition hover:scale-[1.02] duration-200"
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Utensils className="w-5 h-5 text-orange-500" /> {meal.day}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <ul className="list-disc pl-4 text-sm text-gray-700">
                                {meal.menu.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <p className="text-xs text-gray-600 mt-2">
                                🔥 Calories: <span className="font-semibold">{meal.calories}</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Extra: Meal Attendance */}
            <Card className="border border-gray-200 hover:shadow-xl transition">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Apple className="w-5 h-5 text-green-600" /> Meal Attendance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
                        <div className="p-3 bg-green-50 rounded-lg shadow-sm">
                            <p className="font-semibold text-gray-800">Monday</p>
                            <p className="text-gray-600">28/30 Students</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg shadow-sm">
                            <p className="font-semibold text-gray-800">Tuesday</p>
                            <p className="text-gray-600">27/30 Students</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg shadow-sm">
                            <p className="font-semibold text-gray-800">Wednesday</p>
                            <p className="text-gray-600">29/30 Students</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg shadow-sm">
                            <p className="font-semibold text-gray-800">Thursday</p>
                            <p className="text-gray-600">26/30 Students</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
