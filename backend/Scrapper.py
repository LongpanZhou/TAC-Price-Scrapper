from ScrapperClass import *
from alive_progress import alive_bar
from functools import lru_cache
from typing import *

class Scrapper:
    def __init__(self):
        self.scrappers = [AmazonScrapper(),GoogleScrapper(),EbayScrapper()]
        self.data = []

    @lru_cache(maxsize=None)
    def __call__(self, name: str) -> List[tuple[str, str, str, str]]:
        self.data = []
        with alive_bar(3, title='Processing') as bar:
            for obj in self.scrappers:
                for _ in obj(name):
                    self.data.append(_)
                bar()
            return self.data