// const amqp = require('amqplib/callback_api');
//
// amqp.connect('amqp://localhost', function(error0, connection) {
//     if (error0) {
//         throw error0;
//     }
//     connection.createChannel(function(error1, channel) {
//         if (error1) {
//             throw error1;
//         }

//         const exchange = "player_queue_1_dash";
//
//         channel.assertExchange(exchange, 'fanout', {
//             durable: false
//         });
//
//         channel.assertQueue('', {
//             exclusive: false
//         }, function(error2, q) {
//             if (error2) {
//                 throw error2;
//             }
//             console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
//             channel.bindQueue(q.queue, exchange, '');
//
//             channel.consume(q.queue, function(msg) {
//                 if (msg.content) {
//                     const obj = JSON.parse(msg.content);
//                     console.log(" [x] %s", msg.content.toString());
//                     if(obj.event === "preflop"){console.log("preflop")}
//                     if(obj.event === "flop_cards"){console.log("flop_cards")}
//                     if(obj.event === "turn_card"){console.log("turn_card")}
//                     if(obj.event === "river_card"){console.log("river_card")}
//                     if(obj.event === "winner"){console.log("winner")}
//                     if(obj.event === "request_action"){console.log("request_action")}
//                 }
//             }, {
//                 noAck: true
//             });
//         });
//     });
// });
