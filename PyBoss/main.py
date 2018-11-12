# Import Dependencies
import os
import csv


def processEmpData():
    '''
        Convert the Employee records to the required format:
        Emp ID,First Name,Last Name,DOB,SSN,State
        214,Sarah,Simpson,12/04/1985,***-**-8166,FL
        15,Samantha,Lara,09/08/1993,***-**-7526,CO
        411,Stacy,Charles,12/20/1957,***-**-8526,PA
    '''

    us_state_abbrev = {
        'Alabama': 'AL',
        'Alaska': 'AK',
        'Arizona': 'AZ',
        'Arkansas': 'AR',
        'California': 'CA',
        'Colorado': 'CO',
        'Connecticut': 'CT',
        'Delaware': 'DE',
        'Florida': 'FL',
        'Georgia': 'GA',
        'Hawaii': 'HI',
        'Idaho': 'ID',
        'Illinois': 'IL',
        'Indiana': 'IN',
        'Iowa': 'IA',
        'Kansas': 'KS',
        'Kentucky': 'KY',
        'Louisiana': 'LA',
        'Maine': 'ME',
        'Maryland': 'MD',
        'Massachusetts': 'MA',
        'Michigan': 'MI',
        'Minnesota': 'MN',
        'Mississippi': 'MS',
        'Missouri': 'MO',
        'Montana': 'MT',
        'Nebraska': 'NE',
        'Nevada': 'NV',
        'New Hampshire': 'NH',
        'New Jersey': 'NJ',
        'New Mexico': 'NM',
        'New York': 'NY',
        'North Carolina': 'NC',
        'North Dakota': 'ND',
        'Ohio': 'OH',
        'Oklahoma': 'OK',
        'Oregon': 'OR',
        'Pennsylvania': 'PA',
        'Rhode Island': 'RI',
        'South Carolina': 'SC',
        'South Dakota': 'SD',
        'Tennessee': 'TN',
        'Texas': 'TX',
        'Utah': 'UT',
        'Vermont': 'VT',
        'Virginia': 'VA',
        'Washington': 'WA',
        'West Virginia': 'WV',
        'Wisconsin': 'WI',
        'Wyoming': 'WY',
    }

    # Fetch the path to the Employee CSV to read from.
    readEmpCSV = os.path.join("Resources", "employee_data.csv")

    # Set the path to the Formatted Employee CSV to write into.
    writeEmpCSV = os.path.join("Resources", "employee_data_formatted.csv")

    # Open and read the data from employee_data.csv
    with open(readEmpCSV, newline="") as empCSVFileRead:
        empCSVFileReader = csv.reader(empCSVFileRead, delimiter=",")

        # Open and write the data into employee_data_formatted.csv

        with open(writeEmpCSV, 'w', newline="") as empCSVFileWrite:
            empCSVFileWriter = csv.writer(empCSVFileWrite, delimiter=",")

            # Fetch the header
            next(empCSVFileReader)

            # Create the formatted header
            formatted_header = ['Emp ID', 'First Name',
                                'Last Name', 'MM/DD/YYYY', 'SSN', 'State']
            empCSVFileWriter.writerow(formatted_header)

            empID = []
            firstNames = []
            lastNames = []
            dates = []
            ssnList = []
            stateList = []

            for row in (empCSVFileReader):
                empID.clear()
                firstNames.clear()
                lastNames.clear()
                dates.clear()
                ssnList.clear()
                stateList.clear()

                empID.append(row[0])

                def processName(row):
                    '''
                        Split the Full Name into First and Last Name
                    '''
                    firstName = row[1].split(' ')[0]
                    lastName = row[1].split(' ')[1]
                    firstNames.append(firstName)
                    lastNames.append(lastName)

                def processDate(row):
                    '''
                        Format the Date as MM/DD/YYYY
                    '''
                    month = row[2].split('-')[1]
                    date = row[2].split('-')[2]
                    year = row[2].split('-')[0]
                    dates.append(""+str(month)+"/"+str(date)+"/"+str(year))

                def processSSN(row):
                    '''
                        Re-write SSN so that the first 5 numbers are hidden from view.
                    '''
                    ssnList.append(
                        (row[3].replace(row[3][:3], '***').replace(row[3][4:6], '**')))

                def processState(row):
                    '''
                        Abbreviate the State
                    '''
                    if row[4] in us_state_abbrev:
                        stateList.append(us_state_abbrev[row[4]])

                processName(row)
                processDate(row)
                processSSN(row)
                processState(row)

                clear_csv = zip(empID, firstNames, lastNames, dates, ssnList, stateList)

                empCSVFileWriter.writerows(clear_csv)


# Convert and process the data
processEmpData()
