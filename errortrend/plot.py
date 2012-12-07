import matplotlib  
matplotlib.use('Agg')  
import matplotlib.pyplot as plt
import numpy as np

def get_image(x,y,threshold=50000):
    image=plt.figure()
    plt.plot(x,y,color='k',lw=2)
    alpha=str(np.exp(-sum(y)/(threshold*7)))
    plt.fill_between(x,y,0,color=alpha)
    return image

def save_image(image,folder,title):
    try:
        image.savefig('images/%s/%s.png'%(folder,title))
    except IOError,e:
        print("open exception: %s: %s\n" %(e.errno, e.strerror))  
        return -1
    return 0
