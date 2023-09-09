// console.log("hello world");
// console.log(process.argv[2]);

// if(process.argv[2] == "add"){
//     console.log("adding");
// }

// proccess.argv is an array that contains the command line arguments.and the first element is always node, and the second element is always the path to your script file.

// but insted of using process.argv there is a package commander.js which is used to make command line arguments more user friendly.

import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs";
const program = new Command();

const filePath = "./courses.json";

const questions = [
  {
    type: "input",
    name: "name",
    message: "What is the name of the course?",
  },
  {
    type: "number",
    name: "price",
    message: "What is the price of the course?",
  },
];

program
  .name("alfarra.js")
  .version("1.0.0")
  .description("A simple command line tool for add courses");

program
  .command("add")
  .description("Add a course")
  .action(() => {
    inquirer.prompt(questions).then((answers) => {
      if (fs.existsSync(filePath)) {
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.log(`the error is ${err}`);
            process.exit(1);
          }
          if (data) {
            const courses = JSON.parse(data);
            courses.push(answers);
            fs.writeFileSync(filePath, JSON.stringify(courses));
          } else {
            fs.appendFileSync(filePath, JSON.stringify([answers]));
          }
        });
      }
    });
  });

program
  .command("list")
  .description("List all courses")
  .action(() => {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.log(`the error is ${err}`);
          process.exit(1);
        }
        if (data) {
          const courses = JSON.parse(data);
          console.table(courses);
        }
      });
    }
  });

program
  .command("delete <index>")
  .description("Delete a course")
  .action((index) => {
    let courses = JSON.parse(fs.readFileSync(filePath, "utf8"));
    courses.forEach((element, arrIndex) => {
      if (arrIndex == index) {
        courses.splice(index, 1);
        fs.writeFileSync(filePath, JSON.stringify(courses));
        console.log("course deleted successfully");
      }
    });
  });

program
  .command("update <index>")
  .description("Update a course")
  .action((index) => {
    inquirer.prompt(questions).then((answers) => {
      let courses = JSON.parse(fs.readFileSync(filePath, "utf8"));
      courses.forEach((element, arrIndex) => {
        if (arrIndex == index) {
          courses.splice(index, 1, answers);
          fs.writeFileSync(filePath, JSON.stringify(courses));
          console.log("course updated successfully");
        }
      });
    });
  });
    
program.parse(process.argv);
