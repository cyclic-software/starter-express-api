const { query, collection, where, getDocs } = require("firebase/firestore");
const db = require("./firestore.js");

// const docRef = query(collection(db, 'utilisateurs'));

// // You can't use `await` outside of an async function, so wrap your code in an async function
// (async () => {
//   try {
//     const querySnapshot = await getDocs(docRef);

//     querySnapshot.forEach((doc) => {
//       console.log(doc.id, " => ", doc.data());
//     });
//   } catch (e) {
//     console.log("No such document! ", e);
//   }
// })();

const getUsers = async () => {
  const docRef = query(collection(db, "utilisateurs"));
  const querySnapshot = await getDocs(docRef);
  let users = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};

const getIntructors = async () => {
  const docRef = query(collection(db, "instructor"));
  const querySnapshot = await getDocs(docRef);
  let instructors = [];
  querySnapshot.forEach((doc) => {
    instructors.push([doc.id, doc.data()]);
  });
  return instructors;
};

const getCourses = async (instructor = null) => {
  const docRef =
    instructor === null
      ? query(collection(db, "courses"))
      : query(collection(db, "courses"), where("instructor_id", "==", 1));
  const querySnapshot = await getDocs(docRef);
  let courses = [];
  querySnapshot.forEach((doc) => {
    courses.push(doc.data());
  });
  return courses;
};

const getModules = async (courseId) => {
  const docRef = query(
    collection(db, "modules"),
    where("course", "==", +courseId)
  );

  const querySnapshot = await getDocs(docRef);
  let modules = [];
  querySnapshot.forEach((doc) => {
    modules.push(doc.data());
  });
  return modules.sort((a, b) => a.id - b.id);
};

const getChapters = async (moduleId = 1) => {
  const docRef = query(
    collection(db, "chapters"),
    where("module_id", "==", +moduleId)
  );
  const querySnapshot = await getDocs(docRef);
  let chapters = [];
  if (querySnapshot.empty) return  false;

  querySnapshot.forEach((doc) => {
    chapters.push(doc.data());
  });
  return chapters.sort((a, b) => a.id - b.id);
};


const isUser = async (email, password) => {
  try {
    const usersRef = collection(db, "utilisateurs");
    const querySnapshot = await getDocs(
      query(usersRef, where("email", "==", email))
    );

    if (querySnapshot.empty) {
      return { found: false };
    } else {
      const userData = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      };
      if (userData.password === password) return { ...userData, found: true };
      else return { found: false };
    }
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};



const getTests = async (chapterId = 1) => {
  const docRef = query(collection(db, "tests"));
  const querySnapshot = await getDocs(docRef);
  let tests = [];
  querySnapshot.forEach((doc) => {
    tests.push(doc.data());
  });
  return tests.sort((a, b) => a.test_id - b.test_id);
};



module.exports = {
  getUsers,
  getCourses,
  isUser,
  getModules,
  getChapters,
  getTests,
};
