#!/bin/env python
from ebay.trace import *
class FakeTask:
	def __str__(self):
		return "Task:\n\t" + "\t".join(["%s: %s\n"%(k, v) for k, v in self.__dict__.items()])
def printList(task_list):
	print "Trace return [%d] tickets/assets."%(len(task_list))
	for task in task_list:
		print task
	print "Trace return [%d] tickets/assets."%(len(task_list))


if __name__ == '__main__':
	#_url = "http://trace.vip.ebay.com/arsys/services/TraceServiceSOAPPort?WSDL"
        user = "api_proanalyzer"
        pwd = "proanalyzer@tc"
	server = 'trace.vip.ebay.com'
	try:
		trace = Trace(user, pwd, server=server)#, traceFile=sys.stdout) # output the suds logging to stdout for debugging
		print "getting assets match location prefix 'SCW-541-05.06' from Trace server: %s ..."%server 
		printList(trace.findAssets(FakeTask, 'SCW-541-05.06'))
		
		#print "updating ACCTR11380768 with message 'testing update message' ..."
		#print trace.updateTask('ACCTR11380768', 'testing update message')
		#print "Finding ACCTR APPRV ticket with id 'APPRV12454760' .."
		#printList(trace.findAcctrApprv(FakeTask, 'QA_NT_Integ_Acct_Approver', 'ACCTR', request_id='APPRV12454760'))
		#print trace.findSASRV(FakeTask, 'QA NT Integration', TASK_STATUS.Cancelled) # would be very slow as it fetch a lot of tickets from Trace, which is also cpu/memory intansive as the xml getting larger
	except TraceError, e:
		print 'TraceError: %s'%str(e)
		

