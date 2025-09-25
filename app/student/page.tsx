
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function StudentHomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 to-blue-600">

            {/* Main content area */}
            <main className="flex-grow container mx-auto px-6 py-10 max-w-6xl">
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-3xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center space-x-5 mb-8">
                        <Image
                            src="/student_avatar.png"
                            width={64}
                            height={64}
                            alt="Student Avatar"
                            className="rounded-full"
                        />
                        <h1 className="text-3xl font-bold text-blue-800">
                            Hello, Ravi <span role="img" aria-label="wave">👋</span>
                        </h1>
                    </div>

                    {/* Overall Progress */}
                    <section className="mb-10">
                        <p className="font-semibold text-gray-700 mb-3">Overall Progress</p>
                        <div className="relative w-full bg-blue-100 rounded-full h-6 shadow-inner overflow-hidden">
                            <div className="absolute top-0 left-0 h-6 bg-blue-700 rounded-full transition-all duration-700" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-gray-500 mt-2">65% Complete</p>
                    </section>

                    {/* Stats cards */}
                    <section className="grid grid-cols-3 gap-6 mb-12 cursor-pointer">
                        <Link href="/student/subjects" className="bg-blue-50 rounded-xl text-center p-5 shadow-md hover:shadow-lg transition">
                            <div className="text-5xl">📚</div>
                            <p className="font-semibold mt-3 text-gray-700">5 Subjects</p>
                        </Link>

                        <Link href="/student/badges" className="bg-blue-50 rounded-xl text-center p-5 shadow-md hover:shadow-lg transition">
                            <div className="text-5xl text-yellow-600">🏅</div>
                            <p className="font-semibold mt-3 text-gray-700">12 Badges</p>
                        </Link>

                        <Link href="/student/rank" className="bg-blue-50 rounded-xl text-center p-5 shadow-md hover:shadow-lg transition">
                            <div className="text-5xl text-yellow-800">🏆</div>
                            <p className="font-semibold mt-3 text-gray-700">Top 20%</p>
                        </Link>
                    </section>

                    {/* Daily tasks */}
                    <section className="bg-blue-50 rounded-xl p-7 shadow-md mb-12">
                        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                            <span className="text-blue-700">🔵</span>
                            <span>Daily Tasks</span>
                        </h2>
                        <ul className="list-disc list-inside text-gray-800 space-y-2">
                            <li>
                                <Link href="/student/tasks/finish-math" className="hover:underline line-through text-green-600">
                                    Finish 2 Math exercises
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/tasks/read-science" className="hover:underline">
                                    Read Science Chapter 3
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/tasks/practice-english" className="hover:underline">
                                    Practice 5 English words
                                </Link>
                            </li>
                        </ul>
                    </section>

                    {/* Career tip */}
                    <section className="bg-blue-50 rounded-xl p-7 shadow-md">
                        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                            <span className="text-yellow-500">💡</span>
                            <span>Career Tip of the Day</span>
                        </h2>
                        <p className="text-gray-800 mb-4">
                            You are doing great in Mathematics! <span role="img" aria-label="star">⭐</span> Explore careers in Engineering, Data Science or Finance.
                        </p>
                        <Link href="/student/career-guidance" className="text-blue-700 font-semibold hover:underline">
                            Explore More &rarr;
                        </Link>
                    </section>
                </div>
            </main>
        </div>
    );
}
