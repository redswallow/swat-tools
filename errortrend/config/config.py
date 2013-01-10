#!/usr/bin/python
# -*- coding: utf-8-*-
from ConfigParser import ConfigParser
import os

class Config(object): 
    """Config class holding all data from configuration files."""
    def __init__(self,filename="config.ini"):
        self._config = ConfigParser()
        self.filename=filename
        self.file={}
        self.url={}
        self.load(filename)

    def __parse_settings(self):
        """Parse SETTINGS section of the config file"""
        result=self.load_config(file_name)
        for key,value in self._config.items():
                print " ",option,"=",self.config.get(section,option)

    def load(self, filename):
        """Load configuration file"""
        self._config.read(filename)
        self.file = dict(self._config.items('file'))
        self.url = dict(self._config.items('url'))

    def load_config(self,filename):
        try:  
            if os.path.exists(filename):  
                config.read(open(file_name,"r")) 
                return config  
        except:  
            print file_name," is not exit"  

if __name__=='__main__':
    c=Config()
    print c.file,c.url
