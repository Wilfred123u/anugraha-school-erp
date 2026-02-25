import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  reg_no: String,
  name: String,
  standard: String,
  section: String,
  dob: String,
  father: String,
  phone: String,
  photo: String,
});

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);