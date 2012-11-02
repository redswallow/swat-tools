import xlrd,urllib2,re,simplejson as json,os,time,threading,Queue
import getopt,sys
from runtime import runTime
from logger import log
from BeautifulSoup import BeautifulSoup

import numpy as np  
import matplotlib  
matplotlib.use('Agg')  
from matplotlib.pyplot import fill_between,plot,savefig,figure,title

"""configuration"""
XLS_FILE="grid.xls"
INIT_URL="http://sj-sre002.sjc.ebay.com:8080/ex/c/trend"
EX_URL_H="http://sj-sre002.sjc.ebay.com:8080/ex/c/trend?trendType=error&poolName=[poolname]&dtOverride=2"
EX_URL_D="http://sj-sre002.sjc.ebay.com:8080/ex/c/trend?trendType=error&poolName=[poolname]&dtOverride=3"
EX_URL=EX_URL_D
EX_JSON_URL=EX_URL.replace("trend?", "trend/detailJSON?");
queue=Queue.Queue()
cell_elements=[]
lock = threading.Lock()  

@runTime
def read_xls(filename):
    book = xlrd.open_workbook(filename)
    booksheet = book.sheet_by_index(0)
    for rows in xrange(1, booksheet.nrows, 1):
        task_id=booksheet.cell_value(rows,0)
        assignee=booksheet.cell_value(rows,6)
        title=booksheet.cell_value(rows,7)
        title=title.replace(" -- ","--").replace(" --","--");
        if "PDSRV" in task_id:
            cell_elements.append([task_id]+title.split("--")+[assignee])
    return cell_elements

def get_error_trend_url(pool_name,title):
    url=EX_URL.replace("[poolname]",pool_name)
    log("log.txt",url)

@runTime
def get_error_trend_json(pool_name,title):
    url=EX_JSON_URL.replace("[poolname]",pool_name)
    #print url
    #log(pool_name)
    print "url before"
    page=urllib2.urlopen(url).read()
    print "url ok"
    json_val=json.loads(page)
    print "loads ok"
    max_count=0
    new_url=None
    for line in json_val['aaData']:
        if title in line[0] and line[3]>max_count:
            new_url=INIT_URL+re.findall(r"'(.*?)'",line[0])[0]
            max_count=line[3]
    return new_url

def get_chrome_image(url):
    command="chrome "+'"'+url+'"'
    log("log.txt",command)
    os.system(command)
    #page=urllib2.urlopen(url).read()
    #file=open("image.txt","w")
    #file.write(page)

def get_chart_data(url):
    page=urllib2.urlopen(url).read()
    charJsonFinder=re.findall('<textarea id=\'chartJson\'>(.*?)</textarea>',page)
    if charJsonFinder:
        charJson=eval(charJsonFinder[0].replace('&#034;','\''))
        data=charJson['d'][0]['y']['v']
        return data
    else:
        return None

def get_image(url,element):
    task_id,error_type,title,pool_name,assignee=element
    image_title=task_id+' '+title+' '+pool_name
    y=get_chart_data(url)
    
    sumy=0
    if y:
        for num in y:sumy+=int(num)

    if sumy<50000:
        log("images/%s/traceToClose.txt"%folder,'%s %d\n%s\n' % (image_title,sumy,url))
        get_chrome_image(url)

    if y:
        fig = figure()
        x=np.arange(0,len(y),1)
        color_alpha=str(np.exp(-sumy/50000));
        plot(x,y,color='k',lw=2)
        fill_between(x,y,0,color=color_alpha)
        fig.savefig('images/%s/%s.png'%(folder,image_title))

def init_threading():
    for i in xrange(10):
        t = ThreadUrl(queue)
        t.setDaemon(True)
        t.start() 

def init():
    global folder
    folder=time.strftime('%Y%m%d_%H%M%S', time.localtime())
    os.makedirs('images/%s'%folder)

    options,remainder=getopt.getopt(sys.argv, 'ws')
    for opt,arg in options:
        if opt == '-w':
            pass
        if opt == '-s':
            pass

class ThreadUrl(threading.Thread):
    """Threaded Url Grab"""
    def __init__(self, queue):
        threading.Thread.__init__(self)
        self.queue = queue

    def run(self):
        while True:
            #grabs task_id,error_type,title,pool_name from queue
            element=self.queue.get()
            task_id,error_type,title,pool_name,assignee=element
            #grabs urls of hosts and then grabs chunk of webpage
            url=get_error_trend_json(pool_name,title)
            if url is not None: 
                #get_chrome_image(url)
                if lock.acquire():
                    get_image(url,element)
                    lock.release()
            #signals to queue job is done
            self.queue.task_done()

if __name__=='__main__':
    init()
    """create threads"""
    init_threading()
    cell_elements=read_xls(XLS_FILE)
    for element in cell_elements:
        if element[1]=='SWAT Top10 Errors': #and element[4]=='yualiu':
            queue.put(element)
    queue.join()
