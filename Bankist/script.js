"use strict";

/**
 * BANKIST APP - Enhanced Version
 * A modern banking application simulation
 * Built with vanilla JavaScript, HTML, and CSS
 *
 * Features:
 * - User authentication
 * - Account balance display
 * - Transaction history
 * - Money transfers
 * - Loan requests
 * - Account closure
 * - Auto-logout timer
 * - Internationalization support
 *
 * Author: Your Name
 * Course: JavaScript Complete Course by Jonas Schmedtmann
 */

// ==========================================
// APPLICATION DATA
// ==========================================

/**
 * Sample user accounts with transaction data
 * Each account contains: owner info, movements, dates, settings
 */
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // Interest rate percentage
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2025-09-11T23:36:17.929Z",
    "2025-09-17T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

// Array containing all user accounts
const accounts = [account1, account2];

// ==========================================
// DOM ELEMENT REFERENCES
// ==========================================

// UI Labels
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

// Containers
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

// Buttons
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

// Input Fields
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// ==========================================
// APPLICATION STATE
// ==========================================

let currentAccount; // Currently logged-in account
let timer; // Auto-logout timer reference
let sorted = false; // Movement sorting state

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Formats transaction dates with relative time display
 * @param {Date} date - The date to format
 * @param {string} locale - User's locale for formatting
 * @returns {string} Formatted date string
 */
const formatMovementDate = function (date, locale) {
  // Calculate days passed since transaction
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  // Return relative time for recent transactions
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // Return formatted date for older transactions
  return new Intl.DateTimeFormat(locale).format(date);
};

/**
 * Formats currency values according to user's locale
 * @param {number} value - Amount to format
 * @param {string} locale - User's locale
 * @param {string} currency - Currency code (EUR, USD, etc.)
 * @returns {string} Formatted currency string
 */
const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

/**
 * Generates usernames from account owner names
 * Creates username by taking first letter of each name part
 * @param {Array} accounts - Array of account objects
 */
const createUserNames = (accounts) => {
  accounts.forEach((account) => {
    account.userName = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name.at(0))
      .join("");
  });
};

// ==========================================
// UI UPDATE FUNCTIONS
// ==========================================

/**
 * Displays account movements/transactions in the UI
 * @param {Object} acc - Account object
 * @param {boolean} sort - Whether to sort movements by amount
 */
const displayMovements = (acc, sort = false) => {
  // Clear existing movements
  containerMovements.innerHTML = "";

  // Combine movements with their corresponding dates
  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  // Sort movements by amount if requested
  if (sort) {
    combinedMovsDates.sort((a, b) => a.movement - b.movement);
  }

  // Create HTML for each movement
  combinedMovsDates.forEach((obj, i) => {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? "deposit" : "withdrawal";
    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCurrency(movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/**
 * Calculates and displays the total account balance
 * @param {Object} acc - Account object
 */
const calcTotalBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

/**
 * Calculates and displays account summary (income, outcome, interest)
 * @param {Object} acc - Account object
 */
const calcSummary = (acc) => {
  // Calculate total income (positive movements)
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  // Calculate total outcome (negative movements)
  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  // Calculate interest earned on deposits
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1) // Only count interest >= 1
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

/**
 * Updates all UI components with current account data
 * @param {Object} acc - Account object
 */
const updateUI = (acc) => {
  displayMovements(acc);
  calcTotalBalance(acc);
  calcSummary(acc);
};

// ==========================================
// TIMER FUNCTIONALITY
// ==========================================

/**
 * Starts the auto-logout timer
 * Logs out user after 10 minutes of inactivity
 * @returns {number} Timer reference for clearing
 */
const startLogoutTimer = () => {
  let time = 600; // 10 minutes in seconds

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");

    // Display remaining time
    labelTimer.textContent = `${min}:${sec}`;

    // When time expires, logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
      currentAccount = null;
    }

    time--;
  };

  tick(); // Call immediately
  const timerRef = setInterval(tick, 1000);
  return timerRef;
};

/**
 * Resets the logout timer (called on user activity)
 */
const resetTimer = () => {
  if (timer) clearInterval(timer);
  timer = startLogoutTimer();
};

// ==========================================
// EVENT HANDLERS
// ==========================================

/**
 * Handles user login
 */
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  // Find account with matching username
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  // Validate PIN
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display welcome message and UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;

    // Display current date and time
    const now = new Date();
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Start logout timer
    resetTimer();

    // Update UI with account data
    updateUI(currentAccount);
  } else {
    // Invalid credentials
    alert("Invalid username or PIN");
  }
});

/**
 * Handles money transfer between accounts
 */
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  // Clear inputs
  inputTransferAmount.value = inputTransferTo.value = "";

  // Validate transfer
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    // Execute transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transaction dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI and reset timer
    updateUI(currentAccount);
    resetTimer();

    // Show success message
    setTimeout(() => {
      alert(
        `Transfer of ${formatCurrency(
          amount,
          currentAccount.locale,
          currentAccount.currency
        )} completed successfully!`
      );
    }, 500);
  } else {
    // Invalid transfer
    let errorMessage = "Transfer failed: ";
    if (!amount || amount <= 0) errorMessage += "Invalid amount";
    else if (!receiverAcc) errorMessage += "Recipient not found";
    else if (currentAccount.balance < amount)
      errorMessage += "Insufficient funds";
    else if (receiverAcc.userName === currentAccount.userName)
      errorMessage += "Cannot transfer to yourself";

    alert(errorMessage);
  }
});

/**
 * Handles loan requests
 */
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  // Loan approval: user must have a deposit >= 10% of loan amount
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Simulate loan processing delay
    setTimeout(() => {
      // Add loan to account
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI and reset timer
      updateUI(currentAccount);
      resetTimer();

      alert(
        `Loan of ${formatCurrency(
          amount,
          currentAccount.locale,
          currentAccount.currency
        )} approved and deposited!`
      );
    }, 2500);

    alert("Loan request submitted. Processing...");
  } else {
    // Loan denied
    alert(
      "Loan denied. You need at least one deposit of 10% of the loan amount."
    );
  }

  inputLoanAmount.value = "";
});

/**
 * Handles account closure
 */
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  // Verify credentials before closing account
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );

    // Remove account from array
    accounts.splice(index, 1);

    // Hide UI and show logout message
    containerApp.style.opacity = 0;
    labelWelcome.textContent =
      "Account closed successfully. Thank you for using Bankist!";

    // Clear timer
    if (timer) clearInterval(timer);
    currentAccount = null;
  } else {
    alert("Invalid credentials. Account closure cancelled.");
  }

  // Clear inputs
  inputCloseUsername.value = inputClosePin.value = "";
});

/**
 * Handles movement sorting toggle
 */
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;

  // Update button text to indicate current state
  btnSort.textContent = sorted ? "↑ UNSORT" : "↓ SORT";
});

// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

/**
 * Initialize the application
 */
const init = () => {
  // Create usernames for all accounts
  createUserNames(accounts);

  // Reset UI to initial state
  containerApp.style.opacity = 0;
  labelWelcome.textContent = "Log in to get started";

  console.log("Bankist App initialized successfully!");
  console.log("Demo accounts:");
  console.log("Username: js, PIN: 1111");
  console.log("Username: jd, PIN: 2222");
};

// Start the application
init();
