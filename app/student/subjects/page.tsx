
'use client';

import Link from 'next/link';

const subjects = [
    { id: 'math', name: 'Mathematics', emoji: '🧮' },
    { id: 'science', name: 'Science', emoji: '🔬' },
    { id: 'english', name: 'English', emoji: '📚' },
    { id: 'history', name: 'History', emoji: '🏺' },
    { id: 'geography', name: 'Geography', emoji: '🌍' },
];

export default function SubjectsPage() {
    return (
        <div className="bg-gradient-to-br from-blue-200 to-blue-400 p-18">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg">
                <h1 className="text-3xl font-bold text-blue-700 mb-8">Your Subjects</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                        <Link
                            key={subject.id}
                            href={`/student/subjects/${subject.id}`}
                            className="bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center shadow-md hover:shadow-xl transition cursor-pointer"
                        >
                            <span className="text-6xl">{subject.emoji}</span>
                            <h2 className="mt-4 text-xl font-semibold text-blue-700">{subject.name}</h2>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
