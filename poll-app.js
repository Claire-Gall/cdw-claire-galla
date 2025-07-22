document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // STEP 1: FIREBASE CONFIGURATION
  // ========================================
const firebaseConfig = {
  apiKey: "AIzaSyC_5vnSfiopPrAAWPBGTq9Z62fiZjysjrs",
  authDomain: "poll-practice.firebaseapp.com",
  projectId: "poll-practice",
  storageBucket: "poll-practice.firebasestorage.app",
  messagingSenderId: "786947095286",
  appId: "1:786947095286:web:395be6d47a053209768ad7",
  measurementId: "G-YZ5J7TJ318"
};

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  // ========================================
  // STEP 2: GET REFERENCES TO HTML ELEMENTS
  // ========================================
  const yesButton = document.getElementById('vote-I am satisfied');
  const noButton = document.getElementById('vote-I am unsatisfied');
  const yesCount = document.getElementById('I am satisfied-count');
  const noCount = document.getElementById('I am unsatisfied-count');
  const totalVotes = document.getElementById('total-votes');
  const connectionStatus = document.getElementById('connection-status');

  // ========================================
  // STEP 3: SET UP REAL-TIME DATABASE LISTENERS
  // ========================================
  database.ref('poll/Iamsatisfied').on('value', function(snapshot) {
    const count = snapshot.val() || 0;
    yesCount.textContent = count;
    updateTotalVotes();
    console.log('Iamsatisfied votes updated:', count);
  });

  database.ref('poll/Iamunsatisfied').on('value', function(snapshot) {
    const count = snapshot.val() || 0;
    noCount.textContent = count;
    updateTotalVotes();
    console.log('No votes updated:', count);
  });

  // ========================================
  // STEP 4: SET UP BUTTON EVENT LISTENERS
  // ========================================
  yesButton.addEventListener('click', function() {
    console.log('Iamsatisfied button clicked');
    database.ref('poll/Iamsatisfied').once('value')
      .then(function(snapshot) {
        const currentCount = snapshot.val() || 0;
        const newCount = currentCount + 1;
        return database.ref('poll/Iamsatisfied').set(newCount);
      })
      .then(function() {
        console.log('Iamsatisfied vote recorded successfully');
        showVoteConfirmation('Iamsatisfied');
      })
      .catch(function(error) {
        console.error('Error recording vote:', error);
        showError('Failed to record vote. Please try again.');
      });
  });

  noButton.addEventListener('click', function() {
    console.log('Iamunsatisfied button clicked');
    database.ref('poll/Iamunsatisfied').once('value')
      .then(function(snapshot) {
        const currentCount = snapshot.val() || 0;
        const newCount = currentCount + 1;
        return database.ref('poll/Iamunsatisfied').set(newCount);
      })
      .then(function() {
        console.log('Iamunsatisfied vote recorded successfully');
        showVoteConfirmation('Iamunsatisfied');
      })
      .catch(function(error) {
        console.error('Error recording vote:', error);
        showError('Failed to record vote. Please try again.');
      });
  });

  // ========================================
  // STEP 5: HELPER FUNCTIONS
  // ========================================
  function updateTotalVotes() {
    const IamsatisfiedVotes = parseInt(yesCount.textContent) || 0; // ✅ Fixed reference
    const IamunsatisfiedVotes = parseInt(noCount.textContent) || 0; // ✅ Fixed reference
    const total = IamsatisfiedVotes + IamunsatisfiedVotes;
    totalVotes.textContent = total;
  }

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
    setTimeout(function() {
      confirmation.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(function() {
        if (confirmation.parentNode) {
          confirmation.parentNode.removeChild(confirmation);
        }
      }, 300);
    }, 3000);
  }

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
    setTimeout(function() {
      if (error.parentNode) {
        error.parentNode.removeChild(error);
      }
    }, 5000);
  }

  // ========================================
  // STEP 6: CONNECTION STATUS MONITORING
  // ========================================
  database.ref('.info/connected').on('value', function(snapshot) {
    const connected = snapshot.val();
    if (connected) {
      connectionStatus.innerHTML = '<p style="color: #4CAF50;">✅ Connected to Firebase</p>';
      console.log('Connected to Firebase');
    } else {
      connectionStatus.innerHTML = '<p style="color: #f44336;">❌ Disconnected from Firebase</p>';
      console.log('Disconnected from Firebase');
    }
  });

  // ========================================
  // STEP 7: INITIALIZATION
  // ========================================
  database.ref('poll').once('value')
    .then(function(snapshot) {
      if (!snapshot.exists()) {
        return database.ref('poll').set({
          Iamsatisfied: 0,      // ✅ Fixed to match usage
          Iamunsatisfied: 0     // ✅ Fixed to match usage
        });
      }
    })
    .then(function() {
      console.log('Poll initialized successfully');
    })
    .catch(function(error) {
      console.error('Error initializing poll:', error);
    });

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

  console.log('Firebase Poll App initialized successfully!');
  console.log('Tutorial: This app demonstrates real-time data synchronization with Firebase');
});