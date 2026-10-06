let employees = [];
const newId = generateEmployeeId();


function generateEmployeeId() { 
  let count = 3; 
 
  return function() { 
    return ++count;
  }; 
}

function processEmployee(employee , callback){
    return callback(employee);
}

function salaryFormat(user){
    return "₹"+user.salary.toLocaleString("en-IN");
}

function resultformat(user){
    return `
        <tr>
            <td>${user.name}</td>
            <td>${user.department}</td>
            <td>${processEmployee(user , salaryFormat)}</td>
            <td><button class="delete-btn" data-id="${user.id}">Delete</button></td>
        </tr>`
}


function employeeSummary(user){
    return `${user.name} | ${user.department} | ₹${user.salary.toLocaleString("en-IN")}`;
}


// fetches emp data and stores in the above employees
async function employeesData(){
    document.getElementById("loadingOverlay").classList.add("active");
    try{
        await new Promise(resolve => setTimeout(resolve, 2000)); // testing delay

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


// first three small tabs of statistics board starts 
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

// Ends here

// Search and employee list and filter operation mention here 
document.getElementById("searchEmployee").addEventListener("input", () => {
    employeeslist();
});

document.getElementById("departmentFilter").addEventListener("change", () => {
    employeeslist();
});

document.getElementById("salarySort").addEventListener("change", () => {
    employeeslist();
});


function employeeslist(){
    let tableBody = document.getElementById("employeeTable");
    let deptFilterId = document.getElementById("departmentFilter").value;
    let listSortOrder = document.getElementById("salarySort").value;
    let query = document.getElementById("searchEmployee").value.trim().toLowerCase();


    tableBody.innerHTML = ""; // clear existing content first, so we don't duplicate rows on re-run
    let sortedEmpList = employees.filter(emp =>
        (deptFilterId === "All" || emp.department === deptFilterId ) && 
        (emp.name.toLowerCase().includes(query) || emp.department.toLowerCase().includes(query))       
    );
    if(listSortOrder === "high-low"){
        sortedEmpList = sortedEmpList.sort((a , b ) => b.salary - a.salary);
    }
    else{
        sortedEmpList = sortedEmpList.sort((a , b ) => a.salary - b.salary);
    }
    for (let user of sortedEmpList) {
        let row = processEmployee(user , resultformat);
        tableBody.innerHTML += row; // append this row's HTML to what's already there
        console.log(processEmployee(user, employeeSummary));
    }
}




// Adding Employee in the list
let addForm = document.getElementById("addEmployeeForm");
addForm.addEventListener("submit", (event) => {
    event.preventDefault();
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

    let id = newId();
    employees.push({ id, name, department, salary });
    console.log(JSON.stringify(employees[employees.length-1]));

    document.getElementById("name").value = "";
    document.getElementById("salary").value = "";
}


// Department Wise Distribution of List
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

// Employee Table List for Deletion 
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


// Starting load in the dashboard for initialization
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
    document.getElementById("statusMessage").textContent = "";
    loadEmployees();
});

function init(){
    loadEmployees();
}

init();