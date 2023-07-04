import projects from "./JSON/input.json" assert { type: "json" };

function generateEmployeeHierarchies(projects) {
  const output = [];

  projects.forEach((project) => {
    const {
      projectName,
      employees,
      employeeHierarchies,
      employeeHierarchiesToDisplay,
    } = project;
    const employeeHierarchiesResult = [];

    employeeHierarchiesToDisplay.forEach((employeeName) => {
      const superiors = findSuperiors(employeeName, employeeHierarchies);
      if (superiors) {
        employeeHierarchiesResult.push({ employee: employeeName, superiors });
      }
    });

    const error = checkForErrors(
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

function checkForErrors(
  employees,
  employeeHierarchies,
  employeeHierarchiesResult
) {
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

// const projects = [
//   {
//     projectName: "ProjectMidland",
//     employees: [
//       "raelynn",
//       "darin",
//       "kacie",
//       "jordana",
//       "everett",
//       "bertha",
//       "peg",
//       "hugh",
//       "eveleen",
//       "evelina",
//     ],
//     employeeHierarchies: [
//       {
//         employeeName: "raelynn",
//         directReports: ["darin", "kacie"],
//       },
//       {
//         employeeName: "darin",
//         directReports: ["jordana", "everett", "bertha"],
//       },
//       {
//         employeeName: "kacie",
//         directReports: ["peg", "hugh", "eveleen"],
//       },
//       {
//         employeeName: "eveleen",
//         directReports: ["evelina"],
//       },
//     ],
//     employeeHierarchiesToDisplay: ["evelina", "bertha"],
//   },
//   {
//     projectName: "ProjectQuant",
//     employees: ["maurice", "hayleigh", "edwyn", "keane", "kylee"],
//     employeeHierarchies: [
//       {
//         employeeName: "maurice",
//         directReports: ["hayleigh", "edwyn"],
//       },
//       {
//         employeeName: "hayleigh",
//         directReports: ["edwyn", "keane", "kylee"],
//       },
//     ],
//     employeeHierarchiesToDisplay: ["kylee", "edwyn"],
//   },
//   {
//     projectName: "ProjectGeorgia",
//     employees: ["lori", "fletcher", "tabitha", "linton", "tressa", "rosanna"],
//     employeeHierarchies: [
//       {
//         employeeName: "tabitha",
//         directReports: ["linton", "tressa"],
//       },
//     ],
//     employeeHierarchiesToDisplay: ["rosanna"],
//   },
// ];

const output = generateEmployeeHierarchies(projects);
console.log(JSON.stringify(output, null, 2));
