let apiKey = "";

//for more than 2 executions per day, supply an api key below. Uncomment the next line.
//let apiKey = "?registrationkey=";

let responseCount = 0;

const sectorCodes = {
    "00": "Total nonfarm",
    "05": "Total private",
    "06": "Goods-producing",
    "07": "Service-providing",
    "08": "Private service-providing",
    "10": "Mining and logging",
    "20": "Construction",
    "30": "Manufacturing",
    "31": "Durable Goods",
    "32": "Nondurable Goods",
    "40": "Trade, transportation, and utilities",
    "41": "Wholesale trade",
    "42": "Retail trade",
    "43": "Transportation and warehousing",
    "44": "Utilities",
    "50": "Information",
    "55": "Financial activities",
    "60": "Professional and business services",
    "65": "Education and health services",
    "70": "Leisure and hospitality",
    "80": "Other services",
    "90": "Government"
};

let code = Object.keys(sectorCodes);

const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
    aqua: 'rgb(0,255,255)',
    aquamarine: 'rgb(127,255,212)',
    blueViolet: 'rgb(138,43,226)',
    coral: 'rgb(255,127,80)',
    darkMargenta: 'rgb(139,0,139)',
    darkTurquoise: 'rgb(0,206,209)',
    deepPink: 'rgb(255,20,147)',
    gold: 'rgb(255,215,0)',
    lavender: 'rgb(230,230,250)',
    navy: 'rgb(0,0,128)',
    rosyBrown: 'rgb(188,143,143)',
    salmon: 'rgb(250,128,114)',
    sienna: 'rgb(160,82,45)',
    teal: 'rgb(0,128,128)',
    wheat: 'rgb(245,222,179)',
  };

  const CHART_COLORS_50_Percent = {
    red: 'rgba(255, 99, 132, 0.5)',
    orange: 'rgba(255, 159, 64, 0.5)',
    yellow: 'rgba(255, 205, 86, 0.5)',
    green: 'rgba(75, 192, 192, 0.5)',
    blue: 'rgba(54, 162, 235, 0.5)',
    purple: 'rgba(153, 102, 255, 0.5)',
    grey: 'rgba(201, 203, 207, 0.5)',
    aqua: 'rgba(0, 255, 255, 0.5)',
    aquamarine: 'rgba(127, 255, 212, 0.5)',
    blueViolet: 'rgba(138, 43, 226, 0.5)',
    coral: 'rgba(255, 127, 80, 0.5)',
    darkMargenta: 'rgba(139, 0, 139, 0.5)',
    darkTurquoise: 'rgba(0, 206, 209, 0.5)',
    deepPink: 'rgba(255, 20, 147, 0.5)',
    gold: 'rgba(255, 215, 0, 0.5)',
    lavender: 'rgba(230, 230, 250, 0.5)',
    navy: 'rgba(0, 0, 128, 0.5)',
    rosyBrown: 'rgba(188, 143, 143, 0.5)',
    salmon: 'rgba(250, 128, 114, 0.5)',
    sienna: 'rgba(160, 82, 45, 0.5)',
    teal: 'rgba(0, 128, 128, 0.5)',
    wheat: 'rgba(245, 222, 179, 0.5)',
  };

  let colorKeys = Object.keys(CHART_COLORS);
  let rgbText = CHART_COLORS[colorKeys];
  let highlightColor = Object.keys(CHART_COLORS_50_Percent);
  let rgbaText = CHART_COLORS_50_Percent[highlightColor];

  const labels = [];

  const data = {
    labels: [],
    datasets: []
  };
  
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Number of Employees in Thousands'
        }
      }
    }
  };

function responseReceivedHandler(){
  if (this.status == 200) {
    
    let ourData = this.response.Results.series;

    for (let i = 0; i < ourData.length; i++) {
      let dataArray = ourData[i].seriesID.substring(3,5);
        console.log(dataArray);
        console.log(ourData);
        console.log(sectorCodes[dataArray]);
        
      let chartData = {
        label: '',
        data: [],
        borderColor: [],
        backgroundColor: [],
        hidden: true
      };
        
      chartData.label = sectorCodes[dataArray];
        
      let valueArray = ourData[i].data;
      for (let k = valueArray.length - 1; k>=0; k--){
        chartData.data.push(valueArray[k].value);
        if (responseCount == 0){
        data.labels.push(valueArray[k].periodName + '/' + valueArray[k].year);
        }
      };

      data.datasets.push(chartData);

      chartData.borderColor = CHART_COLORS[colorKeys[responseCount]];
      chartData.backgroundColor = CHART_COLORS_50_Percent[highlightColor[responseCount]];

      responseCount++;
    }
  }
  // 3 should change # of super sectors (code.length)
  if (responseCount == code.length){
    const myChart = new Chart(
      document.getElementById('myChart'),
        config);
  }
    
};

//change 3 to code.length


for(let i = 0; i < code.length; i++){
  let sscode = "https://api.bls.gov/publicAPI/v2/timeseries/data/CEU"+code[i]+"00000001"+apiKey;
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", responseReceivedHandler);
  xhr.responseType = "json";
  xhr.open("GET", sscode);
  xhr.send();
};


