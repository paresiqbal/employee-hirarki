function generateEmployeeHierarchies(data) {
  const { projectName, employeeHierarchiesToDisplay } = data;

  const employeeHierarchies = employeeHierarchiesToDisplay.map(
    (employeeName) => {
      const superiors = findSuperiors(employeeName, data.employeeHierarchies);
      return { employee: employeeName, superiors };
    }
  );

  return { projectName, employeeHierarchies };
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
  return superiors;
}

// Example usage
const data = {
  projectName: "ProjectMidland",
  employees: [
    "raelynn",
    "darin",
    "kacie",
    "jordana",
    "everett",
    "bertha",
    "peg",
    "hugh",
    "eveleen",
    "evelina",
  ],
  employeeHierarchies: [
    {
      employeeName: "raelynn",
      directReports: ["darin", "kacie"],
    },
    {
      employeeName: "darin",
      directReports: ["jordana", "everett", "bertha"],
    },
    {
      employeeName: "kacie",
      directReports: ["peg", "hugh", "eveleen"],
    },
    {
      employeeName: "eveleen",
      directReports: ["evelina"],
    },
  ],
  employeeHierarchiesToDisplay: ["evelina", "bertha"],
};

const output = generateEmployeeHierarchies(data);
console.log(JSON.stringify(output, null, 2));
