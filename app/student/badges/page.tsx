
'use client';

import Link from 'next/link';

const badges = [
    {
        id: 'attendance',
        name: 'Perfect Attendance',
        description: 'Awarded for 100% attendance in a semester',
        emoji: '📅',
        colorClass: 'bg-green-100 text-green-800',
    },
    {
        id: 'math-star',
        name: 'Math Star',
        description: 'Outstanding performance in Mathematics',
        emoji: '⭐',
        colorClass: 'bg-yellow-100 text-yellow-800',
    },
    {
        id: 'science-whiz',
        name: 'Science Whiz',
        description: 'Excellent scores in Science quizzes',
        emoji: '🔬',
        colorClass: 'bg-blue-100 text-blue-800',
    },
    {
        id: 'community-helper',
        name: 'Community Helper',
        description: 'Participation in school community activities',
        emoji: '🤝',
        colorClass: 'bg-purple-100 text-purple-800',
    },
];

export default function BadgesPage() {
    return (
        <div className="bg-gradient-to-br from-blue-200 to-blue-400 p-18">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg">
                <h1 className="text-3xl font-bold text-blue-700 mb-8">Your Badges</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {badges.map((badge) => (
                        <Link
                            key={badge.id}
                            href={`/student/badges/${badge.id}`}
                            className={`cursor-pointer rounded-xl p-6 shadow-lg hover:shadow-2xl transition bg-opacity-70 ${badge.colorClass} flex flex-col items-center text-center`}
                        >
                            <span className="text-6xl mb-4">{badge.emoji}</span>
                            <h2 className="text-xl font-semibold mb-1">{badge.name}</h2>
                            <p className="text-sm text-gray-800">{badge.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
