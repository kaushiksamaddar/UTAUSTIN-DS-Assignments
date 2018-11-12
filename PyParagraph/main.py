#Import the dependencies
import os
import re

def processParagraph():
    '''
        Assess the passage for each of the following:
            Approximate word count
            Approximate sentence count
            Approximate letter count (per word)
            Average sentence length (in words)
    '''

    #Set the path to the paragraph
    paraPath = os.path.join("raw_data","paragraph_1.txt")
    worldLength = 0

    with open(paraPath, 'r') as paraFile:
        line = paraFile.read()

        #Count the no. of words
        words = line.split(' ')

        #Approximate sentence count
        sentences = re.split("(?<=[.!?]) +", line)

        #Average Letter count
        for word in words:
                if ',' in word:
                        worldLength = worldLength + (len(word) - 1)
                else:
                        worldLength = worldLength + len(word)
                
        print("\nParagraph Analysis")
        print("------------------")
        print("Approximate Word Count: " + str(len(words)))
        print("Approximate Sentence Count: " + str(len(sentences)))
        print("Average Letter Count: " + str(round(worldLength / len(words), 1)))
        print("Average Sentence Length: " + str(len(words) / len(sentences)))
        print("\n")

processParagraph()