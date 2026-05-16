const light1 = document.getElementById("light1");
const light2 = document.getElementById("light2");

const status1 = document.getElementById("status1");
const status2 = document.getElementById("status2");

const btn2 = document.getElementById("btn2");
const btn3 = document.getElementById("btn3");

let isLight1On = false;
let isLight2On = false;

// Điều khiển đèn 1
btn2.onclick = function () {
    isLight1On = !isLight1On;

    if (isLight1On == true) {
        light1.classList.add("light1-on");
        status1.innerText = "Đèn 1 đang bật";
        btn2.innerText = "OFF";
    } else {
        light1.classList.remove("light1-on");
        status1.innerText = "Đèn 1 đang tắt";
        btn2.innerText = "ON";
    }
};

// Điều khiển đèn 2
btn3.onclick = function () {
    isLight2On = !isLight2On;

    if (isLight2On == true) {
        light2.classList.add("light2-on");
        status2.innerText = "Đèn 2 đang bật";
        btn3.innerText = "OFF";
    } else {
        light2.classList.remove("light2-on");
        status2.innerText = "Đèn 2 đang tắt";
        btn3.innerText = "ON";
    }
};