// var app = require('@feathersjs/feathers');
// var http = require('http').Server(app);
// var io = require('socket.io-client');
var count = 0;
var fs = require('fs'), bite_size = 256,
    readbytes = 0,
    file, i = 0,data;
module.exports = async (context) => {
    const { app } = context;
    console.log("csv_file");
    // socket = io('http://localhost:3000');
var socket = app.io;
    socket.on('connection', function (socket) {
        console.log("inside function")
        socket.on('message', function (msg) {
            var csv = fs.open('../../foo.csv', 'r', function (err, fd) {
                file = fd;
                setInterval(myFunction, 2000);
            });
            myFunction = () => {
                console.log("Inside file reading function");
                fs.readFile('../../foo.csv', function (err, data) {
                if (err)
                {
                throw err;
                }
                console.log("data read", data.toString());
                socket.emit('message', data.toString());
                });
                }
            // function readsome() {
            //     // socket.emit('message', "hello"+count++);
            //     var stats = fs.fstatSync(file); // yes sometimes async does not make sense!
            //     if (stats.size < readbytes + 1) {
            //         // console.log('Hehe I am much faster than your writer..! I will sleep for a while, I deserve it!');
            //         setTimeout(readsome, 3000);
            //     }
            //     else {
            //         fs.read(file, new Buffer(bite_size), 0, bite_size, readbytes, processsome);
            //     }
            // }
    
            // function processsome(err, bytecount, buff) {
            //     console.log('Read', bytecount, 'and will process it now.');
    
            //     // Here we will process our incoming data:
            //     // Do whatever you need. Just be careful about not using beyond the bytecount in buff.
            //     data = buff.toString('utf-8', 0, bytecount);
            //     console.log("buff.toString('utf-8', 0, bytecount)  ====>", buff.toString('utf-8', 0, bytecount));
    
            //     // So we continue reading from where we left:
            //     readbytes += bytecount;
            //     process.nextTick(readsome);
            //     console.log("Message event triggered!!!!")
            //     socket.emit('message', data);
            // }


            // context.result.csv = io.emit(csv);
            // return csv;


            
        });
        socket.on('disconnect', function () {
            console.log("Disconnect triggered!")
            socket.disconnect();
        });
    });

    // http.listen(4000, function () {
    //     console.log('listening on *:4000');
    // });
}