# -*- coding: utf-8 -*-

import sys
sys.path.append("..")
import unittest
from config import *
from ConfigParser import ConfigParser
import os

class TestConfig(unittest.TestCase):
    def setUp(self):
        try:
            self.config = config.Config() 
        except Exception as e:
            print "Fail to initialize config file."
            raise e;

    def test_load(self):
        self.assertIsNotNone(self.config.file)
        self.assertIsNotNone(self.config.url)

if __name__ == '__main__':
    unittest.main()
