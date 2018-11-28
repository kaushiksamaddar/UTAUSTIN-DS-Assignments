#Import modules to support CSV Operations
import csv
import os

#Set the path for the CSV file
budgetDataCSV = os.path.join("Resources", "budget_data.csv")

#Open the Budget File for manipulation
def processBudgetData():
    '''
        Open the Budget File for manipulation
    '''

    with open(budgetDataCSV, newline='') as budgetDataFile:
        budgetDataFileReader = csv.reader(budgetDataFile, delimiter=",")

        #Calculate and return total Profit and Losses
        def getTotalProfitLosses(bdfReader):
            '''
                Calculate and return the following:
                1. Total Profit and Losses
                2. Total no of months
                3. Average Change
                4. Greatest increase in profits
                5. Greatest decrease in losses.
            '''
            total_profit_loss = 0.0
            total_no_of_months = 0
            total_changes = 0.0
            average_change = 0.0
            previous_profitloss = 0.0
            diffPL = 0.0

            greatest_increase = {
                "Profits":0,
                "Date":None
            }
            greatest_decrease = {
                "Losses":0,
                "Date":None
            }

            for index, row in enumerate(bdfReader):
                total_profit_loss = total_profit_loss + int(row[1])
                if(index == 0):
                    previous_profitloss = float(row[1])
                else:
                    diffPL = ((float(row[1])) - previous_profitloss)
                    total_changes = total_changes + diffPL
                    total_no_of_months = index+1
                    
                    if greatest_increase["Profits"] < diffPL:
                        greatest_increase["Profits"] = diffPL
                        greatest_increase["Date"] = row[0]

                    if greatest_decrease["Losses"] > diffPL:
                        greatest_decrease["Losses"] = diffPL
                        greatest_decrease["Date"] = row[0]

                    previous_profitloss = float(row[1])    

            average_change = round((total_changes / (total_no_of_months - 1)), 2)
            #return total_change, total_no_of_months, total_profit_loss
            return average_change, greatest_increase, greatest_decrease, total_no_of_months, total_profit_loss

        if(next(budgetDataFileReader)):
            #total_change, total_no_of_months, total_profit_loss = getTotalProfitLosses(budgetDataFileReader)
            average_change, greatest_increase, greatest_decrease, total_no_of_months, total_profit_loss = getTotalProfitLosses(budgetDataFileReader)
        
            print("Total Months: " + str(total_no_of_months))
            print("Total : $" + str(total_profit_loss))
            print("Total Change: " + str(average_change))
            print("Greatest increase in profits: " + greatest_increase["Date"] + " ($" + str(greatest_increase["Profits"]) + ")")
            print("Greatest decrease in losses: " + greatest_decrease["Date"] + "  ($" + str(greatest_decrease["Losses"]) + ")")

            with open("PyBank.txt", "w") as pyBankFile:
                pyBankFile.write("Total Months: " + str(total_no_of_months)+"\n")
                pyBankFile.write("Total : $" + str(total_profit_loss)+"\n")
                pyBankFile.write("Total Change: " + str(average_change)+"\n")
                pyBankFile.write("Greatest increase in profits: " + greatest_increase["Date"] + " ($" + str(greatest_increase["Profits"]) + ")\n")
                pyBankFile.write("Greatest decrease in losses: " + greatest_decrease["Date"] + "  ($" + str(greatest_decrease["Losses"]) + ")\n")
                
processBudgetData()