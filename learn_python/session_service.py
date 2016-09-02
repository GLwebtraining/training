# _*_ coding: iso-8859-1 _*_

# This example is based on "win32/Demos/service/serviceEvents.py"

# The session event dectection is *NOT* Windows 2000 compatible
# it is only available since Windows XP
# see http://msdn.microsoft.com/en-us/library/ms683241(VS.85).aspx

import win32serviceutil
import win32service
import win32event
import win32ts
import servicemanager
import win32security
import win32process
import win32profile
import win32con


svcdeps=["EventLog"]

class SessionService(win32serviceutil.ServiceFramework):
    """
       Definition du service Windows
    """
    _svc_name_ = 'MyTestServ'
    _svc_display_name_ = 'My test service  (long name)'
    _svc_deps_ = svcdeps

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        logevent(self._svc_display_name_, servicemanager.PYS_SERVICE_STARTING)
        self.ReportServiceStatus(win32service.SERVICE_START_PENDING, waitHint=30000)
        self.stop_event = win32event.CreateEvent(None, 0, 0, None)

    def GetAcceptedControls(self):
        # Accept SESSION_CHANGE control
        rc = win32serviceutil.ServiceFramework.GetAcceptedControls(self)
        rc |= win32service.SERVICE_ACCEPT_SESSIONCHANGE
        return rc

    # All extra events are sent via SvcOtherEx (SvcOther remains as a
    # function taking only the first args for backwards compat)
    def SvcOtherEx(self, control, event_type, data):
        # This is only showing a few of the extra events - see the MSDN
        # docs for "HandlerEx callback" for more info.
        if control == win32service.SERVICE_CONTROL_SESSIONCHANGE:
            sess_id = data[0]
            if event_type == 5: # logon
                msg = "Logon event: type=%s, sessionid=%s\n" % (event_type, sess_id)
                user_token = win32ts.WTSQueryUserToken(int(sess_id))
            elif event_type == 6: # logoff
                msg = "Logoff event: type=%s, sessionid=%s\n" % (event_type, sess_id)
            else:
                msg = "Other session event: type=%s, sessionid=%s\n" % (event_type, sess_id)
            try:
                for key, val in self.GetUserInfo(sess_id).items():
                    msg += '%s : %s\n'%(key, val)
            except Exception, e:
                msg += '%s'%e
            logevent(msg)

    def GetUserInfo(self, sess_id):
        sessions = win32security.LsaEnumerateLogonSessions()[:-5]
        for sn in sessions:
            sn_info = win32security.LsaGetLogonSessionData(sn)
            if sn_info['Session'] == sess_id:
                return sn_info

    def SvcDoRun(self):
        logevent(self._svc_display_name_, servicemanager.PYS_SERVICE_STARTED)
        win32event.WaitForSingleObject(self.stop_event, win32event.INFINITE)
        self.ReportServiceStatus(win32service.SERVICE_STOPPED)

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.stop_event)

    #reboot/halt make a different call than 'net stop mytestservice'
    SvcShutdown = SvcStop


def logevent(msg, evtid=0xF000):
    """log into windows event manager
    """
    servicemanager.LogMsg(
            servicemanager.EVENTLOG_INFORMATION_TYPE,
            evtid, #  generic message
            (msg, '')
            )

if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(SessionService)
