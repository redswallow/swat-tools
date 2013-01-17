import urllib2,simplejson as json,os,time,Queue,logger,tickets
from runtime import runTime
from libs import *
from config import *
from plot import *
from worker import *

"""global settings"""
c = config.Config()
foldername=time.strftime('%Y%m%d_%H%M%S', time.localtime())
queue=Queue.Queue()

def get_graphjson_url(pool_name,error_name):
    return c.url['ex_json_url']%(pool_name,error_name)

@runTime
def get_y_axis(url):
    page=urllib2.urlopen(url).read()
    json_data=json.loads(page)
    if json_data['d'][0]['y']['v']:
        return [int(num) for num in json_data['d'][0]['y']['v']]
    else:
        return [0]*6 

def open_web_page(url,broswer):
    command=' '.join((broswer,url))
    logger.log("log.txt",command)
    os.system(command)

@runTime
def save_image(url,filename):
    #get x,y from graphjson url
    y=get_y_axis(url) 
    x=range(0,len(y))
    thresholdFlag=True if max(y)<int(c.image['threshold']) else False
    #build/save image
    Plotter.save_image(Plotter.get_image(x,y,thresholdFlag=thresholdFlag),c.image['filename']%(foldername,filename))
    if thresholdFlag:
        logger.log(c.image['log']%foldername,'%s %d\n%s\n%s\n' % (filename,sum(y),url,y))

def running_task():
    #grabs task_id,error_name,pool_name,assignee from queue
    task_id,error_name,pool_name,assignee=queue.get()
    if lock.acquire():
        url=get_graphjson_url(pool_name,error_name)
        filename=' '.join((task_id,error_name,pool_name))
        print filename
        save_image(url,filename)
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
    elements=tickets.read_tickets(c.file['txt_file'])
    for element in elements:
        queue.put(element)
    queue.join()
