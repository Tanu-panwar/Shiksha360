export default function Home() {
  const roles = [
    {
      title: "Student",
      description:
        "Apna padhai aur career progress track karega.",
    },
    {
      title: "Parent",
      description:
        "Apne bacche ki progress aur govt schemes ka update dekhega.",
    },
    {
      title: "Teacher / Govt",
      description:
        "Data aur reports manage karega.",
    },
  ];

  const workflowSteps = [
    {
      step: "1. Student Side",
      points: [
        "Student login karta hai (simple app ya school ID se).",
        "Usko ek Dashboard dikhta hai jisme Subjects ka progress, Skill tests/assignments ke results, Career suggestions (AI ya rules ke base pe) hote hain.",
        "Offline hone par bhi data save ho jayega aur internet aate hi sync ho jayega.",
      ],
    },
    {
      step: "2. Parent Side",
      points: [
        "Parent ko ek simplified app / SMS / IVR call se updates milte hain.",
        "Progress updates jaise 'Aapke bacche ne is week Science me 70% progress kiya.' milenge.",
        "Sarkari scholarship ke updates milenge.",
        "Local language (Hindi/Punjabi) me updates aayenge.",
      ],
    },
    {
      step: "3. Teacher / Govt Side",
      points: [
        "Teacher ya admin ek web portal use karega.",
        "Attendance, test scores, progress reports monitor karega.",
        "Jo bachche peeche hain unko flag karega.",
        "Govt programs like scholarship, health checkups, digital library access integrate honge.",
      ],
    },
  ];

  const smartFeatures = [
    "AI Guidance: Student ke performance ke base pe career suggestions.",
    "Career Pathways: 10th/12th ke baad ka roadmap suggest karega.",
    "Multilingual + Voice Support: Rural parents ke liye easy samajhna.",
    "Offline-first: Internet na ho tab bhi chale.",
  ];

  return (
    <main className="min-h-screen bg-blue-50 p-8 font-sans text-gray-800">
      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Welcome to Shiksha360! <span className="text-red-500">&hearts;</span>
        </h1>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-700">
          Shiksha360 – What’s Happening Inside
        </h2>
        <p className="mb-6 leading-relaxed">
          Shiksha360 ek digital ecosystem hai jo 3 logon ko connect karta hai:
        </p>
        <ul className="mb-8 space-y-3">
          {roles.map(({ title, description }) => (
            <li key={title} className="flex space-x-3">
              <div className="font-semibold text-blue-600 w-32">{title} –</div>
              <p>{description}</p>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mb-3 text-indigo-700">
          ⚡ Workflow (Step by Step)
        </h3>
        <div className="space-y-6 mb-8">
          {workflowSteps.map(({ step, points }) => (
            <div key={step}>
              <h4 className="font-bold text-blue-600 mb-2">{step}</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-3 text-indigo-700">4. Smart Features</h3>
        <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
          {smartFeatures.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>

        <p className="italic font-medium text-gray-600">
          🔄 Overall Flow in One Line: <br />
          Student data → Shiksha360 → Parent ko updates + Teacher ko reports → Govt schemes integrate → AI se career guidance.
        </p>

        <p className="mt-8 font-semibold text-blue-800">
          Ye basically ek hub ban raha hai jaha ek student ki poori education journey track hoti hai, parents informed rehte hain, teachers monitor karte hain, aur govt schemes auto-connect hoti hain.
        </p>
      </section>
    </main>
  );
}
