from abc import ABC, abstractmethod
from bs4 import BeautifulSoup
import requests
from typing import *

# Defining the abstract Scrapper class
class ScrapperClass(ABC):
    def __init__(self, url: str, source: str):
        self.restricted = {'cord', 'case', 'cable', 'pen', 'speaker', 'earbuds', 'headphones', 'headset', 'earpiece',
                           'skin', 'mouse', 'keyboard', 'works', 'compatible', 'wrap', 'cover', 'replica', 'dummy',
                           'module', 'battery', 'screen', 'protector', 'wallet', 'cups', 'cup', 'Motor', 'Vibrating'}

        self.headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', 'Accept-Language': 'en-CA, en;q=0.5'}
        self.url = url
        self.source = source
        self.data: List[str] = []

    def __call__(self, name: str) -> List[tuple[str, str, str, str]]:
        self.data = self.scrap(name)
        return self.data

    def checkValid(self, title: str, name: str) -> bool:
        characters_to_remove = ",./@#$%^&*()_-+=<>?:;'\"[]{}`~|\\"
        title = "".join([char.lower() for char in title if char not in characters_to_remove]).strip().split(' ')
        name = name.lower().split(' ')
        i, j = 0, 0
        while i < len(title):
            while j < len(name) and i < len(title) and title[i] == name[j]:
                i += 1
                j += 1

            if i < len(title) and title[i] in self.restricted:
                return False
            i += 1

        return True if j == len(name) else False

    @abstractmethod
    def scrap(self, name: str) -> List[tuple[str, str, str, str]]:
        pass

class AmazonScrapper(ScrapperClass):
    def __init__(self):
        super().__init__('https://www.amazon.ca/s?k=', 'Amazon CA')

    def scrap(self, name: str) -> List[tuple[str, str, str, str]]:
        try:
            search_url = self.url + "+".join(name.split(' ')) + '&ref=nb_sb_noss_2'
            print("Scraping:", search_url)

            response = requests.get(search_url, headers=self.headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")
                listings = soup.find_all('div',class_='a-section a-spacing-small puis-padding-left-small puis-padding-right-small')
                data = []

                for listing in listings:
                    link = 'https://www.amazon.ca/' + listing.find('a', class_='a-link-normal')['href']
                    title = listing.find('span', class_='a-size-base-plus a-color-base a-text-normal')
                    price_whole = listing.find('span', class_='a-price-whole')
                    price_fraction = listing.find('span', class_='a-price-fraction')

                    if title and price_whole and price_fraction and self.checkValid(title, name):
                        title = title.text.strip()
                        price = price_whole.text.strip() + price_fraction.text.strip()
                        data.append((title, price, link, 'Amazon CA'))

                return data
            else:
                raise Exception(f'Request failed with status code {response.status_code}')
        except Exception as e:
            print(f'Error occurred scraping: {self.source} - {str(e)}')
            return []

class GoogleScrapper(ScrapperClass):
    def __init__(self):
        super().__init__('https://www.google.com/search?q=', 'Google')

    def scrap(self, name: str) -> List[tuple[str, str, str, str]]:
        try:
            search_url = self.url + "+".join(name.split(' ')) + '&tbm=shop'
            print("Scraping:", search_url)

            response = requests.get(search_url, headers=self.headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")
                listings = soup.find_all('div', class_='sh-dgr__content')
                data = []

                for listing in listings:
                    link = "https://www.google.com/" + listing.find('div', class_='mnIHsc').find('a', class_='shntl')['href']
                    title = listing.find('h3', class_='tAxDx').text.strip()
                    price = listing.find('span', class_='a8Pemb').text.strip('$')
                    source = listing.find('div', class_='aULzUe IuHnof').text.strip()

                    if self.checkValid(title, name):
                        data.append((title,price,link,source))

                return data
            else:
                raise Exception(f'Request failed with status code {response.status_code}')
        except Exception as e:
            print(f'Error occurred scraping: {self.source} - {str(e)}')
            return []

class EbayScrapper(ScrapperClass):
    def __init__(self):
        super().__init__('https://www.ebay.ca/sch/i.html?_nkw=', 'eBay')

    def scrap(self, name: str) -> List[tuple[str, str, str, str]]:
        try:
            search_url = self.url + "+".join(name.split(' '))
            print("Scraping:", search_url)

            response = requests.get(search_url, headers=self.headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")
                listings = soup.find_all('li', class_='s-item s-item__pl-on-bottom')
                data = []

                for listing in listings:
                    link = listing.find('a', class_='s-item__link')['href']
                    title = listing.find('div',class_='s-item__title').text.strip()
                    price = listing.find('span', class_='s-item__price').text

                    if self.checkValid(title, name):
                        price = price.split(' ')[0].strip('$') if len(price.split(' ')) == 1 else price.split(' ')[1].strip('$')
                        data.append((title,price,link,'eBay'))

                return data
            else:
                raise Exception(f'Request failed with status code {response.status_code}')
        except Exception as e:
            print(f'Error occurred scraping: {self.source} - {str(e)}')
            return []

#More...