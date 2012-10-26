import requests,urllib

def cbk(a, b, c):  
    per = 100.0 * a * b / c  
    if per > 100:  
        per = 100  
    print '%.2f%%' % per  


url = 'http://wiki2.arch.ebay.com/display/SWAT/Home'
local='index.html'
#print urllib.urlretrieve(url)[1]
r=requests.get(url,auth=('yanhong','Ebay4321'))
page=r.content
urllib.urlretrieve(url,local,cbk)
