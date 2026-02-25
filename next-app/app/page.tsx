import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">

      {/* NAVBAR */}
      <nav className="backdrop-blur-md bg-white/30 border-b border-white/20 
      shadow-lg p-4 flex justify-between items-center sticky top-0 z-50">

        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text 
        bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600">
          🎓 Anugraha School ERP
        </h1>

        <div className="space-x-8 font-semibold text-gray-800">
          <Link href="/students" className="hover:text-purple-600 transition">
            Students
          </Link>
          <Link href="/staff" className="hover:text-purple-600 transition">
            Staff
          </Link>
          <Link href="/fees" className="hover:text-purple-600 transition">
            Fees
          </Link>
          <Link href="/users" className="hover:text-purple-600 transition">
            Users
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-6">

        <h2 className="text-6xl font-extrabold text-transparent bg-clip-text 
        bg-gradient-to-r from-purple-700 to-pink-600 mb-6">
          Welcome to Anugraha ERP
        </h2>

        <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
          A smart digital platform to manage students, staff, attendance,
          academics, finances and school administration effortlessly.
        </p>

      </section>

      {/* DASHBOARD CARDS */}
      <section className="grid md:grid-cols-3 gap-10 px-10 pb-20">

        {/* STUDENTS */}
        <Link href="/students">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 
          text-white p-10 rounded-3xl shadow-xl hover:scale-105 
          hover:shadow-2xl transition cursor-pointer">

            <h3 className="text-3xl font-bold mb-3">👩‍🎓 Students</h3>
            <p className="opacity-90">
              Admissions, academic records, attendance & performance.
            </p>

          </div>
        </Link>

        {/* STAFF */}
        <Link href="/staff">
          <div className="bg-gradient-to-br from-green-400 to-blue-500 
          text-white p-10 rounded-3xl shadow-xl hover:scale-105 
          hover:shadow-2xl transition cursor-pointer">

            <h3 className="text-3xl font-bold mb-3">👨‍🏫 Staff</h3>
            <p className="opacity-90">
              Manage teachers, roles, attendance and payroll.
            </p>

          </div>
        </Link>

        {/* FEES */}
        <Link href="/fees">
          <div className="bg-gradient-to-br from-pink-500 to-red-500 
          text-white p-10 rounded-3xl shadow-xl hover:scale-105 
          hover:shadow-2xl transition cursor-pointer">

            <h3 className="text-3xl font-bold mb-3">💰 Fees</h3>
            <p className="opacity-90">
              Fee collection, reports, dues tracking and receipts.
            </p>

          </div>
        </Link>

      </section>

    </main>
  );
}