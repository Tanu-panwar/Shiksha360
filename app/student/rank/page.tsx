
'use client';

export default function RankPage() {
    return (
        <div className="bg-gradient-to-br from-blue-200 to-blue-400 p-18">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-16 shadow-lg text-center">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">Your Rank & Percentile</h1>
                <p className="text-xl font-semibold text-gray-700 mb-4">
                    Congratulations! You are in the <span className="text-blue-700">Top 20%</span> of your class.
                </p>
                <p className="text-gray-600 mb-6">Your current rank is <strong>15</strong> out of 75 students.</p>
                <div className="relative bg-blue-200 rounded-full h-8 w-full">
                    <div className="bg-blue-700 h-8 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <p className="mt-4 text-gray-600">
                    Keep up the great work! Aim for Top 10% by completing your assignments on time.
                </p>
            </div>
        </div>
    );
}
