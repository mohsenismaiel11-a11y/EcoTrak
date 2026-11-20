const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const toggle  = document.getElementById('toggle');

function toggleMenu() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}

toggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);
