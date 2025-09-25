
'use client';

export default function FinishMathTask() {
    return (
        <div className="bg-gradient-to-br from-blue-200 to-blue-400 p-18">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-10 shadow-lg">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">Finish 2 Math Exercises</h1>
                <p className="text-gray-800 mb-4">
                    Complete the following exercises from your Math textbook:
                    <ul className="list-disc list-inside mt-2">
                        <li>Chapter 5 — Exercise 1</li>
                        <li>Chapter 5 — Exercise 2</li>
                    </ul>
                </p>
                <p>Make sure to revise important formulas and time yourself for practice!</p>
            </div>
        </div>
    );
}
