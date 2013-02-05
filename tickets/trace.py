#-*-coding:utf-8-*-
import requests,re

DEBUG=0

class Trace:
    def __init__(self):
        self.session = requests.Session()
        self.getTraceSessionId()
        self.login()
        self.getGroupOpen()

    def getTraceSessionId(self):
        payload = {'username': 'YOURUSERNAME', 'pwd': 'YOURPASSWORD','goto':'/arsys/traceapp.phx.ebay.com/source/newTrace/getSessionId.jsp'}
        r=self.session.post('https://trace.vip.ebay.com/arsys/servlet/LoginServlet',data=payload)
        self.session.headers.update({'Cookie':'JSESSIONID=%s; Path=/arsys; Secure'%r.text})
        return r

    def login(self):
        payload = {'username': 'YOURUSERNAME', 'pwd': 'YOURPASSWORD'}
        r=self.session.post('http://trace.vip.ebay.com/tracenew/static/console.trace?protocol=http',data=payload)
        return r

    def getGroupOpen(self):
        r=self.session.post('http://trace.vip.ebay.com/arsys/traceapp.phx.ebay.com/source/qualParse.jsp?layout=rdpv_task1&qual=%27600000000%27+%3C+%22Resolved%22+AND+%28%27Assigned+Group%27+%3D+%22Site+Reliability+Engineering%22+OR+%27Assigned+Group%27+%3D+%22staff%22++%29+and+%27600000006%27+%21%3D+%22actionableevent%22&qryname=grp+open&sortcol=&sortby=')
        #Match ["(.*)"]
        regex=re.compile(r"\[\"(.*?)\"\]")
        file=open('tickets.txt','w+')
        #Get All Tickets Data
        for line in regex.findall(r.text):
            file.write('%s\n'%line)
        file.close()
        #Save the Response Content
        if DEBUG:
            file=open('debug.html','w')
            file.write(r.text)
            file.close()
        return r
        
if __name__ == '__main__':
    trace = Trace()
