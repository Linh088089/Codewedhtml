import sys
import random

from PyQt5 import QtWidgets, QtCore
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

from dieukhienthietbi import Ui_MainWindow
import image_rc


class MainApp(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__()

        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)

        # ===== TẠO BIỂU ĐỒ =====
        self.figure = Figure(figsize=(5, 3))
        self.canvas = FigureCanvas(self.figure)

        self.layout_bieudo = QtWidgets.QVBoxLayout(self.ui.widget_bieudo)
        self.layout_bieudo.addWidget(self.canvas)

        self.ax = self.figure.add_subplot(111)
        self.ax.set_title("Biểu đồ thông số môi trường")
        self.ax.set_xlabel("Lần đo")
        self.ax.set_ylabel("Giá trị")

        self.data_nhiet_do = []
        self.data_do_am = []
        self.data_anh_sang = []
        self.dem = []
        self.count = 0

        # ===== GÁN NÚT BẤM =====
        self.ui.pushButton.clicked.connect(self.quat_on)
        self.ui.pushButton_2.clicked.connect(self.quat_off)

        self.ui.pushButton_3.clicked.connect(self.tivi_on)
        self.ui.pushButton_4.clicked.connect(self.tivi_off)

        self.ui.pushButton_6.clicked.connect(self.den_on)
        self.ui.pushButton_5.clicked.connect(self.den_off)

        # ===== TIMER CẬP NHẬT THÔNG SỐ =====
        self.timer = QtCore.QTimer()
        self.timer.timeout.connect(self.cap_nhat_thong_so)
        self.timer.start(1000)

        self.cap_nhat_thong_so()

    # ===== HÀM ĐIỀU KHIỂN QUẠT =====
    def quat_on(self):
        self.ui.label_5.setStyleSheet("image: url(:/newPrefix/image/Quaton.png);")
        print("Bật quạt")

    def quat_off(self):
        self.ui.label_5.setStyleSheet("image: url(:/newPrefix/image/Quat.png);")
        print("Tắt quạt")

    # ===== HÀM ĐIỀU KHIỂN TIVI =====
    def tivi_on(self):
        self.ui.label_6.setStyleSheet("image: url(:/newPrefix/image/tivion.png);")
        print("Bật tivi")

    def tivi_off(self):
        self.ui.label_6.setStyleSheet("image: url(:/newPrefix/image/tivi.png);")
        print("Tắt tivi")

    # ===== HÀM ĐIỀU KHIỂN ĐÈN =====
    def den_on(self):
        self.ui.label_7.setStyleSheet("image: url(:/newPrefix/image/bongdenon.png);")
        print("Bật đèn")

    def den_off(self):
        self.ui.label_7.setStyleSheet("image: url(:/newPrefix/image/bongden.png);")
        print("Tắt đèn")

    # ===== CẬP NHẬT THÔNG SỐ + BIỂU ĐỒ =====
    def cap_nhat_thong_so(self):
        nhiet_do = random.randint(25, 35)
        do_am = random.randint(50, 90)
        anh_sang = random.randint(100, 1000)

        self.ui.label_8.setText(
            f"<html><head/><body><p><span style='font-size:12pt; font-weight:600;'>NHIỆT ĐỘ: </span>"
            f"<span style='font-size:12pt;'>{nhiet_do} °C</span></p></body></html>"
        )

        self.ui.label_9.setText(
            f"<html><head/><body><p><span style='font-size:12pt; font-weight:600;'>ĐỘ ẨM: </span>"
            f"<span style='font-size:12pt;'>{do_am} %</span></p></body></html>"
        )

        self.ui.label_10.setText(
            f"<html><head/><body><p><span style='font-size:12pt; font-weight:600;'>ÁNH SÁNG: </span>"
            f"<span style='font-size:12pt;'>{anh_sang} lux</span></p></body></html>"
        )
        self.count += 1

        self.dem.append(self.count)
        self.data_nhiet_do.append(nhiet_do)
        self.data_do_am.append(do_am)
        self.data_anh_sang.append(anh_sang)

        if len(self.dem) > 10:
            self.dem.pop(0)
            self.data_nhiet_do.pop(0)
            self.data_do_am.pop(0)
            self.data_anh_sang.pop(0)

        self.ax.clear()
        self.ax.set_title("Biểu đồ thông số môi trường")
        self.ax.set_xlabel("Lần đo")
        self.ax.set_ylabel("Giá trị")

        self.ax.plot(self.dem, self.data_nhiet_do, label="Nhiệt độ")
        self.ax.plot(self.dem, self.data_do_am, label="Độ ẩm")
        self.ax.plot(self.dem, self.data_anh_sang, label="Ánh sáng")
        self.ax.set_xlim(max(1, self.count - 9), self.count + 1)

        self.ax.legend()
        self.canvas.draw()


if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    window = MainApp()
    window.show()
    sys.exit(app.exec_())