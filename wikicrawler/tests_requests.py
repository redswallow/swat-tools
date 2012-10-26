import requests
from BeautifulSoup import BeautifulSoup

r = requests.get('http://wiki2.arch.ebay.com/display/SWAT/1.+Intro+to+Site+Reliability+Engineering+Team',auth=('yanhong', 'Ebay4321'))
page=r.content
soup = BeautifulSoup(page)
file=open('1.+Intro+to+Site+Reliability+Engineering+Team.html','w+')
file.write(soup.prettify())
