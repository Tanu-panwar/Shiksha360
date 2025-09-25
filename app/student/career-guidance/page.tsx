
'use client';

const careers = [
    {
        name: 'Engineering',
        skills: ['Math', 'Physics', 'Problem Solving'],
        description: 'Build and design machines, software, structures, and more.',
    },
    {
        name: 'Data Science',
        skills: ['Statistics', 'Programming', 'Machine Learning'],
        description: 'Analyze data to gain insights and build intelligent systems.',
    },
    {
        name: 'Finance',
        skills: ['Accounting', 'Economics', 'Analytical Thinking'],
        description: 'Manage money, investments and budgets in various industries.',
    },
];

export default function CareerGuidancePage() {
    return (
        <div className="bg-gradient-to-br from-blue-200 to-blue-400 p-18">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 shadow-lg">
                <h1 className="text-3xl font-bold text-blue-700 mb-8">Explore Career Options</h1>
                {careers.map((career) => (
                    <section key={career.name} className="mb-8 p-6 bg-blue-50 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{career.name}</h2>
                        <p className="mb-3">{career.description}</p>
                        <p className="mb-1 font-semibold">Key Skills Required:</p>
                        <ul className="list-disc list-inside">
                            {career.skills.map((skill) => (
                                <li key={skill}>{skill}</li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}
