import xlrd
import urllib2
import re
import simplejson as json
import os 

XLS_FILE="c:\users\yanhong\desktop\grid.xls"
INIT_URL="http://sj-sre002.sjc.ebay.com:8080/ex/c/trend"
EX_URL="http://sj-sre002.sjc.ebay.com:8080/ex/c/trend?trendType=error&poolName=[poolname]&dtOverride=2"
EX_JSON_URL=EX_URL.replace("trend?", "trend/detailJSON?");

cell_elements=[]

def read_xls(filename):
    book = xlrd.open_workbook(filename)
    booksheet = book.sheet_by_index(0)
    for rows in xrange(1, booksheet.nrows, 1):
        task_id=booksheet.cell_value(rows,0)
        title=booksheet.cell_value(rows,7)
        title=title.replace(" -- ","--").replace(" --","--");
        if "PDSRV" in task_id:
            cell_elements.append([task_id]+title.split("--"))
    return cell_elements

def get_error_trend_url(pool_name,title):
    url=EX_URL.replace("[poolname]",pool_name)
    log(url)

def get_error_trend_json(pool_name,title):
     url=EX_JSON_URL.replace("[poolname]",pool_name)
     #log(pool_name
     print "url before"
     page=urllib2.urlopen(url).read()
     print "url ok"
     json_val=json.loads(page)
     print "loads ok"
     #file=open("json.txt","w")
     #file.write(str(json_val))
     for line in json_val['aaData']:
         if title in line[0]:
             new_url=INIT_URL+re.findall(r"'(.*?)'",line[0])[0]
             return new_url

def get_image(url):
    command="chrome "+'"'+url+'"'
    log(command)
    os.system(command)
    #page=urllib2.urlopen(url).read()
    #file=open("image.txt","w")
    #file.write(page)

def log(info):
    print info
    file=open("log.txt","w+")
    file.write(info)

if __name__=='__main__':
    cell_elements=read_xls(XLS_FILE)
    for element in cell_elements:
        if len(element)==4:
            print element
            task_id,error_type,title,pool_name=element
            if task_id=="PDSRV15759452":
                url=get_error_trend_json(pool_name,title)
                if url is not None: get_image(url)
