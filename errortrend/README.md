#Errortrend

A script to automatically get all the trace tickets below the threshold

## Dependency:
Run: `pip install -r requirements.txt` to get all packages
* urllib2, requests
* simplejson
* matplotlib, numpy


## How to use:

1. Set `YOURUSERNAME`, `YOURPASSWORD` in order to login the trace system
2. Run: `python trace.py` and all tickets data are saved in `tickets.txt`
3. Run: `python errortrend.py`
4. Get solutions arranged by date under the `errortrend/images` folder
5. See `log.txt` if you need log messages
