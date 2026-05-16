import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, update, onValue } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDh7RzlrBo4R9dm5zYldTmdFrO7VLPrLXs",
  authDomain: "xe-can-bang--iot.firebaseapp.com",
  databaseURL: "https://xe-can-bang--iot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xe-can-bang--iot",
  storageBucket: "xe-can-bang--iot.firebasestorage.app",
  messagingSenderId: "779526023492",
  appId: "1:779526023492:web:2154ff4160c5fd8b080f11"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const isLoginPage = !!document.getElementById("loginBtn");
const isBackgroundPage = !!document.querySelector(".menu-wrap");
const isAnglePage = !!document.getElementById("angleValue");
const isPwmPage = !!document.getElementById("pwmValue");
const isAngleTablePage = !!document.getElementById("angleTableBody");
const isPwmTablePage = !!document.getElementById("pwmTableBody");

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = async function () {
      await signOut(auth);
      window.location.href = "login.html";
    };
  }
}

if (isLoginPage) {
  const usernameInput = document.getElementById("usernameInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");

  onAuthStateChanged(auth, function (user) {
    if (user) {
      window.location.href = "background.html";
    }
  });

  if (loginBtn) {
    loginBtn.onclick = async function () {
      const email = usernameInput.value.trim();
      const password = passwordInput.value;
      if (loginError) loginError.textContent = "";

      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "background.html";
      } catch (error) {
        if (loginError) loginError.textContent = "Sai email hoặc mật khẩu.";
      }
    };
  }
} else if (isBackgroundPage) {
  onAuthStateChanged(auth, function (user) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    setupLogout();
  });
} else if (isAnglePage) {
  onAuthStateChanged(auth, function (user) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    setupLogout();

    onValue(ref(db, "telemetry"), function (snapshot) {
      const telemetry = snapshot.val() || {};
      const angle = Number(telemetry.angle ?? 0);
      const angleValue = document.getElementById("angleValue");
      if (angleValue) angleValue.textContent = angle.toFixed(2);
    });
  });
} else if (isPwmPage) {
  onAuthStateChanged(auth, function (user) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    setupLogout();

    onValue(ref(db, "telemetry"), function (snapshot) {
      const telemetry = snapshot.val() || {};
      const pwm = Number(telemetry.pwm ?? 0);
      const pwmValue = document.getElementById("pwmValue");
      if (pwmValue) pwmValue.textContent = String(pwm);
    });
  });
} else if (isAngleTablePage) {
  onAuthStateChanged(auth, function (user) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    setupLogout();

    let latestAngle = 0;
    let samples = [];
    let sampleIndex = 0;
    const maxSamples = 50;

    const tbody = document.getElementById("angleTableBody");
    const clearBtn = document.getElementById("clearAngleTableBtn");

    const chartCtx = document.getElementById("angleChart");
    let angleChart = null;
    if (chartCtx && window.Chart) {
      angleChart = new window.Chart(chartCtx, {
        type: "line",
        data: {
          labels: [],
          datasets: [{
            label: "Góc nghiêng (°)",
            data: [],
            borderColor: "#22d3ee",
            backgroundColor: "rgba(34,211,238,0.2)",
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    onValue(ref(db, "telemetry"), function (snapshot) {
      const telemetry = snapshot.val() || {};
      latestAngle = Number(telemetry.angle ?? 0);
    });

    function renderAngleTable() {
      if (!tbody) return;
      tbody.innerHTML = "";

      for (let i = samples.length - 1; i >= 0; i--) {
        const row = document.createElement("tr");

        const c1 = document.createElement("td");
        c1.textContent = String(samples[i].stt);

        const c2 = document.createElement("td");
        c2.textContent = samples[i].time;

        const c3 = document.createElement("td");
        c3.textContent = samples[i].value.toFixed(2);

        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
        tbody.appendChild(row);
      }
    }

    function pushAngleSample() {
      sampleIndex = sampleIndex + 1;
      const now = new Date();
      const timeText = now.toLocaleTimeString();

      const sample = {
        stt: sampleIndex,
        time: timeText,
        value: latestAngle
      };

      samples.push(sample);
      if (samples.length > maxSamples) {
        samples.shift();
      }

      renderAngleTable();

      if (angleChart) {
        angleChart.data.labels = samples.map(function (item) { return item.time; });
        angleChart.data.datasets[0].data = samples.map(function (item) { return item.value; });
        angleChart.update();
      }
    }

    setInterval(pushAngleSample, 200);

    if (clearBtn) {
      clearBtn.onclick = function () {
        samples = [];
        sampleIndex = 0;
        renderAngleTable();

        if (angleChart) {
          angleChart.data.labels = [];
          angleChart.data.datasets[0].data = [];
          angleChart.update();
        }
      };
    }
  });
} else if (isPwmTablePage) {
  onAuthStateChanged(auth, function (user) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    setupLogout();

    let latestPwm = 0;
    let samples = [];
    let sampleIndex = 0;
    const maxSamples = 50;

    const tbody = document.getElementById("pwmTableBody");
    const clearBtn = document.getElementById("clearPwmTableBtn");

    const chartCtx = document.getElementById("pwmChart");
    let pwmChart = null;
    if (chartCtx && window.Chart) {
      pwmChart = new window.Chart(chartCtx, {
        type: "line",
        data: {
          labels: [],
          datasets: [{
            label: "PWM",
            data: [],
            borderColor: "#22c55e",
            backgroundColor: "rgba(34,197,94,0.2)",
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    onValue(ref(db, "telemetry"), function (snapshot) {
      const telemetry = snapshot.val() || {};
      latestPwm = Number(telemetry.pwm ?? 0);
    });

    function renderPwmTable() {
      if (!tbody) return;
      tbody.innerHTML = "";

      for (let i = samples.length - 1; i >= 0; i--) {
        const row = document.createElement("tr");

        const c1 = document.createElement("td");
        c1.textContent = String(samples[i].stt);

        const c2 = document.createElement("td");
        c2.textContent = samples[i].time;

        const c3 = document.createElement("td");
        c3.textContent = String(samples[i].value);

        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
        tbody.appendChild(row);
      }
    }

    function pushPwmSample() {
      sampleIndex = sampleIndex + 1;
      const now = new Date();
      const timeText = now.toLocaleTimeString();

      const sample = {
        stt: sampleIndex,
        time: timeText,
        value: latestPwm
      };

      samples.push(sample);
      if (samples.length > maxSamples) {
        samples.shift();
      }

      renderPwmTable();

      if (pwmChart) {
        pwmChart.data.labels = samples.map(function (item) { return item.time; });
        pwmChart.data.datasets[0].data = samples.map(function (item) { return item.value; });
        pwmChart.update();
      }
    }

    setInterval(pushPwmSample, 200);

    if (clearBtn) {
      clearBtn.onclick = function () {
        samples = [];
        sampleIndex = 0;
        renderPwmTable();

        if (pwmChart) {
          pwmChart.data.labels = [];
          pwmChart.data.datasets[0].data = [];
          pwmChart.update();
        }
      };
    }
  });
} else {
  let holdTimer = null;
  let repeatTimer = null;
  let holding = false;
  let isStopped = true;

  function commandToState(dir) {
    switch (dir) {
      case "FORWARD": return "Tien";
      case "BACKWARD": return "Lui";
      case "LEFT": return "Trai";
      case "RIGHT": return "Phai";
      default: return "Dung yen";
    }
  }

  function updateUI(data) {
    const state = data?.state ?? "Dung yen";
    const mode = data?.mode ?? "STOP";
    const angle = Number(data?.angle ?? 0);
    const pwm = Number(data?.pwm ?? 0);

    const stateText = document.getElementById("stateText");
    const modeText = document.getElementById("modeText");
    const angleTextEl = document.getElementById("angleText");
    const pwmTextEl = document.getElementById("pwmText");

    if (stateText) stateText.textContent = state;
    if (modeText) modeText.textContent = mode;
    if (angleTextEl) angleTextEl.textContent = angle;
    if (pwmTextEl) pwmTextEl.textContent = pwm;

    let angleBar = Math.abs(angle) * 5;
    if (angleBar > 100) angleBar = 100;
    const angleFill = document.getElementById("angleFill");
    if (angleFill) angleFill.style.width = angleBar + "%";

    let pwmBar = Math.round((pwm / 255) * 100);
    if (pwmBar < 0) pwmBar = 0;
    if (pwmBar > 100) pwmBar = 100;
    const pwmFill = document.getElementById("pwmFill");
    if (pwmFill) pwmFill.style.width = pwmBar + "%";

    isStopped = mode === "STOP";

    const stopBtn = document.getElementById("stopBtn");
    if (stopBtn) {
      if (isStopped) {
        stopBtn.textContent = "RUN";
        stopBtn.className = "btn run";
      } else {
        stopBtn.textContent = "STOP";
        stopBtn.className = "btn stop";
      }
    }
  }

  async function sendDirection(dir) {
    if (isStopped) return;
    await update(ref(db, "control"), {
      direction: dir,
      state: commandToState(dir)
    });
  }

  async function releaseDirection() {
    if (isStopped) return;
    await update(ref(db, "control"), {
      direction: "NONE",
      state: "Dung yen"
    });
  }

  function tap(dir) {
    if (isStopped) return;
    sendDirection(dir).then(function () {
      setTimeout(function () {
        releaseDirection();
      }, 180);
    });
  }

  function holdStart(dir, e) {
    if (isStopped) return;
    e.preventDefault();
    holding = false;

    clearTimeout(holdTimer);
    clearInterval(repeatTimer);

    holdTimer = setTimeout(function () {
      holding = true;
      sendDirection(dir);
      repeatTimer = setInterval(function () {
        sendDirection(dir);
      }, 200);
    }, 180);
  }

  function holdEnd() {
    clearTimeout(holdTimer);
    clearInterval(repeatTimer);

    if (holding && !isStopped) {
      releaseDirection();
    }

    holdTimer = null;
    repeatTimer = null;
    holding = false;
  }

  function setupDashboard() {
    document.querySelectorAll(".dir").forEach(function (btn) {
      const dir = btn.dataset.cmd;

      btn.onclick = function () { tap(dir); };
      btn.onpointerdown = function (e) { holdStart(dir, e); };
      btn.onpointerup = function () { holdEnd(); };
      btn.onpointerleave = function () { holdEnd(); };
      btn.onpointercancel = function () { holdEnd(); };
    });

    const stopBtn = document.getElementById("stopBtn");
    if (stopBtn) {
      stopBtn.onclick = async function () {
        if (isStopped) {
          await update(ref(db, "control"), {
            mode: "RUN",
            state: "RUN",
            direction: "NONE"
          });
        } else {
          await update(ref(db, "control"), {
            mode: "STOP",
            state: "STOP",
            direction: "NONE"
          });
        }
      };
    }

    setupLogout();

    onValue(ref(db, "telemetry"), function (snapshot) {
      const telemetry = snapshot.val() || {};
      const angle = Number(telemetry.angle ?? 0);
      const pwm = Number(telemetry.pwm ?? 0);

      onValue(ref(db, "control"), function (snap2) {
        const control = snap2.val() || {};
        updateUI({
          state: control.state ?? "Dung yen",
          mode: control.mode ?? "STOP",
          angle: angle,
          pwm: pwm
        });
      }, { onlyOnce: true });
    });

    onValue(ref(db, "control"), function (snapshot) {
      const control = snapshot.val() || {};
      const state = control.state ?? "Dung yen";
      const mode = control.mode ?? "STOP";

      const angleTextValue = Number((document.getElementById("angleText") || {}).textContent || 0);
      const pwmTextValue = Number((document.getElementById("pwmText") || {}).textContent || 0);

      updateUI({
        state: state,
        mode: mode,
        angle: angleTextValue,
        pwm: pwmTextValue
      });
    });
  }

  onAuthStateChanged(auth, function (user) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    setupDashboard();
  });
}
