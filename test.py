import pandas as pd
import yfinance as yf
import plotly.express as px
# from flask import Flask, render_template_string
from flask import Flask, render_template_string, jsonify, request
import json
# tickers = ['AAPL', 'GOOGL', 'MSFT']

# # Step 2: Download historical data for the tickers
# data = yf.download(tickers, period='6mo', interval='1d')

# # Step 3: Extract 'Close' prices for each ticker
# closing_prices = data['Close']
# print(closing_prices)
# # Step 4: Plot each ticker's closing prices using Plotly Express
# for ticker in tickers:
#     # Create a new plot for each ticker
#     fig = px.line(
#         closing_prices, 
#         x=closing_prices.index, 
#         y=ticker, 
#         title=f'{ticker} Closing Price Over Time',
#         labels={'x': 'Date', 'y': 'Price (USD)'}
#     )
    
#     # Show the figure
#     fig.show()

def testMethod():
    historical_data = {}
    stock_symbols = {'aapl','msft','amzn','goog','googl','meta','nvda','tsla','nflx','intc','adbe','crm','orcl','amd','csco','shop'}
    for symbol in stock_symbols:
        stock = yf.Ticker(symbol)
        hist = stock.history(period='1d')
        
        hist = hist.to_dict()
        
        for stock in hist:
            for key in hist[stock]:
                print(stock, key, hist[stock][key])
        
        # historical_data[symbol] = 

    print(json.dumps(historical_data))
# testMethod()

def get_stock_data():
    symbol = request.args.get('symbol', 'AAPL')  # Default to AAPL if no symbol is provided
    stock = yf.Ticker('aapl')
    data = stock.history(period='1d')  # Get daily stock data

    if data.empty:
        return jsonify({'error': 'No data found for symbol: ' + symbol}), 404

    print({
        'symbol': 'aapl',
        'date': data.index[0].strftime('%Y-%m-%d'),
        'open': float(data['Open'].iloc[0]),  # Convert numpy.float64 to Python float
        'close': float(data['Close'].iloc[0]),
        'high': float(data['High'].iloc[0]),
        'low': float(data['Low'].iloc[0]),
        'volume': int(data['Volume'].iloc[0])  # Convert numpy.int64 to Python int
    })
stock = yf.Ticker('AAPL')
# hist = stock.history(period = '1d',interval = '1m').iloc[-1].to_dict()    

# df = yf.download(
# tickers = "DOGE-USD",
# period = "1d",
# interval = "1m"
# ).iloc[-1]
dict ={}
stockFin = stock.financials.iloc[:,0]
for index in stockFin.index:
    dict[index] = stockFin[index]

print(json.dumps(dict))



