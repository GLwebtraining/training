import sys
from PyQt5.QtWidgets import (QWidget, QToolTip, QPushButton, QApplication, QMessageBox, QDesktopWidget, QPushButton, QHBoxLayout, QVBoxLayout)
from PyQt5.QtCore import QCoreApplication
from PyQt5.QtGui import QIcon

class Window(QWidget):
	def __init__(self):
		super().__init__()
		self.initUI()

	def initUI(self):
		btn = QPushButton('Settings', self)
		btn.clicked.connect(QCoreApplication.instance().quit)

		okButton = QPushButton("OK")
		cancelButton = QPushButton("Cancel")

		hbox = QHBoxLayout()
		hbox.addStretch(1)
		hbox.addWidget(okButton)
		hbox.addWidget(cancelButton)

		vbox = QVBoxLayout()
		vbox.addStretch(1)
		vbox.addLayout(hbox)

		self.setLayout(vbox)

		self.setGeometry(300, 300, 300, 220)
		self.center()

		self.setWindowTitle('Icon')
		self.setWindowIcon(QIcon('search_16.png'))

		self.show()

	def center(self):
		qr = self.frameGeometry()
		cp = QDesktopWidget().availableGeometry().center()
		qr.moveCenter(cp)
		self.move(qr.topLeft())

	def closeEvent(self, event):
		reply = QMessageBox.question(self, 'Message', 'Are you sure to quit?', QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
		if(reply == QMessageBox.Yes):
			event.accept()
		else:
			event.ignore()


if __name__ == '__main__':
	app  = QApplication(sys.argv)

	simple = Window()

	sys.exit(app.exec_())
