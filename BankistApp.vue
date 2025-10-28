<template>
  <div class="bankist-app">
    <!-- LOGIN SCREEN -->
    <div v-if="!currentAccount" class="login">
      <h2>Log in to get started</h2>
      <input
        v-model="loginUsername"
        placeholder="user"
        class="login__input login__input--user"
      />
      <input
        v-model="loginPin"
        type="password"
        placeholder="PIN"
        class="login__input login__input--pin"
      />
      <button @click="login" class="login__btn">➡️</button>
    </div>

    <!-- MAIN APP -->
    <div v-else class="app">
      <header>
        <h2>
          Welcome back, {{ currentAccount.owner.split(' ')[0] }} 👋
        </h2>
        <p class="date">As of {{ currentDate }}</p>
        <p class="timer">⏳ You will be logged out in {{ timeLeft }}</p>
      </header>

      <!-- BALANCE -->
      <section class="balance">
        <h3>Current Balance</h3>
        <p class="balance__value">
          {{ formatCurrency(currentAccount.balance) }}
        </p>
      </section>

      <!-- MOVEMENTS -->
      <section class="movements">
        <div class="movements__header">
          <h3>Transactions</h3>
          <button @click="toggleSort">
            Sort: {{ sorted ? 'Ascending' : 'Descending' }}
          </button>
        </div>

        <div class="movements__list">
          <div
            v-for="(mov, i) in displayedMovements"
            :key="i"
            class="movements__row"
          >
            <div class="movements__type">
              {{ mov.amount > 0 ? 'Deposit' : 'Withdrawal' }}
            </div>
            <div class="movements__date">
              {{ formatDate(mov.date) }}
            </div>
            <div class="movements__value">
              {{ formatCurrency(mov.amount) }}
            </div>
          </div>
        </div>
      </section>

      <!-- SUMMARY -->
      <section class="summary">
        <p>In: {{ formatCurrency(summary.in) }}</p>
        <p>Out: {{ formatCurrency(summary.out) }}</p>
        <p>Interest: {{ formatCurrency(summary.interest) }}</p>
      </section>

      <!-- ACTIONS -->
      <section class="actions">
        <div class="transfer">
          <h3>Transfer Money</h3>
          <input v-model="transferTo" placeholder="user" />
          <input v-model.number="transferAmount" type="number" placeholder="amount" />
          <button @click="transfer">Transfer</button>
        </div>

        <div class="loan">
          <h3>Request Loan</h3>
          <input v-model.number="loanAmount" type="number" placeholder="amount" />
          <button @click="requestLoan">Request</button>
        </div>

        <div class="close">
          <h3>Close Account</h3>
          <input v-model="closeUsername" placeholder="user" />
          <input v-model="closePin" type="password" placeholder="PIN" />
          <button @click="closeAccount">Close</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "BankistApp",
  data() {
    return {
      accounts: [
        {
          owner: "Jonas Schmedtmann",
          movements: [
            { amount: 200, date: "2023-11-18T21:31:17.178Z" },
            { amount: 455.23, date: "2023-12-23T07:42:02.383Z" },
            { amount: -306.5, date: "2024-01-28T09:15:04.904Z" },
            { amount: 25000, date: "2024-04-01T10:17:24.185Z" },
            { amount: -642.21, date: "2024-05-08T14:11:59.604Z" },
            { amount: -133.9, date: "2024-07-26T17:01:17.194Z" },
            { amount: 79.97, date: "2024-08-28T23:36:17.929Z" },
            { amount: 1300, date: "2024-09-01T10:51:36.790Z" },
          ],
          interestRate: 1.2,
          pin: 1111,
          username: "js",
        },
        {
          owner: "Jessica Davis",
          movements: [
            { amount: 5000, date: "2023-11-01T13:15:33.035Z" },
            { amount: 3400, date: "2023-11-30T09:48:16.867Z" },
            { amount: -150, date: "2023-12-25T06:04:23.907Z" },
            { amount: -790, date: "2024-01-25T14:18:46.235Z" },
            { amount: -3210, date: "2024-02-05T16:33:06.386Z" },
            { amount: -1000, date: "2024-04-10T14:43:26.374Z" },
            { amount: 8500, date: "2024-06-25T18:49:59.371Z" },
            { amount: -30, date: "2024-07-26T12:01:20.894Z" },
          ],
          interestRate: 1.5,
          pin: 2222,
          username: "jd",
        },
      ],

      loginUsername: "",
      loginPin: "",
      currentAccount: null,
      sorted: false,

      transferTo: "",
      transferAmount: 0,
      loanAmount: 0,
      closeUsername: "",
      closePin: "",

      timer: null,
      time: 300,
    };
  },
  computed: {
    displayedMovements() {
      if (!this.currentAccount) return [];
      const movs = this.currentAccount.movements.slice();
      return this.sorted ? movs.sort((a, b) => a.amount - b.amount) : movs;
    },
    summary() {
      if (!this.currentAccount) return { in: 0, out: 0, interest: 0 };
      const inSum = this.currentAccount.movements
        .filter(m => m.amount > 0)
        .reduce((acc, m) => acc + m.amount, 0);
      const outSum = this.currentAccount.movements
        .filter(m => m.amount < 0)
        .reduce((acc, m) => acc + m.amount, 0);
      const interest = this.currentAccount.movements
        .filter(m => m.amount > 0)
        .map(deposit => (deposit.amount * this.currentAccount.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0);
      return { in: inSum, out: Math.abs(outSum), interest };
    },
    currentDate() {
      return new Intl.DateTimeFormat("en-PH", { dateStyle: "full" }).format(new Date());
    },
    timeLeft() {
      const min = String(Math.trunc(this.time / 60)).padStart(2, "0");
      const sec = String(this.time % 60).padStart(2, "0");
      return `${min}:${sec}`;
    },
  },
  methods: {
    login() {
      const acc = this.accounts.find(
        a => a.username === this.loginUsername && a.pin === +this.loginPin
      );
      if (acc) {
        this.currentAccount = acc;
        this.updateBalance();
        this.startLogoutTimer();
      } else alert("Wrong credentials!");
      this.loginUsername = "";
      this.loginPin = "";
    },
    updateBalance() {
      this.currentAccount.balance = this.currentAccount.movements.reduce(
        (acc, m) => acc + m.amount,
        0
      );
    },
    toggleSort() {
      this.sorted = !this.sorted;
    },
    transfer() {
      const receiver = this.accounts.find(a => a.username === this.transferTo);
      const amount = this.transferAmount;
      if (
        receiver &&
        amount > 0 &&
        this.currentAccount.balance >= amount &&
        receiver.username !== this.currentAccount.username
      ) {
        this.currentAccount.movements.push({
          amount: -amount,
          date: new Date().toISOString(),
        });
        receiver.movements.push({
          amount: amount,
          date: new Date().toISOString(),
        });
        this.updateBalance();
        this.resetTimer();
      } else alert("Invalid transfer");
      this.transferTo = "";
      this.transferAmount = 0;
    },
    requestLoan() {
      if (
        this.loanAmount > 0 &&
        this.currentAccount.movements.some(m => m.amount >= this.loanAmount * 0.1)
      ) {
        setTimeout(() => {
          this.currentAccount.movements.push({
            amount: this.loanAmount,
            date: new Date().toISOString(),
          });
          this.updateBalance();
          this.resetTimer();
        }, 2000);
      } else alert("Loan denied!");
      this.loanAmount = 0;
    },
    closeAccount() {
      if (
        this.closeUsername === this.currentAccount.username &&
        +this.closePin === this.currentAccount.pin
      ) {
        this.accounts = this.accounts.filter(
          a => a.username !== this.currentAccount.username
        );
        this.currentAccount = null;
        clearInterval(this.timer);
      } else alert("Wrong credentials!");
      this.closeUsername = "";
      this.closePin = "";
    },
    startLogoutTimer() {
      if (this.timer) clearInterval(this.timer);
      this.time = 300;
      this.timer = setInterval(() => {
        this.time--;
        if (this.time <= 0) {
          clearInterval(this.timer);
          this.currentAccount = null;
        }
      }, 1000);
    },
    resetTimer() {
      this.startLogoutTimer();
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(value);
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const daysPassed = Math.round(
        Math.abs((new Date() - date) / (1000 * 60 * 60 * 24))
      );
      if (daysPassed === 0) return "Today";
      if (daysPassed === 1) return "Yesterday";
      if (daysPassed <= 7) return `${daysPassed} days ago`;
      return new Intl.DateTimeFormat("en-PH").format(date);
    },
  },
};
</script>

<style scoped>
.bankist-app {
  background: #f3f3f3;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  color: #333;
  padding: 1rem;
}
.login,
.app {
  max-width: 500px;
  margin: auto;
  text-align: center;
}
.movements__list {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
}
.movements__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.summary p {
  margin: 0.25rem 0;
}
.actions input {
  margin: 0.25rem;
  padding: 0.5rem;
}
button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
</style>
