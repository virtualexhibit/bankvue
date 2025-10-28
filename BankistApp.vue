<template>
  <div class="bankist-app">
    <!-- LOGIN SCREEN -->
    <div v-if="!currentAccount" class="login">
      <h2>Log in to get started</h2>

      <!-- Render TextInput fields dynamically -->
      <div v-for="(input, index) in recipe.Inputs" :key="index">
        <component
          :is="input.ComponentName"
          :item="input"
          v-model="form[input.key]"
        />
      </div>

      <!-- Render Buttons dynamically -->
      <div v-for="(btn, index) in recipe.Buttons" :key="'btn-' + index">
        <component
          :is="btn.ComponentName"
          :item="btn"
          @action="handleAction(btn.on?.action)"
        />
      </div>
    </div>

    <!-- DASHBOARD SCREEN -->
    <div v-else class="dashboard">
      <div class="welcome">
        <h2>Welcome back, {{ currentAccount.owner.split(' ')[0] }} 👋</h2>
        <p>⏳ You will be logged out in {{ formattedTimer }}</p>
      </div>

      <div class="balance">
        <p>Current Balance:</p>
        <h1>{{ formatCurrency(currentAccount.balance) }}</h1>
      </div>

      <!-- 🆕 Transaction Movements -->
      <TransactionMovements :movements="combinedMovements" />

      <CommonButtons
        :item="{
          directives: { class: 'logout-btn' },
          display: { text: 'Logout' },
        }"
        @action="logout"
      />
    </div>

  </div>
</template>

<script>
import { BankistAppRecipe, accounts } from "./Recipes/rBankistApp.js";
import TextInput from "./SubComponents/TextInput.vue";
import CommonButtons from "./SubComponents/CommonButtons.vue";
import TransactionMovements from "./SubComponents/TransactionMovements.vue";

export default {
  name: "BankistApp",
  components: { TextInput, CommonButtons, TransactionMovements },

  data() {
    return {
      accounts,
      recipe: BankistAppRecipe,      
      form: { loginUsername: "", loginPin: "" },
      currentAccount: null,
      timer: null,
      timeRemaining: 300,
      sortAscending: true,
    };
  },

  computed: {
    formattedTimer() {
      const m = String(Math.floor(this.timeRemaining / 60)).padStart(2, "0");
      const s = String(this.timeRemaining % 60).padStart(2, "0");
      return `${m}:${s}`;
    },
    
    combinedMovements() {
      if (!this.currentAccount) return [];
      return this.currentAccount.movements.map((amount, i) => ({
        amount,
        date: this.currentAccount.movementDates[i],
      }));
    },

    displayedMovements() {
      if (!this.currentAccount) return [];
      const movs = this.currentAccount.movements.map((amount, i) => ({
        amount,
        date: this.currentAccount.movementDates[i],
      }));
      return this.sortAscending ? movs : [...movs].reverse();
    },
  },

  methods: {
    handleAction(action) {
      if (action === "login") this.login();
      if (action === "logout") this.logout();
    },

    login() {
      const account = this.accounts.find(
        a =>
          a.username === this.form.loginUsername &&
          a.pin === Number(this.form.loginPin)
      );

      if (account) {
        this.currentAccount = account;
        this.startLogoutTimer();
        this.form.loginUsername = "";
        this.form.loginPin = "";
      } else {
        alert("Invalid credentials ❌");
      }
    },

    logout() {
      this.currentAccount = null;
      clearInterval(this.timer);
      this.timeRemaining = 300;
    },

    startLogoutTimer() {
      clearInterval(this.timer);
      this.timeRemaining = 300;

      this.timer = setInterval(() => {
        if (this.timeRemaining > 0) this.timeRemaining--;
        else {
          clearInterval(this.timer);
          alert("⏰ Session expired!");
          this.logout();
        }
      }, 1000);
    },

    formatCurrency(value) {
      if (typeof value !== "number") return value;
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(value);
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-PH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },

    toggleSort() {
      this.sortAscending = !this.sortAscending;
    },
  },
};
</script>

<style scoped>
.bankist-app {
  background: #f3f3f3;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.login,
.dashboard {
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 2rem 3rem rgba(0, 0, 0, 0.1);
  width: 400px;
}

.balance {
  margin-top: 2rem;
}

.movements {
  background: #fff;
  border-radius: 10px;
  margin-top: 2rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.movements ul {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}
.movement {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid #eee;
}
.deposit {
  color: #2e7d32;
}
.withdrawal {
  color: #c62828;
}
.btn-sort {
  background: #2196f3;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}
.logout-btn {
  margin-top: 2rem;
  background: crimson;
  color: white;
}
</style>
