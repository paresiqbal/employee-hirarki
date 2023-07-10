const fs = require("fs");
const projects = require("./input.json");

function makeEmployeeHirarki(projects) {
  const output = [];

  // initiate project element
  projects.forEach((project) => {
    const {
      projectName,
      employees,
      employeeHierarchies,
      employeeHierarchiesToDisplay,
    } = project;

    const employeeHierarchiesResult = [];

    // display employee hirarki
    employeeHierarchiesToDisplay.forEach((employeeName) => {
      const superiors = findSuperiors(employeeName, employeeHierarchies);
      if (superiors) {
        employeeHierarchiesResult.push({ employee: employeeName, superiors });
      }
    });

    // check for error
    const error = checkError(
      employees,
      employeeHierarchies,
      employeeHierarchiesResult
    );

    if (error) {
      output.push({ projectName, error });
    } else {
      output.push({
        projectName,
        employeeHierarchies: employeeHierarchiesResult,
      });
    }
  });

  return output;
}

module.exports = {
  makeEmployeeHirarki: makeEmployeeHirarki,
};

// create superiors
function findSuperiors(employeeName, employeeHierarchies) {
  const superiors = [];

  function searchForSuperiors(name) {
    employeeHierarchies.forEach((hierarchy) => {
      if (hierarchy.directReports.includes(name)) {
        superiors.push(hierarchy.employeeName);
        searchForSuperiors(hierarchy.employeeName);
      }
    });
  }

  searchForSuperiors(employeeName);
  return superiors.length ? superiors : null;
}

function checkError(employees, employeeHierarchies, employeeHierarchiesResult) {
  const employeeSet = new Set(employees);
  const employeesWithoutHierarchy = new Set(employees);

  employeeHierarchies.forEach((hierarchy) => {
    const { employeeName, directReports } = hierarchy;
    employeesWithoutHierarchy.delete(employeeName);
    directReports.forEach((report) => employeesWithoutHierarchy.delete(report));
  });

  if (employeesWithoutHierarchy.size > 0) {
    const error = `unable to process employee tree. ${[
      ...employeesWithoutHierarchy,
    ].join(",")} not having hierarchy`;
    return error;
  }

  const employeeManagerCounts = {};

  employeeHierarchies.forEach((hierarchy) => {
    const { employeeName, directReports } = hierarchy;
    directReports.forEach((report) => {
      if (employeeManagerCounts[report]) {
        employeeManagerCounts[report].push(employeeName);
      } else {
        employeeManagerCounts[report] = [employeeName];
      }
    });
  });

  const invalidManagers = Object.entries(employeeManagerCounts).filter(
    ([_, managers]) => managers.length > 1
  );

  if (invalidManagers.length > 0) {
    const error = `unable to process employee tree. ${invalidManagers
      .map(([employee]) => employee)
      .join(",")} has multiple managers: ${invalidManagers
      .map(([, managers]) => managers.join(","))
      .join(";")}`;
    return error;
  }

  return null;
}

const output = makeEmployeeHirarki(projects);
const outputJSON = JSON.stringify(output, null, 2);

// write the output.json file
fs.writeFile("./output.json", outputJSON, (err) => {
  if (err) {
    console.error("Error writing JSON file:", err);
  } else {
    console.log("Output has been successfuly made.");
  }
});
