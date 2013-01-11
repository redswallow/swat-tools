#!/usr/bin/python
# -*- coding: utf-8-*-
from ConfigParser import ConfigParser
import os

class Config(): 
    """Config class holding all data from configuration files."""
    def __init__(self,filename="config.ini"):
        self._parser = ConfigParser()
        self.filename=os.path.join(os.path.dirname(os.path.realpath(__file__)),filename)
        self._parser.read(self.filename)
        self.file=self.get_section('file')
        self.url=self.get_section('url')
        self.image=self.get_section('image')
        self.thread=self.get_section('thread')
    
    def get_section(self,section):
        """Load configuration section"""
        return dict(self._parser.items(section))

    def get_option(self,key,section=None):
        """Load configuration option"""
        if section:
            return self._parser.get(section,key)
        else:
            for s in self._parser.sections():
                items=self.get_section(s)
                if key in items and items[key]:
                    return items[key]
            return None

if __name__=='__main__':
    c=Config()
    print c.get_section('file')
    print c.get_option('ex_url')
