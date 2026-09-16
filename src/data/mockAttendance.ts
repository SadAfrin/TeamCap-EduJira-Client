export type MockStudent = {
  _id: string;
  studentId: string;
  name: string;
  className: string;
  section: string;
};

const firstNames = [
  "Rahim", "Karim", "Fatima", "Ayesha", "Nusrat", "Tanvir", "Imran", "Sadia",
  "Farhan", "Meherun", "Shakil", "Rumana", "Nayeem", "Mim", "Sabbir",
  "Nabila", "Rakib", "Taslima", "Ovi", "Jannatul", "Hasib", "Sumaiya",
  "Arafat", "Priya", "Zahid",
];
const lastNames = [
  "Uddin", "Ahmed", "Islam", "Khan", "Jahan", "Hasan", "Kabir", "Rahman",
  "Ali", "Nesa", "Hossain", "Akter", "Chowdhury", "Ferdous", "Das",
];

export const CLASSES = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);
export const SECTIONS = ["A", "B"];

// Deterministic dummy roster generator, same output every time (no randomness issues on reload)
export function generateMockStudents(): MockStudent[] {
  const students: MockStudent[] = [];
  let counter = 1;

  CLASSES.forEach((className, classIndex) => {
    SECTIONS.forEach((section, sectionIndex) => {
      const studentsPerSection = 5;
      for (let i = 0; i < studentsPerSection; i++) {
        const nameIndex = (classIndex * 2 + sectionIndex * 5 + i) % firstNames.length;
        const surnameIndex = (classIndex + sectionIndex + i) % lastNames.length;
        students.push({
          _id: `mock-${counter}`,
          studentId: `24-${100 + classIndex * 10 + sectionIndex * 5 + i}`,
          name: `${firstNames[nameIndex]} ${lastNames[surnameIndex]}`,
          className,
          section,
        });
        counter++;
      }
    });
  });

  return students;
}

export const MOCK_STUDENTS = generateMockStudents();