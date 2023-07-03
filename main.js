const employees = [
  {
    employeeName: "kacie",
    directReports: ["peg", "hugh", "eveleen"],
  },
  {
    employeeName: "eveleen",
    directReports: ["evelina"],
  },
];

const targetEmployee = "evelina";
const superiors = [];

employees.forEach((employee) => {
  if (employee.directReports.includes(targetEmployee)) {
    superiors.push(employee.employeeName);
  }
});

const output = {
  employee: targetEmployee,
  superiors: superiors,
};

console.log(output);
