import xlrd,urllib2,re,simplejson as json,os,time,Queue
from runtime import runTime
from logger import log
from libs import *
from config import *
from plot import *
from worker import *

"""global settings"""
c = config.Config()
foldername=time.strftime('%Y%m%d_%H%M%S', time.localtime())
queue=Queue.Queue()

@runTime
def read_xls(filename):
    cell_elements=[]
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

def get_graphjson_url(pool_name,title):
    return c.url['ex_json_url']%(pool_name,title)

@runTime
def get_error_trend_json(url):
    page=urllib2.urlopen(url).read()
    json_data=json.loads(page)
    if json_data['d'][0]['y']['v']:
        return [int(num) for num in json_data['d'][0]['y']['v']]
    else:
        return [0]*6 

def open_web_page(url,broswer):
    command=' '.join((broswer,url))
    log("log.txt",command)
    os.system(command)

@runTime
def save_image(url,filename):
    y=get_error_trend_json(url) 
    x=range(0,len(y))
    thresholdFlag=True if max(y)<int(c.image['threshold']) else False
    Plotter.save_image(Plotter.get_image(x,y,thresholdFlag=thresholdFlag),foldername,filename)
    if thresholdFlag:
        log("images/%s/traceToClose.txt"%foldername,'%s %d\n%s\n%s\n' % (filename,sum(y),url,y))

def running_task():
    #grabs task_id,error_type,title,pool_name from queue
    element=queue.get()
    task_id,error_type,title,pool_name,assignee=element
    if lock.acquire():
        url=get_graphjson_url(pool_name,title)
        image_title=' '.join((task_id,title,pool_name))
        save_image(url,image_title)
        lock.release()
    #signals to queue job is done
    queue.task_done()

def init():
    os.makedirs('images/%s'%foldername)
    #init threading
    for i in xrange(int(c.thread['threadnum'])):
        Worker(queue,running_task).start()

if __name__=='__main__':
    init()
    excel_data=read_xls(c.file['xls_file'])
    for element in excel_data:
        if element[1]=='SWAT Top10 Errors':
            queue.put(element)
    queue.join()
