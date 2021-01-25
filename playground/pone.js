const http = require('http');

http.createServer( function(req, res){
    const pathname = req.url; //url.parse(req.url).pathname;
    console.log(pathname);

    if(req.url === '/abcd'){
        res.writeHead(200,{'COntent-Type':'application/json'});
        res.write('abcd route');
        res.end();
    }
    res.writeHead(201, {'Content-Type': 'text/html'})
    res.write('hello world' + pathname);
    const obj = {
        name: 'mohit',
        place: 'noida'
    };
    res.write(JSON.stringify(obj));
    res.end(' <button>end of line</button>');
    res.end(' again end');
}).listen(7000);

console.log('server running at localhost:7000');
