# _*_ coding: iso-8859-1 _*_
# this example has been made with the help of Roger Upole
#
# this method *IS* Windows 2000 compatible
#
# for details about ISensLogon
# see http://msdn.microsoft.com/en-us/library/aa376860(VS.85).aspx
import win32serviceutil
import win32service
import win32api
import servicemanager

# the "magic" import
import isenslogon

svcdeps=["EventLog"]

class ISensLogonService(win32serviceutil.ServiceFramework):
    """
       Definition du service Windows
    """
    _svc_name_ = _svc_display_name_ = 'ISensLogon service'
    _svc_deps_ = svcdeps

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        isenslogon.logevent(self._svc_display_name_, servicemanager.PYS_SERVICE_STARTING)
        self.ReportServiceStatus(win32service.SERVICE_START_PENDING, waitHint=30000)

    def SvcDoRun(self):
        isenslogon.logevent(self._svc_display_name_, servicemanager.PYS_SERVICE_STARTED)
        isenslogon.register()
        self.ReportServiceStatus(win32service.SERVICE_STOPPED)

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        # this does not seem to be the best way to stop PumpMessages()
        # it looks like it stops the whole service
        win32api.PostQuitMessage()
        # I think that's why "stop" events are not logged into Windows Event Manager
        self.ReportServiceStatus(win32service.SERVICE_STOPPED)
        # but it works...
        # one can also use win32api.PostThreadMessage
        # therefor, get the thread ID and call
        # win32api.PostThreadMessage(isenslogon_thread_id, 18)

    #reboot/halt make a different call than 'net stop mytestservice'
    SvcShutdown = SvcStop

if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(ISensLogonService)

