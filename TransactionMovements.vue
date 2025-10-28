<template>
  <div class="movements">
    <h3>📜 Transaction History</h3>

    <button @click="toggleSort" class="btn-sort">
      Sort: {{ sortAscending ? 'Newest' : 'Oldest' }}
    </button>

    <ul>
      <li
        v-for="(mov, index) in displayedMovements"
        :key="index"
        :class="['movement', mov.amount > 0 ? 'deposit' : 'withdrawal']"
      >
        <span>
          {{ mov.amount > 0 ? 'Deposit' : 'Withdrawal' }}
          ({{ formatDate(mov.date) }})
        </span>
        <strong>{{ formatCurrency(mov.amount) }}</strong>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TransactionMovements",
  props: {
    movements: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sortAscending: true,
    };
  },
  computed: {
    displayedMovements() {
      // Sort by date depending on toggle
      return [...this.movements].sort((a, b) =>
        this.sortAscending
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date)
      );
    },
  },
  methods: {
    toggleSort() {
      this.sortAscending = !this.sortAscending;
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(value);
    },
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.movements {
  background: #fff;
  padding: 1.5rem;
  margin-top: 2rem;
  border-radius: 1rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.05);
}

.movements h3 {
  margin-bottom: 1rem;
}

.btn-sort {
  background: #007bff;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

.movement {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.deposit strong {
  color: green;
}

.withdrawal strong {
  color: red;
}
</style>
