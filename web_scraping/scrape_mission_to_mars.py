from bs4 import BeautifulSoup
from splinter import Browser
import pandas as pd
import requests
import pprint


def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    return Browser("chrome", **executable_path, headless=False)


def scrape():
    browser = init_browser()
    mars_facts = {}

    url = 'https://mars.nasa.gov/news/'
    
    # Retrieve page with the requests module
    response = requests.get(url)

    #Create BeautifulSoup object; Parse with html parser
    soup = BeautifulSoup(response.text, 'html.parser')

    #Fetch Latest Mars News
    mars_facts["headline"] = soup.find('div', class_='content_title').get_text().replace("\n","")
    mars_facts["description"] = soup.find('div', class_='rollover_description_inner').get_text().replace("\n","")

    #JPL Mars Space Images - Featured Image
    #Use Splinter to visit the Mars Image URL
    image_url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(image_url)

    xpath = '//*[@id="page"]/section[3]/div/ul/li[29]/a/div/div[2]/img'
    #Use splinter to click on the mars featured image
    #to bring the full resolution image
    results = browser.find_by_xpath(xpath)
    print("Results: %s" %results)
    img = results[0]
    print(img)
    img.click()

    base_url = image_url.rsplit('/',2)[0]

    #get image url using BeautifulSoup
    html_image = browser.html
    soup = BeautifulSoup(html_image, "html.parser")
    print("soup: %s" %soup)
    img_url = soup.find("img", class_="fancybox-image")['src']
    featured_image_url = base_url + img_url

    print("============= Mars Facts ===========================================================================")
    print(f" Head Line : {mars_facts['headline']}")
    print(f" Description : {mars_facts['description']}")
    print(f"The featured Image URL is : {featured_image_url}")
    print("============= Mars Facts ===========================================================================")

    return  mars_facts

if __name__=='__main__':
    scrape()
