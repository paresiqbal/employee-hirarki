import inputData from "./JSON/input.json" assert { type: "json" };

function getSuperiors(employeeName, employeeHierarchies) {
  const superiors = [];

  function findSuperiors(name, hierarchies) {
    for (const hierarchy of hierarchies) {
      if (hierarchy.employeeName === name) {
        superiors.push(hierarchy.employeeName);
        for (const directReport of hierarchy.directReports) {
          findSuperiors(directReport, hierarchies);
        }
        break;
      }
    }
  }

  findSuperiors(employeeName, employeeHierarchies);
  return superiors;
}

function generateEmployeeTree(inputData) {
  const outputData = [];

  for (const project of inputData) {
    const employeeHierarchies = [];

    for (const hierarchy of project.employeeHierarchiesToDisplay) {
      const superiors = getSuperiors(hierarchy, project.employeeHierarchies);
      employeeHierarchies.push({
        employee: hierarchy,
        superiors: superiors.reverse(),
      });
    }

    outputData.push({
      projectName: project.projectName,
      employeeHierarchies: employeeHierarchies,
    });
  }

  return outputData;
}

const outputData = generateEmployeeTree(inputData);
console.log(outputData);
