// const ipc = require('node-ipc');

// ipc.config.id   = 'hello';
// ipc.config.retry= 1500;

// ipc.connectTo(
//     'world',
//     function(){
//         ipc.of.world.on(
//             'connect',
//             function(){
//                 ipc.log('## connected to world ##'.rainbow, ipc.config.delay);
//                 ipc.of.world.emit(
//                     'message',
//                     {type: 'redis.get'}
//                 )
//             }
//         );
//         ipc.of.world.on(
//             'disconnect',
//             function(){
//                 ipc.log('disconnected from world'.notice);
//             }
//         );
//         ipc.of.world.on(
//             'message',
//             function(value){
//                 console.log({value})
//                 // ipc.log('got a message from world : '.debug, data);
//             }
//         );
//     }
// );