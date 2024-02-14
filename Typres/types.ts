export interface Chapter {
    id: number;
    module_id: number;
    title: string;
  }
  
  export interface Course {
    course_id: number;
    course_name: string;
    description: string;
    instructor_id: number;
  }
  
  export interface Instructor {
    instructor_id: number;
    instructor_name: string;
    speciality: string;
  }
  
  export interface Module {
    course: number;
    description: string;
    id: number;
    order: number;
    title: string;
  }
  
  export interface Test {
    chapter_id: number;
    options: string[];
    question: string;
    test_id: number;
    theCorrectAnswer: string;
  }
  
  export interface User {
    email: string;
    name: string;
    password: string;
    profile: string;
  }
  
  export interface Data {
    chapters: { [key: string]: Chapter };
    courses: { [key: string]: Course };
    instructors: { [key: string]: Instructor };
    modules: { [key: string]: Module };
    tests: { [key: string]: Test };
    utilisateurs: { [key: string]: User };
  }
  

  