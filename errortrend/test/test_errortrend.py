# -*- coding: utf-8 -*-

import sys
sys.path.append("..")
import unittest
from config import *
import os,xlrd,urllib2,simplejson as json,re,errortrend

class TestErrortrend(unittest.TestCase):
    def setUp(self):
        try:
            self.c = config.Config() 
        except Exception as e:
            print "Fail to initialize config file."
            raise e;

    def old_read_xls(self,filename):
        cell_elements=[]
        book = xlrd.open_workbook(filename)
        booksheet = book.sheet_by_index(0)
        for rows in xrange(1, booksheet.nrows, 1):
            task_id=booksheet.cell_value(rows,0)
            assignee=booksheet.cell_value(rows,6)
            title=booksheet.cell_value(rows,7)
            title=title.replace(" -- ","--").replace(" --","--");
            if "PDSRV" in task_id:
                cell_elements.append([task_id]+title.split("--")+[assignee])
        return cell_elements

    def test_read_xls(self):
        filename='../grid.xls'
        result=errortrend.read_xls(filename)
        self.assertEquals(result,self.old_read_xls(filename))

    def old_get_error_trend_json(self,pool_name,title):
        url=self.c.url['ex_json_url'].replace("[poolname]",pool_name)
        page=urllib2.urlopen(url).read()
        json_val=json.loads(page)
        max_count=0
        new_url=None
        for line in json_val['aaData']:
            if title in line[0] and line[3]>max_count:
                new_url=self.c.url['init_url']+re.findall(r"'(.*?)'",line[0])[0]
                max_count=line[3]
        return new_url

    def test_get_error_trend_json(self):
        '''params=(('v3apicore','com.ebay.app.api.pres.ApiSoapControllerCommand.handleRequest'),
                ('v3suncore','com.ebay.esf.org.apache.jasper.runtime.HttpJspBase.service_EsfRuntimeException'),
                ('v3itemsvccore','SellerPrefMap._PrimaryKeyLookup.-2.UHS.0_ObjectNotFoundException'),
                ('r1widgets','com.ebay.raptor.tracking.handler.RaptorTrackingHandler.handleFlush'),
                ('v3apicore','none'))'''
        params=()
        for pool_name,title in params:
            result=errortrend.get_error_trend_json(pool_name,title)
            self.assertEquals(result,self.old_get_error_trend_json(pool_name,title))

    def old_get_chart_data(self,url):
        page=urllib2.urlopen(url).read()
        charJsonFinder=re.findall('<textarea id=\'chartJson\'>(.*?)</textarea>',page)
        if charJsonFinder:
            charJson=eval(charJsonFinder[0].replace('&#034;','\''))
            data=charJson['d'][0]['y']['v']
            return data
        else:
            return None
    
    def test_get_chart_data(self):
        urls=(('http://sre.vip.ebay.com/ex/c/trend?trendType=error&poolName=v3apicore&fromDate=2013-01-10+23%3A04&toDate=2013-01-11+0%3A04&poolId=6&id=663&subType=single&title=com.ebay.app.api.pres.ApiSoapControllerCommand.handleRequest&dtOverride=null'),
                ('http://sre.vip.ebay.com/ex/c/trend?trendType=error&poolName=v3suncore&fromDate=2013-01-10+23%3A27&toDate=2013-01-11+0%3A27&poolId=65&id=2555&subType=single&title=com.ebay.esf.org.apache.jasper.runtime.HttpJspBase.service_EsfRuntimeException&dtOverride=null'),
                ('http://sre.vip.ebay.com/ex/c/trend?trendType=error&poolName=v3itemsvccore&fromDate=2013-01-10+23%3A27&toDate=2013-01-11+0%3A27&poolId=150277&id=174872&subType=single&title=SellerPrefMap._PrimaryKeyLookup.-2.UHS.0_ObjectNotFoundException&dtOverride=null'))
        for url in urls:
            result=errortrend.get_chart_data(url)
            self.assertEquals(result,self.old_get_chart_data(url))

if __name__ == '__main__':
    unittest.main()
