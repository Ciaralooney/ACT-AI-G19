import pandas as pd
import yfinance as yf
import plotly.express as px
from flask import Flask, render_template_string, jsonify, request

app = Flask(__name__)

@app.route('/get_stock_data', methods=['POST'])
def get_stocks():
    data = request.get_json()
    historical_data = {}
    stock_symbols = data.get('array',[])
    
    stock_symbols = stock_symbols['listSymbols']
    print(stock_symbols)
    for symbol in stock_symbols:
        stock = yf.Ticker(symbol)
        hist = stock.history(period='1d').to_dict()
        # historical_data[symbol] = hist.to_dict()
        
        historical_data[symbol] = {}
        
        for stock in hist:
            for key in hist[stock]:
                historical_data[symbol][stock] = hist[stock][key]
    
    # print(historical_data)
    
    return jsonify(historical_data)



@app.route('/api/stocks', methods=['GET'])
def get_stock_data():
    symbol = request.args.get('symbol', 'AAPL')  # Default to AAPL if no symbol is provided
    stock = yf.Ticker(symbol)
    data = stock.history(period='1d')  # Get daily stock data

    if data.empty:
        return jsonify({'error': 'No data found for symbol: ' + symbol}), 404

    return jsonify({
        'symbol': symbol,
        'date': data.index[0].strftime('%Y-%m-%d'),
        'open': float(data['Open'].iloc[0]),  # Convert numpy.float64 to Python float
        'close': float(data['Close'].iloc[0]),
        'high': float(data['High'].iloc[0]),
        'low': float(data['Low'].iloc[0]),
        'volume': int(data['Volume'].iloc[0])  # Convert numpy.int64 to Python int
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
