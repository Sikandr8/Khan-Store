document.addEventListener('DOMContentLoaded', () => {
    // Existing code...

    // Welcome Modal Code
    const welcomeModal = document.getElementById('welcomeModal');
    const closeBtn = document.querySelector('.close-btn');

    // Show the modal when the app is loaded
    welcomeModal.style.display = 'flex';

    // Close the modal when the user clicks the 'X' button
    closeBtn.addEventListener('click', () => {
        welcomeModal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target === welcomeModal) {
            welcomeModal.style.display = 'none';
        }
    };

    // Existing code continues...
});

document.addEventListener('DOMContentLoaded', () => {
    const loanForm = document.getElementById('loanForm');
    const customersDiv = document.getElementById('customers');
    const searchInput = document.getElementById('searchInput'); // Search input element
    let loans = JSON.parse(localStorage.getItem('loans')) || [];
    let editingIndex = -1;

    // Load existing loans
    loadLoans();

    loanForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customerName = document.getElementById('customerName').value;
        const loanAmount = parseFloat(document.getElementById('loanAmount').value);
        const loanDate = document.getElementById('loanDate').value;

        const loanData = {
            customerName,
            loanAmount,
            loanDate
        };

        if (editingIndex === -1) {
            // Adding new loan
            loans.push(loanData);
        } else {
            // Editing existing loan
            loans[editingIndex] = loanData;
            editingIndex = -1; // Reset editing index after editing
        }

        saveLoans();
        displayLoans();
        loanForm.reset();
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        displayLoans(searchTerm); // Pass search term to displayLoans function
    });

    function displayLoans(searchTerm = '') {
        customersDiv.innerHTML = '';
        const customers = groupLoansByCustomer(loans);
        
        Object.keys(customers).forEach(customerName => {
            if (customerName.toLowerCase().includes(searchTerm)) {
                const customerLoans = customers[customerName];
                const totalLoanAmount = customerLoans.reduce((sum, loan) => sum + loan.loanAmount, 0);
                
                const customerDiv = document.createElement('div');
                customerDiv.classList.add('customer');
                customerDiv.innerHTML = `
                    <h3>${customerName} (Total Loan: ${totalLoanAmount.toFixed(2)})</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Loan Amount</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customerLoans.map((loan, index) => `
                                <tr>
                                    <td>${loan.loanAmount.toFixed(2)}</td>
                                    <td>${loan.loanDate}</td>
                                    <td>
                                        <button onclick="editLoan(${loans.indexOf(loan)})">Edit</button>
                                        <button onclick="deleteLoan(${loans.indexOf(loan)})">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
                customersDiv.appendChild(customerDiv);
            }
        });
    }

    function groupLoansByCustomer(loans) {
        return loans.reduce((acc, loan) => {
            if (!acc[loan.customerName]) {
                acc[loan.customerName] = [];
            }
            acc[loan.customerName].push(loan);
            return acc;
        }, {});
    }

    window.editLoan = function(index) {
        const loan = loans[index];
        document.getElementById('customerName').value = loan.customerName;
        document.getElementById('loanAmount').value = loan.loanAmount;
        document.getElementById('loanDate').value = loan.loanDate;
        editingIndex = index; // Set the index of the loan being edited
    }

    window.deleteLoan = function(index) {
        // Show confirmation message before deleting
        const confirmation = confirm("Kya aap delete krna chahy gy?");
        
        if (confirmation) {
            // If user confirms, delete the loan
            loans.splice(index, 1); // Remove the loan from the list
            saveLoans();            // Save the updated list to localStorage
            displayLoans();          // Refresh the display
        }
    }
    
    function saveLoans() {
        localStorage.setItem('loans', JSON.stringify(loans));
    }

    function loadLoans() {
        displayLoans();
    }
});