import time,logger
from config import *
c = config.Config()

def runTime(func):  
    def newFunc(*args, **kwargs):  
        start = time.clock()  
        logger.log(c.file['log'],"%s [%s] START" % (time.strftime("%X", time.localtime()), func.__name__))
        back = func(*args, **kwargs)  
        logger.log(c.file['log'],"%s [%s] ENDING %.3fs" % (time.strftime("%X", time.localtime()), func.__name__,time.clock() - start))
        return back  
    return newFunc  

