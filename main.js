const readlineSync = require('readline-sync');

const employees = [
  { id: 1, name: "John", department: "IT", salary: 60000 },
  { id: 2, name: "Sarah", department: "HR", salary: 50000 },
  { id: 3, name: "Mike", department: "Finance", salary: 70000 }
];

function totalEmployee(){
    console.log(employees.length);
}

function salarybudget(){
    let totalSalary = employees.reduce((acc, curr) => acc + curr.salary, 0);
    console.log(totalSalary);
}

function averageSalary(){
    let totalSalary = employees.reduce((acc, curr) => acc + curr.salary, 0);
    let average = totalSalary / employees.length;
    console.log(average);
}

function searchEmployee(){
    let userName = readlineSync.question("name: ");
    let results = employees.filter(emp => emp.name.toLowerCase().includes(userName.toLowerCase()));
    console.log(results);
}

function employeeslist(){
    console.log(employees);
}

function addingEmployee(){
    let id = employees.length + 1;
    let name = readlineSync.question("UserName");
    let department = readlineSync.question("Department");
    let salary = Number(readlineSync.question("salary"));
    employees.push({ id, name, department, salary });
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
    console.log(departmentList);
}