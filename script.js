document.addEventListener('DOMContentLoaded', function(){
	const links = document.querySelectorAll('.nav-links a');
	const sections = document.querySelectorAll('.section');
	const menuToggle = document.querySelector('.menu-toggle');
	const navLinks = document.querySelector('.nav-links');

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
		tasks.forEach((task, index) => {
			const li = document.createElement('li');
			li.className = 'task-item';
			li.innerHTML = `<span class="task-text">${task}</span><button class="delete-btn" onclick="deleteTask(${index})">Delete</button>`;
			taskList.appendChild(li);
		});
	}

	function addTask(){
		const task = taskInput.value.trim();
		if(!task) return;
		const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
		tasks.push(task);
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

	addTaskBtn.addEventListener('click', addTask);
	taskInput.addEventListener('keypress', function(e){
		if(e.key === 'Enter') addTask();
	});

	loadTasks();
});

