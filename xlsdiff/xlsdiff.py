import xlrd
import urllib2
import re
import simplejson as json
import os 

XLS_FILE_1='C:\Users\yanhong\Desktop\grid.xls'
XLS_FILE_2='C:\Users\yanhong\Desktop\grid3.xls'

cell_elements=[]

def read_xls(filename,index=0):
    book = xlrd.open_workbook(filename)
    booksheet = book.sheet_by_index(index)
    cell_elements={}
    for rows in xrange(1, booksheet.nrows, 1):
        task_id=booksheet.cell_value(rows,0)
        title=booksheet.cell_value(rows,2)
        cell_elements[task_id]=title
    return cell_elements

def diff(xls1,xls2):
    #a_diff_b(xls1,xls2)
    a_diff_b(xls2,xls1)

# in a not in b
def a_diff_b(dict1,dict2):
    for item in dict2:
        if item not in dict1:
            log(item+" "+dict2[item]+'\n')

def log(info):
    print info
    file=open("log.txt","a+")
    file.write(info)

if __name__=='__main__':
    xls1=read_xls(XLS_FILE_1)
    xls2=read_xls(XLS_FILE_2)

    diff(xls1,xls2)
