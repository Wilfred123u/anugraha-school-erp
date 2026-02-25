"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// 1. Define the correct school hierarchy
const CLASS_ORDER = [
  "Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "Others"
];

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [openClass, setOpenClass] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then(setStudents);
  };

  // 2. Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFor) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`http://localhost:5000/student/photo/${uploadingFor}`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        fetchStudents(); // Refresh list to show new photo
        alert("Photo updated successfully!");
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // 3. Logic: Grouping and Normalizing (fixes "Nursary" vs "Nursery")
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (sectionFilter ? s.section === sectionFilter : true)
  );

  const grouped = filtered.reduce((acc: any, s: any) => {
    let cls = s.standard || "Others";
    // Normalize Nursery spelling
    if (cls.toLowerCase().includes("nurs")) cls = "Nursery";
    
    acc[cls] = acc[cls] || [];
    acc[cls].push(s);
    return acc;
  }, {});

  // 4. Sort the keys based on our CLASS_ORDER list
  const sortedClassKeys = Object.keys(grouped).sort((a, b) => {
    const indexA = CLASS_ORDER.indexOf(a);
    const indexB = CLASS_ORDER.indexOf(b);
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  return (
    <div className="min-h-screen bg-fixed bg-gradient-to-tr from-[#1e1b4b] via-[#4338ca] to-[#7c3aed] p-6 md:p-12">
      
      {/* Hidden File Input for Photos */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handlePhotoUpload}
      />

      {/* 3D Glass Header */}
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <img src="/logo.jpg" alt="Logo" className="relative w-20 h-20 rounded-full border-2 border-white/50 object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase">Anugraha School</h1>
            <p className="text-white/60 text-sm">Nursery to Class 12 • Management Portal</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/students/add")}
          className="bg-yellow-400 hover:bg-white text-yellow-900 font-black px-8 py-4 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all active:scale-95"
        >
          + ADD NEW STUDENT
        </button>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <input
          type="text"
          placeholder="🔍 Search Student Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:col-span-2 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 outline-none focus:ring-2 ring-yellow-400"
        />
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white outline-none"
        >
          <option className="text-gray-800" value="">All Sections</option>
          <option className="text-gray-800" value="A">Section A</option>
          <option className="text-gray-800" value="B">Section B</option>
        </select>
      </div>

      {/* Sorted Class List */}
      <div className="max-w-7xl mx-auto space-y-6">
        {sortedClassKeys.map((cls) => (
          <div key={cls}>
            <button
              onClick={() => setOpenClass(openClass === cls ? null : cls)}
              className={`w-full flex items-center justify-between p-7 rounded-3xl transition-all duration-500 ${
                openClass === cls 
                ? "bg-white text-indigo-900 shadow-2xl scale-[1.01]" 
                : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              <span className="text-2xl font-black uppercase tracking-tight">
                {isNaN(Number(cls)) ? cls : `Class ${cls}`}
              </span>
              <div className="flex items-center gap-4">
                <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold">
                  {grouped[cls].length} STUDENTS
                </span>
                <span>{openClass === cls ? "▲" : "▼"}</span>
              </div>
            </button>

            {openClass === cls && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 pb-10">
                {grouped[cls].map((s: any) => (
                  <div
                    key={s.reg_no}
                    className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-8 shadow-2xl hover:bg-white/15 transition-all"
                  >
                    <div className="flex flex-col items-center">
                      {/* Photo Section with Upload Provision */}
                      <div className="relative w-28 h-28 mb-4">
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-500 p-1 shadow-2xl">
                          {s.photo ? (
                            <img
                              src={`http://localhost:5000/photos/${s.photo}`}
                              className="w-full h-full rounded-full object-cover border-4 border-white"
                            />
                          ) : (
                            <div className="w-full h-full bg-indigo-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              NO PHOTO
                            </div>
                          )}
                        </div>
                        {/* Quick Add Photo Button */}
                        <button 
                          onClick={() => { setUploadingFor(s.reg_no); fileInputRef.current?.click(); }}
                          className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                          title="Upload Photo"
                        >
                          📷
                        </button>
                      </div>

                      <h3 className="text-xl font-black text-white uppercase tracking-wider">{s.name}</h3>
                      <p className="text-yellow-400 text-xs font-bold mb-6">SEC {s.section} • REG #{s.reg_no}</p>

                      <div className="grid grid-cols-3 gap-2 w-full">
                        <button onClick={() => router.push(`/student/${s.reg_no}`)} className="bg-white/10 hover:bg-white hover:text-indigo-900 text-white p-2 rounded-xl text-[10px] font-bold uppercase transition-colors">View</button>
                        <button onClick={() => router.push(`/students/edit/${s.reg_no}`)} className="bg-white/10 hover:bg-yellow-400 hover:text-yellow-900 text-white p-2 rounded-xl text-[10px] font-bold uppercase transition-colors">Edit</button>
                        <button className="bg-red-500/20 hover:bg-red-500 text-white p-2 rounded-xl text-[10px] font-bold uppercase transition-colors">Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}