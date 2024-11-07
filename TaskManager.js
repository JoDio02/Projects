const readline = require('readline');
const FS = require('fs');
const { stdin: input, stdout: output } = require('node:process');
const { resolve } = require('path');
const { error } = require('console');
const { title } = require('process');
const { rejects } = require('assert');
const rl = readline.createInterface({ input, output });


function APP(){ 

    var static, id=0;
    var static,  List = new Map();//create static map object

    // read input and call function according to the input command
    rl.on('line', async (input) => {
        switch(input.toLowerCase()){
            case 'add':
                await add()     
                break;
            case 'delete':
                await deleteTask();
                break;
            case "search":
                await searchTask();
                break;
            case "complete":
                await completeTask();
                break;
            case "edit":
                await editTask();
                break;;
            case 'list':
                await list();
            break;
            case 'end':
                rl.close();
                console.log("END OF APP");
                break
            default:
                console.log("Invalid command\n");
        }
    }); 

    // Task class
    class Task{
        constructor(title, status = "Incomplete") {
            this.id = id;
            this.title = title;
            this.status = status;
            id++;
        }
    }

    // funtion declarations

    //when called get the task title and create a new task object with unique id and set it in to the list as the key being task's id
    const add = function() {
        return new Promise((resolve, reject) => {
            rl.question("Title: ", (Title) => {
                FS.writeFileSync(Title+".json","",(err)=>{
                    console.log(err);
                    reject(err);
                })
                List.set(id,new Task(Title))
                console.log("New task is added\n")
                resolve();
            })
        });
    };

    //when called get the task id and delete the task object from the list
    //if "" entered ask if user wants to delete all tasks if "yes" delete all tasks
    const deleteTask = function() { 
        return new Promise((resolve,reject)=>{

            rl.question("Item ID to delete: ", (ItemID) => {
                
                if (List.has(parseInt(ItemID))){

                    ItemID = parseInt(ItemID)
                    FS.unlinkSync(List.get(ItemID).title+".json");
                    List.delete(ItemID);
                    console.log(`Task ${ItemID} is deleted\n`)

                }else if (ItemID===""){

                    rl.question("Are you sure to delete all tasks? ", (Y_N)=>{
                        if (Y_N.toLowerCase() === 'yes'){
                            List.forEach((value, key) => {
                                FS.unlinkSync(`${value.title}.json`,function(err){
                                    return reject(err);
                                });
                                List.delete(key);
                            });
                            console.log("All tasks are deleted\n");
                        }else if(Y_N.toLowerCase() === 'no'){
                            console.log("Task deletion cancelled\n");
                        }else{
                            console.log("No action\n");
                        }
                    })

                }else{ //no tasks was found
                    console.log("No task found\n");
                    return resolve();
                }
                return resolve();
            });
        });
    };

    //change the task's status with given id to completed
    const completeTask = function() {
        return new Promise((resolve, reject) => {
            rl.question("Item ID to complete: ",(ItemID) => {
                ItemID = parseInt(ItemID);
                if (List.has(ItemID)){
                    List.get(ItemID).status="Complete"
                    console.log(`Task ${ List.get(ItemID).id} is completed\n`);
                }else{
                    console.log("No task found\n");
                }
                return resolve();
            })
        });
    };
    
    //rename an existing task with given id
    const editTask = function() {
        return new Promise((resolve,rejects)=>{
            rl.question("Item ID to edit: ",(ItemID)=>{
                ItemID = parseInt(ItemID);
                if(List.has(ItemID)){

                    rl.question("New Title: ",(Title)=>{ 
                        FS.rename(List.get(ItemID).title+".json", Title+".json", (err) => {

                            List.get(ItemID).title = Title;
                            console.log(`Task ${ItemID} is updated\n`);

                            if (err) {
                                console.error('Error renaming file:', err);
                            }
                        });
                    });
                };
            });
        });
    };
    
    //search for tasks with given keyword
    const searchTask = function(){
        return new Promise((resolve,reject) =>{
            rl.question("Keyword: ",(Keyword)=>{
                var ctr = 0;
                console.log("ID:".padEnd(15) + "Title:".padEnd(15) + "Status:");
                List.forEach((value,key) =>{
                    if(value.title.toLowerCase().match(Keyword.toLowerCase())){
                        ctr++;
                        console.log(`${value.id.toString().padEnd(15)}${value.title.padEnd(15)}${value.status}`);
                    }
                });
                console.log();
                if(ctr==0){
                    console.log("No tasks found\n");
                }
            });
        });
    };

    //list all existing tasks in the list
    const list = function() {
        return new Promise((resolve,reject) => {
            console.log("List of tasks:\n");

            console.log("ID:".padEnd(15) + "Title:".padEnd(15) + "Status:");
            List.forEach((value, key) => {
                console.log(`${value.id.toString().padEnd(15)}${value.title.padEnd(15)}${value.status}`);
            });
            console.log();
        });
    };
 
} 
APP() 
  