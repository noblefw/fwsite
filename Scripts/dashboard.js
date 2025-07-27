import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDj7-wG_XPGFLSI0ZFEIia-q9QjwIlFlxI",
  authDomain: "fantasywriters-e7c64.firebaseapp.com",
  projectId: "fantasywriters-e7c64",
  storageBucket: "fantasywriters-e7c64.firebasestorage.app",
  messagingSenderId: "736890201761",
  appId: "1:736890201761:web:0e35a823c3a2a2fbd272e0",
  measurementId: "G-GXHW1BFKJ0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const emailSpan = document.getElementById("user-email");
const joinedSpan = document.getElementById("user-joined");
const sprintHistoryList = document.getElementById("sprint-history-list");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Show user email and join date
    emailSpan.textContent = user.email;
    joinedSpan.textContent = new Date(user.metadata.creationTime).toLocaleDateString();

    // Fetch sprint history from Firestore for this user
    try {
      const q = query(
        collection(db, "sprintHistory"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);

      sprintHistoryList.innerHTML = ""; // Clear old or loading message

      if (querySnapshot.empty) {
        const li = document.createElement("li");
        li.textContent = "No sprint history yet.";
        sprintHistoryList.appendChild(li);
        return;
      }

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const date = data.timestamp.toDate();
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const duration = data.duration;
        const words = data.words;

        const li = document.createElement("li");
        li.textContent = `${dateStr} ${timeStr} — Duration: ${duration} min — Words: ${words}`;
        sprintHistoryList.appendChild(li);
      });
    } catch (error) {
      sprintHistoryList.innerHTML = "<li>Failed to load sprint history.</li>";
      console.error("Error loading sprint history:", error);
    }
  } else {
    // Not logged in, redirect
    window.location.href = "login.html";
  }
});

document.getElementById('delete-account-btn').addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) {
    alert('No user is currently signed in.');
    return;
  }

  const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
  if (!confirmed) return;

  try {
    await deleteUser(user);
    alert('Account deleted successfully. You will be logged out.');
    // Redirect to homepage or login page
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.code === 'auth/requires-recent-login') {
      alert('Please log in again before deleting your account.');
      // Redirect to login or prompt reauthentication flow
      window.location.href = 'login.html';
    } else {
      alert('Failed to delete account: ' + error.message);
    }
  }
});