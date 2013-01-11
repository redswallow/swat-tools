import xlrd,urllib2,re,simplejson as json,os,time,threading,Queue
import getopt,sys
from runtime import runTime
from logger import log
from libs import *
from config import *
from plot import *
from matplotlib.pyplot import ylim

"""global settings"""
c = config.Config()
foldername=time.strftime('%Y%m%d_%H%M%S', time.localtime())
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
    url=c.url['ex_url'].replace("[poolname]",pool_name)
    log("log.txt",url)

@runTime
def get_error_trend_json(pool_name,title):
    url=c.url['ex_json_url'].replace("[poolname]",pool_name)
    #print url
    #log(pool_name)
    page=urllib2.urlopen(url).read()
    json_val=json.loads(page)
    max_count=0
    new_url=None
    for line in json_val['aaData']:
        if title in line[0] and line[3]>max_count:
            new_url=c.url['init_url']+re.findall(r"'(.*?)'",line[0])[0]
            max_count=line[3]
    return new_url

def open_web_page(url):
    command="chrome "+'"'+url+'"'
    log("log.txt",command)
    os.system(command)

def save_web_page(url):
    page=urllib2.urlopen(url).read()
    file=open("image.txt","w")
    file.write(page)

def get_chart_data(url):
    page=urllib2.urlopen(url).read()
    charJsonFinder=re.findall('<textarea id=\'chartJson\'>(.*?)</textarea>',page)
    if charJsonFinder:
        charJson=eval(charJsonFinder[0].replace('&#034;','\''))
        data=charJson['d'][0]['y']['v']
        return [int(num) for num in data]
    else:
        return None

def save_image(url,element):
    task_id,error_type,title,pool_name,assignee=element
    image_title=''.join((task_id,title,pool_name))
    y=get_chart_data(url) if url else [0]*6 
    x=range(0,len(y))
    threshold=50000
    thresholdFlag=True if max(y)<threshold else False
    Plotter.save_image(Plotter.get_image(x,y,thresholdFlag=thresholdFlag),foldername,image_title)
    if thresholdFlag:
        log("images/%s/traceToClose.txt"%foldername,'%s %d\n%s\n%s\n' % (image_title,sum(y),url,y))

def init_threading():
    for i in xrange(10):
        t = ThreadUrl(queue)
        t.setDaemon(True)
        t.start() 

def init():
    os.makedirs('images/%s'%foldername)

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
    cell_elements=read_xls(c.file['xls_file'])
    for element in cell_elements:
        if element[1]=='SWAT Top10 Errors': #and element[4]=='yualiu':
            queue.put(element)
    queue.join()
