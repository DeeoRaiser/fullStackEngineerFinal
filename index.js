const app = require('./app');
const port = 4001
const dbURL = 'mongodb+srv://admin:Qs28dHsu8b4Ibhd4@db-1.0oj9boi.mongodb.net/'

const mongoose = require('mongoose') 

mongoose.connect(dbURL)
                    .then(() =>{ 
                        console.log(`\x1b[35m Conectado a MongoDB\x1b[37m`)

                        app.listen(port, ()=>{ 
                            console.log(`\x1b[36m Servidor corriendo en puerto: ${port} \x1b[37m`)
                        }) 

                    }).catch(function(error){ 
                        console.log(error)
                    })


                    