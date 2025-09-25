class ExpenseTracker {
    constructor() {
        this.incomes = [];
        this.expenses = [];
        this.editingId = null;
        this.editingType = null;
        
        this.initializeEventListeners();
        this.updateDisplay();
    }
    
    initializeEventListeners() {
        const incomeForm = document.getElementById('incomeForm');
        const expenseForm = document.getElementById('expenseForm');
        const saveJsonBtn = document.getElementById('saveJsonBtn');
        const saveXmlBtn = document.getElementById('saveXmlBtn');
        const loadBtn = document.getElementById('loadBtn');
        const fileInput = document.getElementById('fileInput');
        const editForm = document.getElementById('editForm');
        const modal = document.getElementById('editModal');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.querySelector('.cancel-btn');
        
        incomeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addIncome();
        });
        
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });
        
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEdit();
        });
        
        saveJsonBtn.addEventListener('click', () => this.saveToJSON());
        saveXmlBtn.addEventListener('click', () => this.saveToXML());
        loadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.loadFromFile(e));
        
        closeBtn.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        // Event delegation for edit and delete buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                const id = e.target.getAttribute('data-id');
                const type = e.target.getAttribute('data-type');
                this.openEditModal(id, type);
            } else if (e.target.classList.contains('delete-btn')) {
                const id = e.target.getAttribute('data-id');
                const type = e.target.getAttribute('data-type');
                this.deleteRecord(id, type);
            }
        });
    }
    
    addIncome() {
        const name = document.getElementById('incomeName').value.trim();
        const value = parseFloat(document.getElementById('incomeValue').value);
        
        if (name && !isNaN(value) && value > 0) {
            const income = { 
                id: `${Date.now()}-${Math.random()}`,
                name, 
                value 
            };
            this.incomes.push(income);
            
            this.clearIncomeForm();
            this.updateDisplay();
        }
    }
    
    addExpense() {
        const name = document.getElementById('expenseName').value.trim();
        const value = parseFloat(document.getElementById('expenseValue').value);
        
        if (name && !isNaN(value) && value > 0) {
            const expense = { 
                id: `${Date.now()}-${Math.random()}`,
                name, 
                value 
            };
            this.expenses.push(expense);
            
            this.clearExpenseForm();
            this.updateDisplay();
        }
    }
    
    openEditModal(id, type) {
        const modal = document.getElementById('editModal');
        const modalTitle = document.getElementById('modalTitle');
        const editName = document.getElementById('editName');
        const editValue = document.getElementById('editValue');
        
        this.editingId = id;
        this.editingType = type;
        
        let record;
        if (type === 'income') {
            record = this.incomes.find(inc => inc.id === id);
            modalTitle.textContent = 'Edit Income';
        } else {
            record = this.expenses.find(exp => exp.id === id);
            modalTitle.textContent = 'Edit Expense';
        }
        
        if (record) {
            editName.value = record.name;
            editValue.value = record.value;
            modal.style.display = 'block';
        }
    }
    
    saveEdit() {
        const name = document.getElementById('editName').value.trim();
        const value = parseFloat(document.getElementById('editValue').value);
        
        if (name && !isNaN(value) && value > 0) {
            if (this.editingType === 'income') {
                const index = this.incomes.findIndex(income => income.id === this.editingId);
                if (index !== -1) {
                    this.incomes[index] = { id: this.editingId, name, value };
                }
            } else {
                const index = this.expenses.findIndex(expense => expense.id === this.editingId);
                if (index !== -1) {
                    this.expenses[index] = { id: this.editingId, name, value };
                }
            }
            
            this.closeModal();
            this.updateDisplay();
        }
    }
    
    deleteRecord(id, type) {
        if (type === 'income') {
            this.incomes = this.incomes.filter(income => income.id !== id);
        } else {
            this.expenses = this.expenses.filter(expense => expense.id !== id);
        }
        this.updateDisplay();
    }
    
    closeModal() {
        const modal = document.getElementById('editModal');
        modal.style.display = 'none';
        this.editingId = null;
        this.editingType = null;
    }
    
    clearIncomeForm() {
        document.getElementById('incomeName').value = '';
        document.getElementById('incomeValue').value = '';
    }
    
    clearExpenseForm() {
        document.getElementById('expenseName').value = '';
        document.getElementById('expenseValue').value = '';
    }
    
    updateDisplay() {
        this.updateIncomeList();
        this.updateExpenseList();
        this.updateSummary();
    }
    
    updateIncomeList() {
        const incomeList = document.getElementById('incomeList');
        incomeList.innerHTML = '';
        
        this.incomes.forEach((income, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-content">
                    <span class="item-name">${income.name}</span>
                    <span class="item-value">₳ ${income.value.toFixed(2)}</span>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" data-id="${income.id}" data-type="income" title="Edit">✏️</button>
                    <button class="delete-btn" data-id="${income.id}" data-type="income" title="Delete">🗑️</button>
                </div>
            `;
            incomeList.appendChild(li);
        });
    }
    
    updateExpenseList() {
        const expenseList = document.getElementById('expenseList');
        expenseList.innerHTML = '';
        
        this.expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-content">
                    <span class="item-name">${expense.name}</span>
                    <span class="item-value">₳ ${expense.value.toFixed(2)}</span>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" data-id="${expense.id}" data-type="expense" title="Edit">✏️</button>
                    <button class="delete-btn" data-id="${expense.id}" data-type="expense" title="Delete">🗑️</button>
                </div>
            `;
            expenseList.appendChild(li);
        });
    }
    
    updateSummary() {
        const totalIncome = this.incomes.reduce((sum, income) => sum + income.value, 0);
        const totalExpense = this.expenses.reduce((sum, expense) => sum + expense.value, 0);
        const netAmount = totalIncome - totalExpense;
        
        document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
        document.getElementById('totalExpense').textContent = totalExpense.toFixed(2);
        document.getElementById('netAmount').textContent = netAmount.toFixed(2);
        
        // Style net amount based on positive/negative
        const netAmountElement = document.querySelector('.net-amount');
        if (netAmount >= 0) {
            netAmountElement.style.color = '#059669';
            netAmountElement.style.backgroundColor = '#ecfdf5';
        } else {
            netAmountElement.style.color = '#dc2626';
            netAmountElement.style.backgroundColor = '#fef2f2';
        }
    }
    
    saveToJSON() {
        const data = {
            incomes: this.incomes,
            expenses: this.expenses,
            exportDate: new Date().toISOString(),
            version: "1.0"
        };
        
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    saveToXML() {
        const data = {
            incomes: this.incomes,
            expenses: this.expenses,
            exportDate: new Date().toISOString()
        };
        
        const xmlContent = this.objectToXML(data);
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.xml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    loadFromFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const fileName = file.name.toLowerCase();
                let data;
                
                if (fileName.endsWith('.json')) {
                    data = JSON.parse(e.target.result);
                } else if (fileName.endsWith('.xml')) {
                    data = this.xmlToObject(e.target.result);
                } else {
                    alert('Unsupported file format. Please use .json or .xml files.');
                    return;
                }
                
                if (data.incomes && data.expenses) {
                    this.incomes = data.incomes;
                    this.expenses = data.expenses;
                    this.updateDisplay();
                } else {
                    alert('Invalid file format.');
                }
            } catch (error) {
                alert('Error loading file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    
    objectToXML(obj) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<expenseTracker>\n';
        
        xml += '  <incomes>\n';
        obj.incomes.forEach(income => {
            xml += `    <income id="${income.id}">\n`;
            xml += `      <name><![CDATA[${income.name}]]></name>\n`;
            xml += `      <value>${income.value}</value>\n`;
            xml += '    </income>\n';
        });
        xml += '  </incomes>\n';
        
        xml += '  <expenses>\n';
        obj.expenses.forEach(expense => {
            xml += `    <expense id="${expense.id}">\n`;
            xml += `      <name><![CDATA[${expense.name}]]></name>\n`;
            xml += `      <value>${expense.value}</value>\n`;
            xml += '    </expense>\n';
        });
        xml += '  </expenses>\n';
        
        xml += `  <exportDate>${obj.exportDate}</exportDate>\n`;
        xml += '</expenseTracker>';
        
        return xml;
    }
    
    xmlToObject(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        
        const incomes = [];
        const expenses = [];
        
        // Parse incomes
        const incomeElements = xmlDoc.querySelectorAll('incomes income');
        incomeElements.forEach(income => {
            incomes.push({
                id: income.getAttribute('id'),
                name: income.querySelector('name').textContent,
                value: parseFloat(income.querySelector('value').textContent)
            });
        });
        
        // Parse expenses
        const expenseElements = xmlDoc.querySelectorAll('expenses expense');
        expenseElements.forEach(expense => {
            expenses.push({
                id: expense.getAttribute('id'),
                name: expense.querySelector('name').textContent,
                value: parseFloat(expense.querySelector('value').textContent)
            });
        });
        
        return { incomes, expenses };
    }
    
}

// Initialize the expense tracker when the page loads
let expenseTracker;
document.addEventListener('DOMContentLoaded', () => {
    expenseTracker = new ExpenseTracker();
});
