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

historical_data = {}
stock_symbols = {'aapl'}  # 'msft','amzn','goog','googl','meta','nvda','tsla','nflx','intc','adbe','crm','orcl','amd','csco','shop'}
for symbol in stock_symbols:
    stock = yf.Ticker(symbol)
    hist = stock.history(period='1d')
    
    hist = hist.to_dict()
    
    for stock in hist:
        for key in hist[stock]:
                print(stock, key, hist[stock][key])
    
    # historical_data[symbol] = 

print(json.dumps(historical_data))
