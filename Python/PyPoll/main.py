#Import module to support CSV Operations.
import os
import csv

#Set the path for the CSV file
electionDataCSV = os.path.join("Resources","election_data.csv")

#Open the Election Data for manipulation
def processElectionData():
    '''
        Open the Election Data for manipulation
    '''
    with open(electionDataCSV, newline='') as electionDataFile:
        electionDataFileReader = csv.reader(electionDataFile, delimiter=",")

        no_of_votes_cast = 0
        votes_won_count = {}

        #Process the following
        def analyzeElection(electionDataFileReader):
            '''
                Analyze the data to do the following:
                1. Total no. of votes cast.
                2. List of candidates received votes.
                3. % of votes won by each candidate
                4. Total no of votes each candidate won.
                5. Winner of the election
            '''

            for index, row in enumerate(electionDataFileReader):
                if not row[2] in votes_won_count:
                    votes_won_count[row[2]] = 1
                else:
                    votes_won_count[row[2]] = votes_won_count[row[2]] + 1
                
            return index+1, votes_won_count


        if(next(electionDataFileReader)):
            no_of_votes_cast, votes_won_count = analyzeElection(electionDataFileReader)
            max_votes = 0
            max_votes_candidate = ""

            #Output the analysis to A Text file PyPoll.txt and on the Terminal.
            with open("PyPoll.txt", "w") as pyPollFile:
                pyPollFile.write("\nElection Results\n")
                print("\nElection Results")

                pyPollFile.write("-----------------------------------\n")
                print("-----------------------------------")

                pyPollFile.write("Total Votes: " + str(no_of_votes_cast) + "\n")
                print("Total Votes: " + str(no_of_votes_cast))

                pyPollFile.write("-----------------------------------\n")
                print("-----------------------------------")

                for candidate, votes_count in votes_won_count.items():
                    if max_votes < votes_count:
                        max_votes = votes_count
                        max_votes_candidate = candidate
                    percent_won = round((votes_count / no_of_votes_cast)*100, 4)
                    pyPollFile.write(candidate + " : " + str(percent_won) + "% ("+ str(votes_count) + ") \n")
                    print(candidate + " : " + str(percent_won) + "% ("+ str(votes_count) + ")")

                pyPollFile.write("-----------------------------------\n")
                print("-----------------------------------")

                pyPollFile.write("Winner: " + str(max_votes_candidate) + "\n")
                print("Winner: " + str(max_votes_candidate))

                pyPollFile.write("-----------------------------------\n")
                print("-----------------------------------")

processElectionData()