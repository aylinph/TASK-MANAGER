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
});
