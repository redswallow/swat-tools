import time

def runTime(func):  
    def newFunc(*args, **kwargs):  
        start = time.time()  
        print "@%s, {%s} start" % (time.strftime("%X", time.localtime()), func.__name__)  
        back = func(*args, **kwargs)  
        print "@%s, {%s} end" % (time.strftime("%X", time.localtime()), func.__name__)  
        print "@%.3fs taken for {%s}" % (time.time() - start, func.__name__)  
        return back  
    return newFunc  

