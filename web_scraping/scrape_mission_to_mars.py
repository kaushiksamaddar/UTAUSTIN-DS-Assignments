from bs4 import BeautifulSoup
from splinter import Browser
import pandas as pd
import requests
import time
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
    img = results[0]
    img.click()
    time.sleep(3)

    base_url = image_url.rsplit('/',2)[0]

    #get image url using BeautifulSoup
    html_image = browser.html
    soup = BeautifulSoup(html_image, "html.parser")
    img_url = soup.find("img", class_="fancybox-image")['src']
    featured_image_url = base_url + img_url

    #Mars weather
    #Use Splinter to visit Mars URL.
    mars_url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(mars_url)

    #Construct a Soap object on the Mars URL
    html_mars = browser.html
    soup_mars = BeautifulSoup(html_mars, 'html.parser')

    #Find the weather tweet
    weather_tweet = soup_mars.find('p', class_='TweetTextSize TweetTextSize--normal js-tweet-text tweet-text')
    mars_facts["weathertweet"]=weather_tweet.text

    #Scrape Mars Facts URL
    mars_facts_url = 'https://space-facts.com/mars/'

    #Create a Pandas Dataframe on the URL
    mars_facts_df = pd.read_html(mars_facts_url)
    mars_facts_df = mars_facts_df[0]

    #Supplement Facts and Values as 2 columns to hold titles and values.
    mars_facts_df.columns = ['Facts','Values']

    #Convert the DataFrame to an HTML table of type String
    mars_facts_df_table = mars_facts_df.to_html()
    mars_facts["table"] = mars_facts_df_table.replace('\n','')
    
    #Mars hemisphere
    url_hemisphere = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"

    #Base URL
    base_url_hemisphere = url_hemisphere.rsplit('/',2)[0]

    #Request and Receive the Hemisphere Response Page
    hemisphere_response = requests.get(url_hemisphere)

    #Create a Beautiful Soap on the response text and parse the html
    hemisphere_soap = BeautifulSoup(hemisphere_response.text, 'html.parser')

    #Search for all the Image Items - Tag div and class item
    imageItems = hemisphere_soap.find_all('div', class_='item')

    #Construct a Hemisphere List
    hemisphere_image_urls = []

    '''
    Iterate the Image Items to find all the product links and title.
    Use Splinter to visit every product and scrape for the full Image link.
    Append the Image Title and Link into a list.
    '''
    for imageItem in imageItems:
        imageSrc = imageItem.find('a', class_='itemLink product-item')['href']
        title = imageItem.find('div', class_='description').text
        
        browser.visit(base_url_hemisphere + imageSrc)
        enhanced_soup = BeautifulSoup(browser.html, 'html.parser')
        
        downloadTag = enhanced_soup.find('div', class_='downloads')
        enhancedImageSrc = downloadTag.find('a')['href']
        
        hemisphere_image_urls.append({
            "title":title,
            "img_url":enhancedImageSrc
        })

    mars_facts['hemispheres'] = hemisphere_image_urls

    print("============= Mars Facts ===========================================================================")
    print(f" Head Line : {mars_facts['headline']}")
    print(f" Description : {mars_facts['description']}")
    print(f"The featured Image URL is : {featured_image_url}")
    print(f"Mars Weather Tweet: {mars_facts['weathertweet']} ")
    print(f"Mars Facts: {mars_facts['table']}")
    print(f"hemisphere_image_urls = {pprint.pprint(mars_facts['hemispheres'], indent=1)} ")
    print("============= Mars Facts ===========================================================================")

    return  mars_facts

if __name__=='__main__':
    scrape()
