document.addEventListener('DOMContentLoaded', function(){
   const links = document.querySelectorAll('.nav-links a');
   const sections = document.querySelectorAll('.section');
   const menuToggle = document.querySelector('.menu-toggle');
   const navLinks = document.querySelector('.nav-links');

   const getStartedBtn = document.getElementById('getStartedBtn');
   if (getStartedBtn) {
    getStartedBtn.addEventListener('click', function(){
        showSection('services');
    });
   }

   

   function showSection(id){
       sections.forEach(s=> s.classList.toggle('show', s.id === id));
       links.forEach(a=> a.classList.toggle('active', a.dataset.section === id));
       if(navLinks.classList.contains('open')) navLinks.classList.remove('open');
   }


   links.forEach(a=>{
       a.addEventListener('click', function(e){
           e.preventDefault();
           const target = this.dataset.section;
           showSection(target);
       });
   });


   menuToggle.addEventListener('click', function(){
       navLinks.classList.toggle('open');
   });


   /* Task Manager */
   const taskInput = document.getElementById('taskInput');
   const addTaskBtn = document.getElementById('addTaskBtn');
   const taskList = document.getElementById('taskList');
   const STORAGE_KEY = 'tasks';


   function loadTasks(){
       const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
       taskList.innerHTML = '';
       let activeCounter = 1;
       tasks.forEach((task, index) => {


           if (typeof task === 'string'){
               task = { text: task, completed: false}
           }
           const li = document.createElement('li');
           li.className = 'task-item';


           const textClass = task.completed ? 'task-text completed' : 'task-text';
           const btnText = task.completed ? 'Completed' : 'Done';
           const btnClass = task.completed ? 'finish-btn completed' : 'finish-btn';

           let numberPrefix = '';
           if (!task.completed){
            numberPrefix = `${activeCounter}. `;
            activeCounter++;
           }

           li.innerHTML = `<span class="${textClass}">${numberPrefix}${task.text}</span>
                           <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
                           <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                           <button class="${btnClass}" onclick="finishTask(${index})">${btnText}</button>`
           taskList.appendChild(li);
       });
       localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
   }


   function addTask(){
       const taskValue = taskInput.value.trim();
       if(!taskValue) return;
       const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
       tasks.push({ text: taskValue, completed: false});
       localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
       taskInput.value = '';
       loadTasks();
   }


   window.deleteTask = function(index){
       const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
       tasks.splice(index, 1);
       localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
       loadTasks();
   };


   window.editTask = function(index){
       const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
       const currentText = typeof tasks[index] === 'string' ? tasks[index] : tasks[index].text;
       const updatedTask = prompt("Edit your task:", currentText);
       if(updatedTask !== null && updatedTask.trim() !== ""){
           tasks[index] = { text: updatedTask.trim(), completed: tasks[index].completed || false };
           localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
           loadTasks();
       }
   };


   window.finishTask = function(index){
       const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
       if(tasks[index]){
           if(typeof tasks[index] === 'string'){
               tasks[index] = { text: tasks[index], completed: true };
           } else {
               tasks[index].completed = !tasks[index].completed;
           }
       }
       localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
       loadTasks()
   }


   addTaskBtn.addEventListener('click', addTask);
   taskInput.addEventListener('keypress', function(e){
       if(e.key === 'Enter') addTask();
   });


   loadTasks();

   const contactForm = document.getElementById('contactForm')
   if (contactForm) {
    contactForm.addEventListener('submit', function(e){
        e.preventDefault();
        contactForm.reset();
        alert("Thank you for reaching out! Your message has been sent successfully.");
    })
   }
});





