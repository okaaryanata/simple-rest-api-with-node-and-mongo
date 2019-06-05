const express = require('express');
// untuk JSON
const bodyParser = require('body-parser');
const app = express();
// import mongoDB ke project
const MongoClient = require('mongodb').MongoClient;
// karena butuh objectId untuk mongodb, maka import mongodb
const ObjectID = require('mongodb').ObjectID;
// tentukan url untuk db
const DBUrl = "mongodb://127.0.0.1:27017/";
const DBName = "arkademy";

// ==== Buat objek koneksi DB
let dbo = null;
// coneksikan mongoclient dengan dburl
MongoClient.connect(DBUrl,(error,db)=>{
    if(error) throw error;
    dbo = db.db(DBName);
})

// ==============

// agar dapat membaca body JSON
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',function (req,res){
    res.send("Hallo KUMIS KUCING");
})

app.listen('8080');

app.get('/siswa',(request,response)=>{
    dbo.collection("siswa").find().toArray((err,res)=>{
        if(err) throw err;
        response.json(res);
    })
})
app.get('/siswa/:id',(request,response)=>{
    let id = request.params.id;
    // buat object untuk menyimpan id project baru dari id params
    let id_object = new ObjectID(id);

    dbo.collection("siswa").findOne({"_id":id_object},(err,result)=>{
        if(err) throw err;
        response.json(result);
    })
})

app.post('/siswa', (request,response)=>{
    let namaSiswa = request.body.nama;
    let alamat = request.body.alamat;

    dbo.collection("siswa").insertOne({
        nama : namaSiswa,
        alamat : alamat
    }, (err,res)=>{
        if(err) throw err;
        response.json(res);
    })
})

app.delete('/siswa/:id',(request,response)=>{
    let id = request.params.id;
    let id_object = new ObjectID(id);
    
    dbo.collection("siswa").deleteOne({
        _id:id_object
    },(err,res)=>{
        if (err) throw err;
        response.json(res);
    })
})

app.put('/siswa/:id',(request,response)=>{
    let id = request.params.id;
    let id_object = new ObjectID(id);
    let siswaNama = request.body.nama;
    let siswaAlamat = request.body.alamat;

    dbo.collection("siswa").updateOne({
        _id : id_object
    },{$set:{
        nama : siswaNama,
        alamat : siswaAlamat
    }},(err,res)=>{
        if(err) throw err;
        response.json(res);
    })
})

app.delete('/testDeleteBody',(req,res)=>{
    let namaSiswa = req.body.nama;
    res.end("Nama siswa : "+namaSiswa+" akan dihapus dari sistem");
})

// app.put('/siswa',(req,res)=>{
//     let namaSiswaAsal = req.body.nama_asal;
//     let namaSiswaBaru = req.body.nama_baru;
//     res.end("Nama siswa "+namaSiswaAsal+" akan diganti dengan "+namaSiswaBaru);
// })

// app.put('/siswaPut/:id',(req,res)=>{
//     let siswaId = req.params.id;
//     let siswaNama = req.body.nama;
//     let siswaAlamat = req.body.alamat;

//     res.end("Siswa dengan ID "+siswaId+" , telah diupdate!");
// })