Sub totalStkVolume()
    Set wSheets = ThisWorkbook.Worksheets
    
    Debug.Print ("Begin processing for " & ThisWorkbook.Name)
    Dim lastRow As Long
    Dim currTicker As String
    Dim prevTicker As String
    Dim offsetIncrementer As Variant
    Dim iOffsetIncrementer As Variant
    Dim tickerTotal As Variant
    
    'Declare the maximums
    Dim maxYear As Double
    Dim minYear As Double
    Dim maxStockVol As Variant
    
    'Declare the Stock opening and closing balances
    Dim stockOpenBal As Double
    Dim stockClosingBal As Double
    
    For Each wSheet In wSheets
        Debug.Print ("Begin processing for Sheet: " & wSheet.Name)
        '====================================================================================================
        wSheet.Activate
        prevTicker = Cells(2, 1).Value
        offsetIncrementer = 1
        iOffsetIncrementer = 1
        tickerTotal = 0
        
        'Collect the Stock Opening Balance
        stockOpenBal = Cells(2, 3).Value
    
        'Populate the iOffsetIncrementer with the First Ticker
        Range("I1").Offset(Rowoffset:=iOffsetIncrementer) = prevTicker
    
        'Find the last row of the column
        lastRow = Cells(Rows.Count, 1).End(xlUp).Row
        
        'Iterate the Ticker till the last row
        For tickerCount = 2 To lastRow
            currTicker = Cells(tickerCount, 1).Value
            
            If prevTicker <> currTicker Then
                
                'Collect the Stock Closing Balance for the previous Ticker
                stockClosingBal = Cells(tickerCount - 1, 6).Value
                Range("J1").Offset(Rowoffset:=iOffsetIncrementer) = (stockClosingBal - stockOpenBal)
                
                'Stock Opening Balance is 0 for multiple tickers. Division by 0 is not a number. Hence K Column will be populated by 0
                'if the Opening Stock Balance against the ticker is 0.
                If (stockOpenBal) <> 0 Then
                    Range("K1").Offset(Rowoffset:=iOffsetIncrementer) = ((stockClosingBal - stockOpenBal) / stockOpenBal)
                Else
                    Range("K1").Offset(Rowoffset:=iOffsetIncrementer) = 0#
                End If
                
                'If the Yearly change is -ve then
                If Range("J1").Offset(Rowoffset:=iOffsetIncrementer) < 0 Then
                    'Highlight the change in Red
                    Range("J1").Offset(Rowoffset:=iOffsetIncrementer).Interior.ColorIndex = 3
                Else
                    'Else highlight the change in Green
                    Range("J1").Offset(Rowoffset:=iOffsetIncrementer).Interior.ColorIndex = 4
                End If
                
                stockOpenBal = Cells(tickerCount, 3).Value
                
                iOffsetIncrementer = iOffsetIncrementer + 1
                Range("I1").Offset(Rowoffset:=iOffsetIncrementer) = currTicker
                Range("L1").Offset(Rowoffset:=(iOffsetIncrementer - 1)) = tickerTotal
                tickerTotal = 0
                tickerTotal = Range("G1").Offset(Rowoffset:=offsetIncrementer)
                
            Else
                tickerTotal = tickerTotal + Range("G1").Offset(Rowoffset:=offsetIncrementer)
    
            End If
            
            offsetIncrementer = offsetIncrementer + 1
            prevTicker = currTicker
            
        Next tickerCount
        
        Range("L1").Offset(Rowoffset:=(iOffsetIncrementer)) = tickerTotal
        stockClosingBal = Cells(lastRow, 6).Value
        Range("J1").Offset(Rowoffset:=iOffsetIncrementer) = (stockClosingBal - stockOpenBal)
        
        'Stock Opening Balance is 0 for multiple tickers. Division by 0 is not a number. Hence K Column will be populated by 0
        'if the Opening Stock Balance against the ticker is 0.
        If (stockOpenBal) <> 0 Then
            Range("K1").Offset(Rowoffset:=iOffsetIncrementer) = ((stockClosingBal - stockOpenBal) / stockOpenBal)
        Else
            Range("K1").Offset(Rowoffset:=iOffsetIncrementer) = 0#
        End If
        
        'If the Yearly change is -ve then
        If Range("J1").Offset(Rowoffset:=iOffsetIncrementer) < 0 Then
            'Highlight the change in Red
            Range("J1").Offset(Rowoffset:=iOffsetIncrementer).Interior.ColorIndex = 3
        Else
            'Else highlight the change in Green
            Range("J1").Offset(Rowoffset:=iOffsetIncrementer).Interior.ColorIndex = 4
        End If
        
        'Find Maximum Year %, Minimum Year % AND Maximum Stock Balance
        Set pcRange = Range("K2:K3169")
        Set svRange = Range("L2:L3169")
              
        'Populate Greatest Labels
        Range("M2") = "Greatest % Increase"
        Range("M3") = "Greatest % Decrease"
        Range("M4") = "Greatest Total Volume"
              
        'Populate Greatest % Increase and Decrease
        Range("O2") = Application.Max(pcRange)
        Range("O3") = Application.Min(pcRange)
        Range("O4") = Application.Max(svRange)
        
        'Find the corresponding rows against the Maximum Year %, Minimum Year % AND Maximum Stock Balance
        Range("N2") = Range("I" & pcRange.Find(Range("O2").Value).Row).Value
        Range("N3") = Range("I" & pcRange.Find(Range("O3").Value).Row).Value
        Range("N4") = Range("I" & svRange.Find(Range("O4").Value).Row).Value
          
        '====================================================================================================
        
        Debug.Print ("End processing for Sheet: " & wSheet.Name)
    Next wSheet
    
    Debug.Print ("End processing for " & ThisWorkbook.Name)
    
End Sub
------------------------------------------------------------------------------------------------------------------------------
'Clear the Data and the colors in the sheets
Sub ClearStockData()
    Set wSheets = ThisWorkbook.Worksheets
    Debug.Print ("Begin processing for " & ThisWorkbook.Name)
    
    For Each wSheet In wSheets
        wSheet.Range("I2:L3169").ClearContents
        wSheet.Range("J2:J3169").Interior.ColorIndex = 0
        wSheet.Range("M2:O4").ClearContents
    Next wSheet
End Sub
