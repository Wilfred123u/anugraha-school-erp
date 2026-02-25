"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStudent() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    standard: "",
    section: "",
    dob: "",
    father: "",
    phone: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:5000/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Student Added Successfully");
    router.push("/students");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10">

      <div className="container">

        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "600px" }}>
          
          <h2 className="text-center mb-4 fw-bold text-primary">
            🎓 Add New Student
          </h2>

          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                name="name"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Standard</label>
              <input
                name="standard"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Section</label>
              <input
                name="section"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Father Name</label>
              <input
                name="father"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                name="phone"
                className="form-control"
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="text-center mt-4">
            <button
              onClick={handleSubmit}
              className="btn btn-primary px-5"
            >
              ➕ Add Student
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}