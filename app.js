const taskform = document.getElementById("task-form");
const tasklist= document.getElementById("task-list");



//Counter to track task index 
let taskIndex =1;


//console.log(taskform, tasklist)



taskform.addEventListener("submit", function(event){
    event.preventDefault(); 

    const taskinput = document.getElementById("task-input");
    const tasktext =taskinput.value.trim(); 
    //console.log(tasktext) ;

    if (tasktext !== ""){ 
        //create a new task  

        const taskitem = document.createElement("li"); 
        taskitem.classList.add("task-item"); 
        taskitem.textcontent = `${taskIndex}-${tasktext}`; 
       
        taskitem.addEventListener("click", function(){
            console.log("Completed");
            this.classList.toggle("Completed");
        })
        //Append the task item to the task list
        tasklist.appendChild(taskitem);

        //Increment the task index 
        taskIndex ++ ; 
        taskinput.value = "";


    }
})

