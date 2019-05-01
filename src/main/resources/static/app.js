var app = (function () {
    var con;

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    var connection ='/topic/newpoint'
    
    var stompClient = null;

    var addPointToCanvas = function (point) {       
        
        console.log(point);
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
      

    };

    var addPolygon = function(points){
        console.log(points);
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(points[0].x,points[0].y);
        ctx.lineTo(points[1].x,points[1].y);
        ctx.lineTo(points[2].x,points[2].y);
        ctx.lineTo(points[0].x,points[0].y);
        ctx.closePath();
        ctx.fill();
    }
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe("/topic/newpoint."+con, function (eventbody) {
                console.log("recibir punto "+connection)
                var p=JSON.parse(eventbody.body);
                addPointToCanvas(p)
            });

            stompClient.subscribe("/topic/newpolygon."+con, function (eventbody) {
                console.log("recibit poligono "+con)
                var p=JSON.parse(eventbody.body);
                addPolygon(p)
            });
        });

    };
    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            can.addEventListener("click", function(evt){

                var pt=getMousePosition(evt);
                addPointToCanvas(pt)
                
                stompClient.send("/app/newpoint."+con, {}, JSON.stringify(pt)); 
                console.log("al enviar"+connection)
                
            });
            
            
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);

            //publicar el evento
         
            stompClient.send(connection, {}, JSON.stringify(pt)); 
        },

        connect: function(conn){
            con=conn;
            var can = document.getElementById("canvas");
            const cant = can.getContext('2d');
            cant.clearRect(0, 0, canvas.width, canvas.height);

             
            connection="/topic/newpoint."+con;


            //websocket connection
            app.disconnect(),
            connectAndSubscribe();

        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
                stompClient=null;
            }
            //setConnected(false);
            console.log("Disconnected");
        }
    };

})();