import dataEmployee from "./JSON/input.json" assert { type: "json" };

const projects = dataEmployee;

function EmployeeHirarki(employees, employeeHierarchies, employeeName) {
  const employee = employeeHierarchies.find(
    (item) => item.employeeName === employeeName
  );

  if (!employee) {
    return { employee: employeeName, superiors: [] };
  }

  const superiors = [];
  let currentEmployee = employee;

  while (currentEmployee) {
    superiors.unshift(currentEmployee.employeeName);
    const manager = employeeHierarchies.find((item) =>
      item.directReports.includes(currentEmployee.employeeName)
    );

    if (manager && manager.employeeName !== employeeName) {
      if (superiors.includes(manager.employeeName)) {
        throw new Error(
          `unable to process employee tree. ${
            currentEmployee.employeeName
          } has multiple managers: ${superiors.join(",")}`
        );
      }
      superiors.unshift(manager.employeeName);
    }

    currentEmployee = manager;
  }

  return { employee: employeeName, superiors };
}

function EmployeeStruktur(projects) {
  const result = [];

  projects.forEach((project) => {
    const projectName = project.projectName;
    const employeeHierarchies = project.employeeHierarchies;

    const employeeHierarchiesToDisplay =
      project.employeeHierarchiesToDisplay.map((employeeName) => {
        try {
          return EmployeeHirarki(
            project.employees,
            employeeHierarchies,
            employeeName
          );
        } catch (error) {
          return { employee: employeeName, error: error.message };
        }
      });

    result.push({
      projectName,
      employeeHierarchies: employeeHierarchiesToDisplay,
    });
  });

  return result;
}

const output = EmployeeStruktur(projects);
console.log(output);
