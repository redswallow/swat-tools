import time

def runTime(func):  
    def newFunc(*args, **kwargs):  
        start = time.clock()  
        print "%s [%s] START" % (time.strftime("%X", time.localtime()), func.__name__)  
        back = func(*args, **kwargs)  
        print "%s [%s] ENDING %.3fs" % (time.strftime("%X", time.localtime()), func.__name__,time.clock() - start)  
        return back  
    return newFunc  

