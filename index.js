const fs = require('fs');
const http = require('http');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const repalceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].country);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=af64de819b92bf5e608a250038954bcb'
        )
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                //console.log(arrData[0].main.temp);
                const realtimeData = arrData.map((val) => repalceVal(homeFile, val))
                .join("");
                res.write(realtimeData);
                    //console.log(realtimeData);

            })
            .on('end',  (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();

               
            });
    }
});

server.listen(8000,"127.0.0.1")