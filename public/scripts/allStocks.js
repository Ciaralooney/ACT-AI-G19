async function fetchStockData() {
    try {
      const response = await fetch('/stocks'); // Adjust to your route if necessary
      const stockList = await response.json();

      // Update table with new data
      for (const [symbol, data] of Object.entries(stockList)) {
        const row = document.getElementById(symbol);
        if (row) {
          row.cells[1].innerText = data.Close;
          row.cells[2].innerText = data.High;
          row.cells[3].innerText = data.Low;
          row.cells[4].innerText = data.Open;
          row.cells[5].innerText = data.Volume;
        }
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
    // Fetch stock data every 60 seconds (60000 ms)
    setInterval(fetchStockData, 6000);

    // Initial load
    fetchStockData();
  }
