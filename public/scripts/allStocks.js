
let listSymbols = ['aapl','msft','amzn','goog','googl','meta','nvda','tsla','nflx','intc','adbe','crm','orcl','amd','csco','shop']

fetch('/stocks',{
    method: "POST",
    headers:{
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({symbols:listSymbols}),
})
