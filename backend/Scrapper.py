from abc import ABC, abstractmethod
from bs4 import BeautifulSoup
import requests


# Defining the abstract Scrapper class
class Scrapper(ABC):
    def __init__(self, url, source):
        self.restricted = {'cord', 'case', 'cable', 'pen', 'speaker', 'earbuds', 'headphones', 'headset', 'earpiece',
                           'skin', 'mouse', 'keyboard', 'works', 'compatible', 'wrap', 'cover', 'replica', 'dummy',
                           'module'}
        self.headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        self.url = url
        self.source = source
        self.data = []

    def __call__(self, name):
        self.data = self.scrap(name)
        return self.data

    def checkValid(self, title):
        for word in title.split(' '):
            if word.lower() in self.restricted:
                return False
        return True

    @abstractmethod
    def scrap(self, name):
        pass


# All Website Scrappers
# self.url = {'Amazon': [],
#             'eBay': [],
#             'Facebook Marketplace': [],
#             'Craigslist': [],
#             'Walmart': [],
#             'AliExpress': [],
#             'Etsy': [],
#             'Google Shopping': []}
class AmazonScrapper(Scrapper):
    def __init__(self):
        super().__init__('https://www.amazon.ca/s?k=', 'Amazon')

    def scrap(self, name):
        try:
            search_url = self.url + "+".join(name.split(' ')) + '&ref=nb_sb_noss_2'
            print("Scraping:", search_url)

            response = requests.get(search_url, headers=self.headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                product_titles = [title.text.strip() for title in soup.select('span.a-size-medium')]
                return product_titles
            else:
                raise Exception(f'Request failed with status code {response.status_code}')
        except Exception as e:
            print(f'Error occurred scraping: {self.source} - {str(e)}')
            return []


class FacebookScrapper(Scrapper):
    def __init__(self, name):
        super().__init__('https://www.amazon.ca/s?k=' + "+".join(name), 'Facebook Marketplace')

    def scrap(self):
        print(self.url)
        return '1'


class CraigslistScrapper(Scrapper):
    def __init__(self, name):
        super().__init__('https://www.amazon.ca/s?k=' + "+".join(name), 'Craigslist')

    def scrap(self):
        print(self.url)
        return '1'


class WalmartScrapper(Scrapper):
    def __init__(self, name):
        super().__init__('https://www.amazon.ca/s?k=' + "+".join(name), 'Walmart')

    def scrap(self):
        print(self.url)
        return '1'


class AliExpressScrapper(Scrapper):
    def __init__(self, name):
        super().__init__('https://www.amazon.ca/s?k=' + "+".join(name), "AliExpress")

    def scrap(self):
        print(self.url)
        return '1'


class EtsyScrapper(Scrapper):
    def __init__(self, name):
        super().__init__('https://www.amazon.ca/s?k=' + "+".join(name), "Etsy")

    def scrap(self):
        print(self.url)
        return '1'


class GoogleScrapper(Scrapper):
    def __init__(self, name):
        super().__init__('https://www.amazon.ca/s?k=' + "+".join(name), "Google Shopping")

    def scrap(self):
        print(self.url)
        return '1'

# Example usage
if __name__ == "__main__":
    # Create an instance of MyScrapper with a specific URL
    scrapper = AmazonScrapper()
    print(scrapper.source)
    # Call the scrapper
    data = scrapper('iphone 6')

    # Process the scraped data
    print("Scraped Data:")
    print(data)