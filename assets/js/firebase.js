import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLmOnmu5eX9ajMeokj0exd0Lj1VKDlWq4",
    authDomain: "schooluniform-3c22f.firebaseapp.com",
    databaseURL: "https://schooluniform-3c22f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "schooluniform-3c22f",
    storageBucket: "schooluniform-3c22f.appspot.com",
    messagingSenderId: "394652404706",
    appId: "1:394652404706:web:5fa039465092a97a0047bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getDatabase();

export const PAGES = {
  HOME_PAGE: './index.html',
  LOGIN_PAGE: './auth.html'
}

// ------------------------
// OnAuthStateChange
// ------------------------
onAuthStateChanged(auth, async (user) => {
  const currentPage = location.pathname;
  const isAuthPage = currentPage.includes('auth')

  if (user) {
    // Handle Auth Pages
    if (isAuthPage) {
      location.href = PAGES.HOME_PAGE;
    }
  }
  // Otherwise redirect to Auth Pages
  else { if (!isAuthPage) location.href = PAGES.LOGIN_PAGE; }
});

// ------------------------
// Log om function
// ------------------------

function signIn(email, pass) {
  processingMessage("Logging in...")
  signInWithEmailAndPassword(auth, email, pass)
  .then(() => {})
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    failMessage(errorMessage)
  });
}
window.signIn = signIn

// ------------------------
// Log out function
// ------------------------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    await logOut()
  });
}
async function logOut() {
  await signOut(auth);
  location.href = PAGES.LOGIN_PAGE;
}
window.logOut = logOut

// ------------------------
// Swal Messages
// ------------------------
import * as Swal from '../../vendor/swal.js'

window.failMessage = (err) => {
  return Sweetalert2.fire({
    icon: "error",
    title: "Oops...",
    text: err || "Something went wrong!",
  });
}

window.successMessage = (msg) => {
  return Sweetalert2.fire({
    icon: "success",
    title: "Success!",
    text: msg || "Thank you for reaching out to us!",
  });
}

window.processingMessage = (msg) => {
  return Sweetalert2.fire({
    iconHtml: '<div class="spinner-border text-primary"></div>',
    customClass: { icon: 'no-border' },
    title: "Processing",
    text: msg || "Please wait, processing...",
    allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
    showConfirmButton: false,
    backdrop: 'rgba(0,0,0,.65)'
  });
}

window.closeSwal = () => {
  Sweetalert2.close()
}


// ------------------------
// Firebase CRUD
// ------------------------

// Function to read data from the database
window.readData = async (dbPath) => {
  const dbRef = ref(db, dbPath);
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error reading data:", error);
    return null;
  }
}

// Function to write data to the database
window.writeData = async (dbPath, data) => {
  const dbRef = ref(db, dbPath);
  try {
    await set(dbRef, data);
    // await logChange(dbPath, "created", data); // Logging the creation
    console.log("Data written successfully!");
    return true;
  } catch (error) {
    console.error("Error writing data:", error);
    return false;
  }
}
window.writeDataWithNewId = async (dbPath, data) => {
  const baseRef = ref(db, dbPath);
  const dbRef = push(baseRef);
  try {
    await set(dbRef, data);
    console.log("Data written successfully!");
    return true;
  } catch (error) {
    console.error("Error writing data:", error);
    return false;
  }
}

const schoolNameMap = {
  "1": "Memorial",
  "2": "Matriculation"
}
window.schoolNameMap = schoolNameMap
