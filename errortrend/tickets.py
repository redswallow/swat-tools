#-*-coding:utf-8-*-
import re

def read_tickets(filename):
    elements=[]
    regex=re.compile("SWAT Top10 Errors -- (.*) --(.*)")
    #Read Tickets by lines
    file = open(filename,'r')
    lines=file.readlines()
    file.close()
    for line in lines:
        #Column: "Task Id","Status","Priority","Expedited","Due Date","Group","Assignee","Title","Requester","Environment","Site","Created","Modified"
        task_id,status,priority,expedited,due_date,group,assignee,title,requester,environment,site,created,modified=line.split('","')
        #Macth SWAT Top10 Errors
        if 'PDSRV' in task_id and regex.match(title):
            error_name,pool_name=regex.match(title).group(1,2)
            elements.append([task_id,error_name,pool_name,assignee])
    return elements

def read_xls(filename):
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

if __name__=='__main__':
    read_tickets('tickets.txt')
