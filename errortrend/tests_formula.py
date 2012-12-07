import numpy as np  
import matplotlib  
matplotlib.use('Agg')  
from matplotlib.pyplot import fill_between,plot,savefig,figure,title

x=np.linspace(0,100000,30)  
y=1-np.exp(-x/50000);  
plot(x,y,'--*b')  
t=u"test"
fill_between(x,y,0,color='0.1')
title(t)
savefig('MyFig.png')

