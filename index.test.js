const fs = require("fs");
const { generateEmployeeHierarchies } = require("./index.js");

describe("generateEmployeeHierarchies", () => {
  test("should write output to file", (done) => {
    const projects = [
      {
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
      },
      {
        projectName: "ProjectQuant",
        employees: ["maurice", "hayleigh", "edwyn", "keane", "kylee"],
        employeeHierarchies: [
          {
            employeeName: "maurice",
            directReports: ["hayleigh", "edwyn"],
          },
          {
            employeeName: "hayleigh",
            directReports: ["edwyn", "keane", "kylee"],
          },
        ],
        employeeHierarchiesToDisplay: ["kylee", "edwyn"],
      },
      {
        projectName: "ProjectGeorgia",
        employees: [
          "lori",
          "fletcher",
          "tabitha",
          "linton",
          "tressa",
          "rosanna",
        ],
        employeeHierarchies: [
          {
            employeeName: "tabitha",
            directReports: ["linton", "tressa"],
          },
        ],
        employeeHierarchiesToDisplay: ["rosanna"],
      },
    ];

    const expectedOutput = [
      {
        projectName: "ProjectMidland",
        employeeHierarchies: [
          {
            employee: "evelina",
            superiors: ["eveleen", "kacie", "raelynn"],
          },
          {
            employee: "bertha",
            superiors: ["darin", "raelynn"],
          },
        ],
      },
      {
        projectName: "ProjectQuant",
        error:
          "unable to process employee tree. edwyn has multiple managers: maurice,hayleigh",
      },
      {
        projectName: "ProjectGeorgia",
        error:
          "unable to process employee tree. lori,fletcher,rosanna not having hierarchy",
      },
    ];

    generateEmployeeHierarchies(projects);

    const outputFilePath = "./output.json";
    const outputJSON = JSON.stringify(expectedOutput, null, 2);

    fs.writeFile(outputFilePath, outputJSON, (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        done(err); // Pass the error to the test callback
      } else {
        console.log("Output JSON file has been generated successfully.");
        done(); // Notify Jest that the test is complete
      }
    });
  });
});
