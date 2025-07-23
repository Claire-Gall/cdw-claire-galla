// Firebase Poll App - Modular SDK Version

// Firebase Modular CDN Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue, get, set, child } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyASR5SsGma7u4hKdEeLBLPw98kbL_KchY8",
    authDomain: "poll-practice2.firebaseapp.com",
    databaseURL: "https://poll-practice2-default-rtdb.firebaseio.com",
    projectId: "poll-practice2",
    storageBucket: "poll-practice2.appspot.com",
    messagingSenderId: "244397860423",
    appId: "1:244397860423:web:1bdd6f8a56a7d44f8f7362",
    measurementId: "G-0FSZ8736QE"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  // DOM Elements
  const yesButton = document.getElementById('vote-Iamsatisfied');
  const noButton = document.getElementById('vote-Iamunsatisfied');
  const yesCount = document.getElementById('Iamsatisfied-count');
  const noCount = document.getElementById('Iamunsatisfied-count');
  const totalVotes = document.getElementById('total-votes');
  const connectionStatus = document.getElementById('connection-status');

  // Real-time listeners
  onValue(ref(database, 'poll/Iamsatisfied'), (snapshot) => {
    const count = snapshot.val() || 0;
    yesCount.textContent = count;
    updateTotalVotes();
  });

  onValue(ref(database, 'poll/Iamunsatisfied'), (snapshot) => {
    const count = snapshot.val() || 0;
    noCount.textContent = count;
    updateTotalVotes();
  });

  // Vote button events
  yesButton.addEventListener('click', () => {
    const voteRef = ref(database, 'poll/Iamsatisfied');
    get(voteRef).then(snapshot => {
      const count = snapshot.val() || 0;
      return set(voteRef, count + 1);
    }).then(() => {
      showVoteConfirmation('I am satisfied');
    }).catch((error) => {
      console.error('Error recording vote:', error);
      showError('Failed to record vote. Please try again.');
    });
  });

  noButton.addEventListener('click', () => {
    const voteRef = ref(database, 'poll/Iamunsatisfied');
    get(voteRef).then(snapshot => {
      const count = snapshot.val() || 0;
      return set(voteRef, count + 1);
    }).then(() => {
      showVoteConfirmation('I am unsatisfied');
    }).catch((error) => {
      console.error('Error recording vote:', error);
      showError('Failed to record vote. Please try again.');
    });
  });

  // Helper: Update total votes
  function updateTotalVotes() {
    const yes = parseInt(yesCount.textContent) || 0;
    const no = parseInt(noCount.textContent) || 0;
    totalVotes.textContent = yes + no;
  }

  // Helper: Show confirmation message
  function showVoteConfirmation(vote) {
    const confirmation = document.createElement('div');
    confirmation.className = 'vote-confirmation';
    confirmation.textContent = `Thank you for voting "${vote}"!`;
    confirmation.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(confirmation);
    setTimeout(() => {
      confirmation.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => confirmation.remove(), 300);
    }, 3000);
  }

  // Helper: Show error
  function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
    `;
    document.body.appendChild(error);
    setTimeout(() => error.remove(), 5000);
  }

  // Optional: Initial poll creation if not existing
  get(ref(database, 'poll')).then(snapshot => {
    if (!snapshot.exists()) {
      return set(ref(database, 'poll'), {
        Iamsatisfied: 0,
        Iamunsatisfied: 0
      });
    }
  }).then(() => {
    console.log('Poll initialized.');
  }).catch(err => {
    console.error('Error initializing poll:', err);
  });

  // Optional: Add keyframes via JS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});