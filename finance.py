import pandas as pd
import yfinance as yf
import plotly.express as px
from flask import Flask, render_template_string


#imports stock data from yahooFinance 
symbol = yf.Ticker("msft")

#type of stockInfo is dict
stockInfo = symbol.info
companyName = symbol.info['longName']

# Sample market data in a Pandas DataFrame
data = symbol.history(period="1mo")
# print(data)
df = pd.DataFrame(data)
# Create a Plotly figure

fig = px.line(df, y='Open', title= f'Market Prices of {companyName} Over Time')
fig.show()

# Convert the plot to HTML
graph_html = fig.to_html(full_html=False)

app = Flask(__name__)
# Serve the graph on a webpage

@app.route('/')
def index():
    # Render the graph HTML inside a simple template
    return render_template_string('''
    <html>
        <head>
            <title>Market Data Visualization</title>
        </head>
        <body>
            <h1>Market Prices of {{name}}</h1>
            {{ graph|safe }}
        </body>
    </html>
    ''', graph=graph_html, name = companyName)

if __name__ == '__main__':
    app.run(debug=True)