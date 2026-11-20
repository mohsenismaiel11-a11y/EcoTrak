// ===== 1) رسالة ترحيب حسب الوقت =====
const hour = new Date().getHours();
let greeting;

if (hour < 12) {
  greeting = 'Good morning.';
} else if (hour < 18) {
  greeting = 'Good evening';
} else {
  greeting = 'Good night';
}

document.getElementById('greeting').textContent = greeting;

// ===== 2) آخر تحديث (التاريخ والوقت الحالي) =====
const now = new Date();
document.getElementById('last-update').textContent =
  'آخر تحديث: ' + now.toLocaleString('ar-EG');