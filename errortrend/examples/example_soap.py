from suds.client import Client
from suds.wsse import *

def get_service():
    _url = "http://trace.vip.ebay.com/arsys/services/TraceServiceSOAPPort?WSDL"
    #_url = 'http://www.webservicex.net/WeatherForecast.asmx?WSDL'
    _user = "api_proanalyzer"
    _pwd = "proanalyzer@tc"
    client = Client(_url)

    security = Security()
    token = UsernameToken(_user, _pwd)
    security.tokens.append(token)
    client.set_options(wsse=security)

    #client.service.findServiceDefinition("FIND_PDSRV")
    keyValue=client.factory.create("ns0:keyValue")
    keyValue.key="task_id"
    keyValue.value="PDSRV15371202"
    print keyValue
    arrayOfKeyValueResult=client.factory.create("ns0:arrayOfKeyValueResult")
    arrayOfKeyValueResult.item.append(keyValue)
    arrayOfKeyValueResult.item.append(keyValue)
    print arrayOfKeyValueResult
    task=client.factory.create("ns0:task")
    task.serviceName="FIND_PDSRV"
    task.keyValues=keyValue
    print task

    parameter=client.factory.create("ns0:parameter")
    parameter.name="task_id"
    parameter.defaultValue=keyValue
    print parameter
    
    #serviceDefinition=client.factory.create("ns0:serviceDefinition")
    #print serviceDefinition
    client.service.findTicket("FIND_PDSRV","(keyValue){task_id:PDSRV15371202}") 
    print client

get_service()


# name = None
# type = None
# required = None
# isField = None
# defaultValue = None

