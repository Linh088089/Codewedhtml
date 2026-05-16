const light = document.getElementById("light");

const statusText = document.getElementById("status");

const button = document.getElementById("btn");

let isLightOn = false;

button.onclick = function () {
    isLightOn = !isLightOn;

    if (isLightOn == true) {
        light.classList.add("light-on");
        statusText.innerText = "Đèn đang bật";
        button.innerText = "Tắt đèn";
    } else {
        light.classList.remove("light-on");
        statusText.innerText = "Đèn đang tắt";
        button.innerText = "Bật đèn";
    }
};