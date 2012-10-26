#Given a URL, get the data, into a file of the
#same name into corresponding folder

import requests,string, urllib, urlparse, os, getopt, sys, re

def readURL(url):
    """Returns the file found in the URL
    """
    r = requests.get(url)
    data = r.content
    return data

def saveURL(url):
    """Reads the given URL, saves the file
    """
    #get the folder name 
    folder = (urlparse.urlparse(url)[2])[1:]
    #this will have the filename too
    filename = os.path.basename(folder)
    foldername = os.path.dirname(folder)
    #use a default filename if not given
    if filename == '':
        filename = default_filename
    if foldername == '':
        foldername = os.curdir
    
    #make it if it is not there
    if cut_folder != '':
        foldername = string.replace(foldername,cut_folder,'')
    try:
        os.makedirs(foldername)
    except:
        pass
        # this assumes no error other than folder existence is raised

    #read the data from URL
    data = readURL(url)

    #do the server change processing
    #ideally this should process the file content
    #to make the links relative. The function
    #above is a good start.
    if filename != list_filename:
        fileext = ''
        try:
            fileext = os.path.splitext(filename)[1]
        except:
            pass
        if fileext in ('.txt','.htm','.html','.inc','.php3'):
            #change the base URLs to NULL
            data = re.sub('http://ctx:8080','',data)
            data = re.sub('<base href=.*?>','',data)
    
    #save the data into the file
    try:
        f = open(foldername + os.sep + filename,'wb')
        f.write(data)
        f.close()
    except:
        print foldername + os.sep + filename
    
    return len(data)

##################################################################
#                                                                #
#                   MAIN SECTION                                 #
#                                                                #
##################################################################

#Process command line arguments
try:
    optlist, args = getopt.getopt(sys.argv[1:], 'c:i:x:')
except:
    print "Error :", sys.exc_info()[1]
    print help
    sys.exit(0)
    
cut_folder = ''  #create folders only from this folder onwards
inc_url = ''     #include only urls starting with this
if optlist:
    for opt,val in optlist:
        if opt == "-c":
            cut_folder = val
        if opt == "-x":
            inc_url = val
        if opt == "-i":
            list_filename = val
            #read the URLs from input file, one per line
            try:
                f = open(val,'r')
                args = f.readlines()
                f.close()
            except:
                print "Error :", sys.exc_info()[1]
                sys.exit(0)


for url in args:
    url = string.strip(url)
    if url:   # we don't want blank lines
        if string.find(url,inc_url)==0:
            print url,'...',saveURL(url)

