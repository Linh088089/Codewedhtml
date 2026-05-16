// Lấy các phần tử cần thao tác trong giao diện
const body = document.body;
const lamp = document.getElementById('lamp');
const statusText = document.getElementById('statusText');
const btnOn = document.getElementById('btnOn');
const btnOff = document.getElementById('btnOff');

// Hàm bật đèn: đổi màu bóng, đổi nền và đổi trạng thái chữ
function turnOnLight() {
  lamp.classList.remove('off');
  lamp.classList.add('on');

  body.classList.remove('off');
  body.classList.add('on');

  statusText.textContent = 'Đèn đang BẬT';
}

// Hàm tắt đèn: đưa giao diện về trạng thái tối ban đầu
function turnOffLight() {
  lamp.classList.remove('on');
  lamp.classList.add('off');

  body.classList.remove('on');
  body.classList.add('off');

  statusText.textContent = 'Đèn đang TẮT';
}

// Gắn sự kiện cho nút bật và tắt đèn
btnOn.addEventListener('click', turnOnLight);
btnOff.addEventListener('click', turnOffLight);
