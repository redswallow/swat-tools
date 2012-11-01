import numpy as np  
import matplotlib  
matplotlib.use('Agg')  
from matplotlib.pyplot import plot,savefig,figure,title

x=np.linspace(-4,4,30)  
y=np.sin(x);  
plot(x,y,'--*b')  
t=u"test"
title(t)
savefig('MyFig.png')
