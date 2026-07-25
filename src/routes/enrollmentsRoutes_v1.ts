import { Router, type Request, type Response } from "express";
import { students, courses } from "../db/db.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const courseNo = req.query.courseNo as string | undefined;
  const searchID = req.query.studentId as string | undefined;

  if ((!courseNo && !searchID) || (courseNo && searchID)) {
  return res.status(200).json({
    ok: false,
    message: "Please provide either studentId or courseNo and not both!",
  });
}

  if (courseNo) {
    const filter_Course = students
  .filter((x) => x.courses?.includes(courseNo))
  .map((x) => ({
    studentId: x.studentId,
    firstName: x.firstName,
    lastName: x.lastName,
    program: x.program,
  }));
    return res.status(200).json({
      ok: true,
      student: filter_Course,
    });
  } else if (searchID) {
    const student = students.find((x) => x.studentId === searchID);

    if (!student) {
      return res.status(404).json({
        ok: false,
        message: "Student not found",
      });
    }

    const StuCourses = (student.courses ?? [])
      .map((cId) => courses.find((c) => c.courseId === cId))
      .filter((c) => c !== undefined)
      .map((c) => ({
        courseId: c!.courseId,
        title: c!.courseTitle,
      }));

    return res.status(200).json({
      ok: true,
      courses: StuCourses,
    });
  }

  return res.status(200).json({
    ok: true,
    student: students,
  });
});

export default router;