document.addEventListener('DOMContentLoaded', function(){

   const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
   const currentTheme = localStorage.getItem('theme');
   const modeLabel = document.getElementById('mode-label');

   if (currentTheme) {
       document.body.classList.toggle('dark-mode', currentTheme === 'dark');
       if (currentTheme === 'dark') {
           toggleSwitch.checked = true;
           if(modeLabel) modeLabel.textContent = "Light Mode";
       }
   }

   function switchTheme(e) {
       if (e.target.checked) {
           document.body.classList.add('dark-mode');
           localStorage.setItem('theme', 'dark');
           if(modeLabel) modeLabel.textContent = "Light Mode";
       } else {
           document.body.classList.remove('dark-mode');
           localStorage.setItem('theme', 'light');
           if(modeLabel) modeLabel.textContent = "Dark Mode";
       }    
   }

   toggleSwitch.addEventListener('change', switchTheme, false);

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

   const taskInput = document.getElementById('taskInput');
   const assigneeInput = document.getElementById('assigneeInput');
   const deadlineInput = document.getElementById('deadlineInput');
   const addTaskBtn = document.getElementById('addTaskBtn');
   const taskList = document.getElementById('taskList');
   const STORAGE_KEY = 'tasks';
   
   let currentMonth = new Date().getMonth();
   let currentYear = new Date().getFullYear();

   function renderCalendar() {
       const calendarDays = document.getElementById('calendarDays');
       const monthYear = document.getElementById('monthYear');
       
       if (!calendarDays || !monthYear) return;

       calendarDays.innerHTML = '';
       
       const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
       monthYear.innerText = `${months[currentMonth]} ${currentYear}`;

       const firstDay = new Date(currentYear, currentMonth, 1).getDay();
       const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

       const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

       for (let i = 0; i < firstDay; i++) {
           const emptyDiv = document.createElement('div');
           emptyDiv.classList.add('calendar-day', 'empty');
           calendarDays.appendChild(emptyDiv);
       }

       for (let i = 1; i <= daysInMonth; i++) {
           const dayDiv = document.createElement('div');
           dayDiv.classList.add('calendar-day');
           dayDiv.innerText = i;

           const today = new Date();
           if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
               dayDiv.classList.add('today');
           }

           const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
           const dayTasks = tasks.filter(t => t.deadline === dateString);

           if (dayTasks.length > 0) {
               dayDiv.classList.add('has-task');
               
               const tooltip = document.createElement('div');
               tooltip.classList.add('calendar-tooltip');
               
               let htmlContent = '';
               dayTasks.forEach(t => {
                   const taskStyle = t.completed ? 'text-decoration: line-through; color: var(--text-light);' : 'font-weight: 600; color: var(--text);';
                   const assigneeHtml = t.assignee ? `<div class="tooltip-assignee">👤 ${t.assignee}</div>` : '';
                   htmlContent += `
                       <div class="tooltip-task">
                           <div style="${taskStyle}">${t.text}</div>
                           ${assigneeHtml}
                       </div>
                   `;
               });
               
               tooltip.innerHTML = htmlContent;
               dayDiv.appendChild(tooltip);
           }

           calendarDays.appendChild(dayDiv);
       }
   }

   const prevMonthBtn = document.getElementById('prevMonth');
   const nextMonthBtn = document.getElementById('nextMonth');

   if(prevMonthBtn && nextMonthBtn) {
       prevMonthBtn.addEventListener('click', () => {
           currentMonth--;
           if (currentMonth < 0) {
               currentMonth = 11;
               currentYear--;
           }
           renderCalendar();
       });

       nextMonthBtn.addEventListener('click', () => {
           currentMonth++;
           if (currentMonth > 11) {
               currentMonth = 0;
               currentYear++;
           }
           renderCalendar();
       });
   }

   function loadTasks(){
       const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
       taskList.innerHTML = '';
       let activeCounter = 1;

       if (tasks.length === 0) {
           taskList.innerHTML = '<li class="empty-state">🎉 You\'re all caught up! Enjoy your day!</li>';
           renderCalendar();
           return;
       }
       
       tasks.forEach((task, index) => {
           if (typeof task === 'string'){
               task = { text: task, completed: false, assignee: '', deadline: '' }
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

           let assigneeHtml = '';
           if (task.assignee) {
               assigneeHtml = `<span class="assignee-badge">${task.assignee}</span>`;
           }

           let deadlineHtml = '';
           if (task.deadline) {
               deadlineHtml = `<span class="deadline-badge">Due: ${task.deadline}</span>`;
           }

           li.innerHTML = `<span class="${textClass}">${numberPrefix}${task.text} ${assigneeHtml} ${deadlineHtml}</span>
                           <div>
                               <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                               <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
                               <button class="${btnClass}" onclick="finishTask(${index})">${btnText}</button>
                           </div>`
           taskList.appendChild(li);
       });
       localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
       renderCalendar();
   }

   function addTask(){
       const taskValue = taskInput.value.trim();
       const assigneeValue = assigneeInput.value.trim(); 
       const deadlineValue = deadlineInput ? deadlineInput.value : ''; 
       
       if(!taskValue) return; 
       
       const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
       
       tasks.push({ 
           text: taskValue, 
           completed: false, 
           assignee: assigneeValue, 
           deadline: deadlineValue 
       });
       
       localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
       
       taskInput.value = '';
       assigneeInput.value = '';
       if(deadlineInput) deadlineInput.value = '';
       loadTasks();
   }

   window.editTask = function(index){
       const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
       const currentTask = tasks[index];
       const currentText = typeof currentTask === 'string' ? currentTask : currentTask.text;
       const currentAssignee = currentTask.assignee || '';
       const currentDeadline = currentTask.deadline || '';

       const updatedTask = prompt("Edit your task:", currentText);
       
       if(updatedTask !== null && updatedTask.trim() !== ""){
           const updatedAssignee = prompt("Edit the person responsible:", currentAssignee);
           const updatedDeadline = prompt("Edit the deadline (YYYY-MM-DD):", currentDeadline);
           
           tasks[index] = { 
               text: updatedTask.trim(), 
               completed: currentTask.completed || false,
               assignee: updatedAssignee !== null ? updatedAssignee.trim() : currentAssignee,
               deadline: updatedDeadline !== null ? updatedDeadline.trim() : currentDeadline
           };
           localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
           loadTasks();
       }
   };

   window.deleteTask = function(index){
       const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
       tasks.splice(index, 1);
       localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
       loadTasks();
   };

   window.finishTask = function(index){
       const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
       if(tasks[index]){
           if(typeof tasks[index] === 'string'){
               tasks[index] = { text: tasks[index], completed: true, assignee: '', deadline: '' };
           } else {
               tasks[index].completed = !tasks[index].completed;
           }
       }
       localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
       loadTasks();
   }

   const KANBAN_KEY = 'kanban';
   const kanbanInput = document.getElementById('kanbanInput');
   const addKanbanBtn = document.getElementById('addKanbanBtn');

   function loadKanban() {
       const kTasks = JSON.parse(localStorage.getItem(KANBAN_KEY)) || [];
       const todo = document.getElementById('kanban-todo');
       const progress = document.getElementById('kanban-progress');
       const done = document.getElementById('kanban-done');
       
       if(todo) todo.innerHTML = '';
       if(progress) progress.innerHTML = '';
       if(done) done.innerHTML = '';

       kTasks.forEach((t, i) => {
           const div = document.createElement('div');
           div.className = 'kanban-item';
           
           let btnHtml = '';
           if(t.status === 'todo') {
               btnHtml = `<button class="k-btn-start" onclick="moveKanban(${i}, 'progress')">Start</button>`;
           } else if(t.status === 'progress') {
               btnHtml = `
                   <button class="k-btn-back" onclick="moveKanban(${i}, 'todo')">Back</button>
                   <button class="k-btn-done" onclick="moveKanban(${i}, 'done')">Done</button>
               `;
           } else if(t.status === 'done') {
               btnHtml = `<button class="k-btn-undo" onclick="moveKanban(${i}, 'progress')">Undo</button>`;
           }

           div.innerHTML = `
               <span>${t.text}</span>
               <div class="k-actions">
                   ${btnHtml}
                   <button class="k-delete" onclick="deleteKanban(${i})">✖</button>
               </div>
           `;
           
           if(t.status === 'todo' && todo) todo.appendChild(div);
           if(t.status === 'progress' && progress) progress.appendChild(div);
           if(t.status === 'done' && done) done.appendChild(div);
       });
   }

   function addKanbanTask() {
       const val = kanbanInput.value.trim();
       if(!val) return;
       const kTasks = JSON.parse(localStorage.getItem(KANBAN_KEY)) || [];
       kTasks.push({ text: val, status: 'todo' });
       localStorage.setItem(KANBAN_KEY, JSON.stringify(kTasks));
       kanbanInput.value = '';
       loadKanban();
   }

   window.moveKanban = function(index, newStatus) {
       const kTasks = JSON.parse(localStorage.getItem(KANBAN_KEY)) || [];
       kTasks[index].status = newStatus;
       localStorage.setItem(KANBAN_KEY, JSON.stringify(kTasks));
       loadKanban();
   }

   window.deleteKanban = function(index) {
       const kTasks = JSON.parse(localStorage.getItem(KANBAN_KEY)) || [];
       kTasks.splice(index, 1);
       localStorage.setItem(KANBAN_KEY, JSON.stringify(kTasks));
       loadKanban();
   }

   if(addKanbanBtn) addKanbanBtn.addEventListener('click', addKanbanTask);
   if(kanbanInput) {
       kanbanInput.addEventListener('keypress', function(e) {
           if(e.key === 'Enter') addKanbanTask();
       });
   }

   const HABIT_KEY = 'habits';
   const habitInput = document.getElementById('habitInput');
   const addHabitBtn = document.getElementById('addHabitBtn');

   function loadHabits() {
       const habits = JSON.parse(localStorage.getItem(HABIT_KEY)) || [];
       const habitList = document.getElementById('habitList');
       if(!habitList) return;
       
       habitList.innerHTML = '';
       const today = new Date().toISOString().split('T')[0];

       habits.forEach((h, i) => {
           const isDoneToday = h.lastDone === today;
           const li = document.createElement('li');
           li.className = 'habit-item';
           
           li.innerHTML = `
               <div class="habit-info">
                   <div class="habit-name">${h.name}</div>
                   <div class="streak-badge">🔥 ${h.streak}</div>
               </div>
               <div class="habit-actions">
                   <button class="habit-check" onclick="checkHabit(${i})" ${isDoneToday ? 'disabled' : ''}>
                       ${isDoneToday ? '✓ Done' : 'Check In'}
                   </button>
                   <button class="habit-delete" onclick="deleteHabit(${i})">✖</button>
               </div>
           `;
           habitList.appendChild(li);
       });
   }

   function addHabit() {
       const val = habitInput.value.trim();
       if(!val) return;
       const habits = JSON.parse(localStorage.getItem(HABIT_KEY)) || [];
       habits.push({ name: val, streak: 0, lastDone: '' });
       localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
       habitInput.value = '';
       loadHabits();
   }

   window.checkHabit = function(index) {
       const habits = JSON.parse(localStorage.getItem(HABIT_KEY)) || [];
       const today = new Date().toISOString().split('T')[0];
       
       if(habits[index].lastDone === today) return;

       let yest = new Date();
       yest.setDate(yest.getDate() - 1);
       let yestStr = yest.toISOString().split('T')[0];

       if(habits[index].lastDone === yestStr) {
           habits[index].streak++;
       } else {
           habits[index].streak = 1;
       }
       
       habits[index].lastDone = today;
       localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
       loadHabits();
   }

   window.deleteHabit = function(index) {
       const habits = JSON.parse(localStorage.getItem(HABIT_KEY)) || [];
       habits.splice(index, 1);
       localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
       loadHabits();
   }

   if(addHabitBtn) addHabitBtn.addEventListener('click', addHabit);
   if(habitInput) {
       habitInput.addEventListener('keypress', function(e) {
           if(e.key === 'Enter') addHabit();
       });
   }

   window.toggleModule = function(moduleId) {
       const module = document.getElementById(moduleId);
       if(module) module.classList.toggle('open');
   };

   if(addTaskBtn) addTaskBtn.addEventListener('click', addTask);
   
   if(taskInput) {
       taskInput.addEventListener('keypress', function(e){
           if(e.key === 'Enter') addTask();
       });
   }
   if(assigneeInput) {
       assigneeInput.addEventListener('keypress', function(e){
           if(e.key === 'Enter') addTask();
       });
   }

   const contactForm = document.getElementById('contactForm');
   if (contactForm) {
       contactForm.addEventListener('submit', function(e){
           e.preventDefault();
           contactForm.reset();
           alert("Thank you for reaching out! Your message has been sent successfully.");
       });
   }

   loadTasks();
   loadKanban();
   loadHabits();
});