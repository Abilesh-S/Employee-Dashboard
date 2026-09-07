let employees = [
  { id: 1, name: "John", department: "IT", salary: 80000 },
  { id: 2, name: "Sarah", department: "HR", salary: 60000 },
  { id: 3, name: "Mike", department: "Finance", salary: 70000 }
];

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

function searchEmployee(){
    let userName = readlineSync.question("name: ");
    let results = employees.filter(emp => emp.name.toLowerCase().includes(userName.toLowerCase()));
    console.log(results);
}

function employeeslist(){
    let tableBody = document.getElementById("employeeTable");
    tableBody.innerHTML = ""; // clear existing content first, so we don't duplicate rows on re-run

    for (let user of employees) {
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
    let name = document.getElementById("name").value;
    let department = document.getElementById("dept").value;
    let salary = Number(document.getElementById("salary").value);

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


departmentDistribution();
employeeslist();
salarybudget()
averageSalary();
totalEmployee();
