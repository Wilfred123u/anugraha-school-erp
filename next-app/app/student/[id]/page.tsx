"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditStudent() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    standard: "",
    section: "",
    dob: "",
    father: "",
    phone: "",
  });

  // Fetch student data
  useEffect(() => {
    fetch(`http://localhost:5000/student/${id}`)
      .then(res => res.json())
      .then(data => setForm(data));
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateStudent = async () => {
    await fetch(`http://localhost:5000/student/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Student Updated Successfully");
    router.push("/students");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10">

      <div className="container">

        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "600px" }}>
          
          <h2 className="text-center mb-4 fw-bold text-success">
            ✏️ Edit Student
          </h2>

          <div className="row g-3">

            <div className="col-md-6">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Standard</label>
              <input
                name="standard"
                value={form.standard}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Section</label>
              <input
                name="section"
                value={form.section}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob || ""}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Father Name</label>
              <input
                name="father"
                value={form.father}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                className="form-control"
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="text-center mt-4">
            <button
              onClick={updateStudent}
              className="btn btn-success px-5"
            >
              ✅ Update Student
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}