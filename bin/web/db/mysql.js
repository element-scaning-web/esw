const CONF = require('./conf.js');
var mysql=require("mysql");

var pool = mysql.createPool({
	host     : CONF.HOST,     
	user     : CONF.USER,             
	password : CONF.PWD,       
	port:CONF.PORT,                   
	database:CONF.DB
});

exports.query = async function(sql, arr, callback){
    pool.getConnection( async function(err,connection){
        if(err){throw err;return;}
		console.log('sql:' + sql);
		console.log('params:' + arr);
        await  connection.query(sql,arr,async function(error,results,fields){
            await  connection.release();
			//pool.releaseConnection(conn);
            if(error) throw error;
            callback && callback(results,fields);
        });
    });
};

exports.query2= ( sql , ...params )=>{
    return new Promise(function(resolve,reject){
        pool.getConnection(function(err,connection){
            if(err){
                reject(err);
                return; 
            }
            connection.query( sql , params , function(error,res){
                connection.release();
                if(error){
                    reject(error);
                    return;
                }
                resolve(res);
            });
        });
    });
};

