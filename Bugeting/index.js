const form = document.getElementById('transaction-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeSelect = document.getElementById('type');
    const listEl = document.getElementById('transactions-list');

    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const balanceEl = document.getElementById('balance');

    const STORAGE_KEY = 'simple_budget_transactions_v1';

    let transactions = [];

    function loadTransactions() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          transactions = JSON.parse(saved);
        } catch {
          transactions = [];
        }
      }
      render();
    }

    function saveTransactions() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }

    function formatCurrency(value) {
      return '$' + Number(value).toFixed(2);
    }

    function addTransaction(description, amount, type) {
      const tx = {
        id: Date.now(),
        description,
        amount: Number(amount),
        type
      };
      transactions.push(tx);
      saveTransactions();
      render();
    }

    function deleteTransaction(id) {
      transactions = transactions.filter(t => t.id !== id);
      saveTransactions();
      render();
    }

    function render() {
      listEl.innerHTML = '';

      let income = 0;
      let expenses = 0;

      transactions.forEach(tx => {
        if (tx.type === 'income') {
          income += tx.amount;
        } else {
          expenses += tx.amount;
        }

        const li = document.createElement('li');

        const descSpan = document.createElement('span');
        descSpan.textContent = tx.description;

        const typeSpan = document.createElement('span');
        typeSpan.className = 'type-pill ' + tx.type;
        typeSpan.textContent = tx.type === 'income' ? 'Income' : 'Expense';

        const amountSpan = document.createElement('span');
        amountSpan.className = 'amount ' + tx.type;
        amountSpan.textContent = formatCurrency(tx.amount);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.title = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTransaction(tx.id));

        li.appendChild(descSpan);
        li.appendChild(typeSpan);
        li.appendChild(amountSpan);
        li.appendChild(deleteBtn);

        listEl.appendChild(li);
      });

      const balance = income - expenses;

      totalIncomeEl.textContent = formatCurrency(income);
      totalExpensesEl.textContent = formatCurrency(expenses);
      balanceEl.textContent = formatCurrency(balance);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = descriptionInput.value.trim();
      const amount = amountInput.value;

      if (!description || !amount || Number(amount) <= 0) {
        return;
      }

      addTransaction(description, amount, typeSelect.value);

      descriptionInput.value = '';
      amountInput.value = '';
      descriptionInput.focus();
    });

    loadTransactions();