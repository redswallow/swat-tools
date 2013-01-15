import requests,urllib2,re,simplejson as json,ast
from timeit import Timer

#url='http://sj-sre002.sjc.ebay.com:8080/ex/c/trend?trendType=error&poolName=v3shipsandboxcore&dtOverride=2'
url='http://sj-sre002.sjc.ebay.com:8080/ex/c/trend?trendType=error&subType=single&id=295&title=com.ebay.soaframework.sif.impl.transport.http.HTTPSyncAsyncClientTransport.sendMessageGetResponse_HTTPTransportException&poolName=v3shipsandboxcore&fromDate=2012-10-10+18%3A54&toDate=2012-10-31+18%3A50&dtOverride=3'

def get_chart_data(url):
    page=urllib2.urlopen(url).read()
    charJsonFinder=re.findall('<textarea id=\'chartJson\'>(.*?)</textarea>',page)
    if charJsonFinder:
        charJson=eval(charJsonFinder[0].replace('&#034;','\''))
        data=charJson['d'][0]['y']['v']
        return data
    else:
        return None

def test():
    return get_chart_data(url)

if __name__=='__main__':
    t=Timer("test()","from __main__ import test")
    print t.timeit(1000000)
   
