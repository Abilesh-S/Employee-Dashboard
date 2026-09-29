let employees = [];

async function employeesData(){
    document.getElementById("loadingOverlay").classList.add("active");
    try{
        await new Promise(resolve => setTimeout(resolve, 5000)); // testing delay

        let response = await fetch("http://localhost:8080/api/employees");
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        let data = await response.json();
        return data;
    }
    catch(error){
        console.log("Error : ", error);
        document.getElementById("statusMessage").textContent = "Unable to load employees. Please try again.";
        return [];
    }
    finally {
        document.getElementById("loadingOverlay").classList.remove("active");
    }
}


function totalEmployee(){
    document.getElementById("employeeCount").textContent = employees.length;
}

function salarybudget(){
    let totalSalary = employees.reduce((acc, curr) => acc + curr.salary, 0);
    document.getElementById("salaryBudget").textContent = `₹${totalSalary || 0}`;
}

function averageSalary(){
    let totalSalary = employees.reduce((acc, curr) => acc + curr.salary, 0);
    let average = totalSalary / employees.length;
    document.getElementById("averageSalary").textContent = `₹${parseInt(average) || 0}`
}

let searchInput = document.getElementById("searchEmployee");
let searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", (event) => {
    let query = event.target.value.trim().toLowerCase();

    if (query === "") {
        searchResults.innerHTML = "";
        searchResults.style.display = "none";
        return;
    }

    let matches = employees.filter(emp =>
        emp.name.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        searchResults.innerHTML = `<li>No results found</li>`;
        searchResults.style.display = "block";
        return;
    }

    searchResults.innerHTML = matches.map(emp =>
        `<li>${emp.name} - ${emp.department}</li>`
    ).join("");

    searchResults.style.display = "block";
});

function employeeslist(){
    let tableBody = document.getElementById("employeeTable");
    tableBody.innerHTML = ""; // clear existing content first, so we don't duplicate rows on re-run
    let sortedEmployeesBySalary = employees.sort((a, b )=> b.salary - a.salary);
    for (let user of sortedEmployeesBySalary) {
        let row = `
            <tr>
                <td>${user.name}</td>
                <td>${user.department}</td>
                <td>₹${user.salary}</td>
                <td><button class="delete-btn" data-id="${user.id}">Delete</button></td>
            </tr>
        `;
        tableBody.innerHTML += row; // append this row's HTML to what's already there
    }
}


let addBtn = document.getElementById("addEmployee");
addBtn.addEventListener("click", () => {
    addingEmployee();
    employeeslist();
    salarybudget();
    averageSalary();
    totalEmployee();
    departmentDistribution();
});

function addingEmployee(){
    let name = document.getElementById("name").value.trim();
    let department = document.getElementById("dept").value;
    let salary = Number(document.getElementById("salary").value);

    if (name === "" || salary <= 0 || isNaN(salary)) {
        alert("Please enter a valid name and a positive salary.");
        return; // stop here — don't add anything
    }

    let id = employees.length === 0 ? 1 : Math.max(...employees.map(emp => emp.id)) + 1;
    employees.push({ id, name, department, salary });

    document.getElementById("name").value = "";
    document.getElementById("salary").value = "";
}

function departmentDistribution(){
    let departmentList = employees.reduce((acc, curr) => {
        if (acc[curr.department]) {
            acc[curr.department] = acc[curr.department] + 1;
        } else {
            acc[curr.department] = 1;
        }
        return acc;
    }, {});
    document.getElementById("itCount").textContent = departmentList.IT || 0;
    document.getElementById("hrCount").textContent = departmentList.HR || 0;
    document.getElementById("financeCount").textContent = departmentList.Finance || 0;
}

let tableBody = document.getElementById("employeeTable");

tableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        let idToDelete = Number(event.target.dataset.id);
        deleteEmployee(idToDelete);
    }
});

function deleteEmployee(id){
    employees = employees.filter(emp => emp.id !== id);

    employeeslist();
    salarybudget();
    averageSalary();
    totalEmployee();
    departmentDistribution();
}


async function loadEmployees(){
    employees = await employeesData();
    departmentDistribution();
    employeeslist();
    salarybudget();
    averageSalary();
    totalEmployee();
}

let refreshBtn = document.getElementById("refreshEmployees");
refreshBtn.addEventListener("click", () => {
    loadEmployees();
});

function init(){
    loadEmployees();
}

init();