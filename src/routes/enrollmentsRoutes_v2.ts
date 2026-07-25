import { Router, type Request, type Response } from "express";
import { enrollments, students } from "../db/db.js";

const router = Router();

router.delete("/", (req: Request, res: Response) => {
  const { studentId, courseNo } = req.body;

  const enrollmentIndex = enrollments.findIndex(
    (enrollment) =>
      enrollment.studentId === studentId &&
      enrollment.courseId === courseNo
  );

  if (enrollmentIndex === -1) {
    return res.status(404).json({
      ok: false,
      message: "Enrollment does not exist",
    });
  }

  enrollments.splice(enrollmentIndex, 1);

  const student = students.find(
    (student) => student.studentId === studentId
  );

  if (student && student.courses) {
    student.courses = student.courses.filter(
      (id) => id !== courseNo
    );
  }

  return res.status(200).json({
    ok: true,
    message: "Enrollment has been deleted",
  });
});

export default router;