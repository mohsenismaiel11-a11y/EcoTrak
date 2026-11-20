const dropdown = document.getElementById('dropdown');
const btn      = document.getElementById('dropdown-btn');
const list     = document.getElementById('dropdown-list');
const status   = document.getElementById('bars-status');

let selected = null;   // الشركة المختارة

const ready = loadPrices();
ready.then(() => { status.textContent = goldStatusText(); });

companies.forEach((c, i) => {
  const li = document.createElement('li');
  li.textContent = c.name;
  li.addEventListener('click', () => {
    btn.textContent = c.name;
    dropdown.classList.remove('open');
    selected = i;
    ready.then(showBars);
  });
  list.appendChild(li);
});

btn.addEventListener('click', () => dropdown.classList.toggle('open'));
document.addEventListener('click', e => {
  if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
});

function renderBars(metal, gridId) {
  const fee = companies[selected][metal];
  document.getElementById(gridId).innerHTML = barWeights[metal].map(w => `
    <div class="bar-card">
      <i class="fa-solid fa-cubes"></i>
      <h3>سبيكة ${barLabel(w)}</h3>
      <p class="price">${fmt(barTotal(metal, selected, w))}</p>
      <span>جنيه</span>
      <span class="fee">مصنعية ${fee} جنيه / جرام</span>
    </div>`).join('');
}

function showBars() {
  if (selected === null) return;
  renderBars('gold',   'gold-bars');
  renderBars('silver', 'silver-bars');
}