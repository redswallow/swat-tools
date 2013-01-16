import matplotlib  
matplotlib.use('Agg')  
import matplotlib.pyplot as plt
import numpy as np

class Plotter():
    @classmethod
    def get_image(self,x,y,threshold=50000,thresholdFlag=False):
        image=plt.figure()
        if thresholdFlag:
            plt.ylim([0,threshold])
        plt.plot(x,y,color='k',lw=2)
        plt.fill_between(x,y,0,color=str(np.exp(-sum(y)/(threshold*7)))) #color:color_alpha
        return image

    @classmethod
    def save_image(self,image,filename):
        try:
            image.savefig(filename)
        except IOError,e:
            print("open exception: %s: %s\n" %(e.errno, e.strerror))  
            return -1
        return 0

if __name__=='__main__':
    pass
