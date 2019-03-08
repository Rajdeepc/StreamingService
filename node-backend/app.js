
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
const AWS = require('aws-sdk');
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage});
const JSON = require('circular-json');


var musicId = 0;

/** S3 configurations */
const s3Client = new AWS.S3({
    accessKeyId: 'AKIAJUMFRWW47IJWAXJA',
    secretAccessKey: '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',
    ACL:'public-read'
});
/** S3 upload parameters */

const uploadParams = {
         Bucket: 'mymusicstream', 
         Key: null, // pass key
         Body: null, // pass file body
};


/**connection string to db */
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/musicdb");

//on error
mongoose.connection.on('error', (err) => {
    if (err) {
        console.log("Failed to established a connection " + err);
    }
});

const port = 3000;

//Adding middleware -cors
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });

/**body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**starting route */
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//port no

app.listen(port, () => {
    console.log('App is listening on' + port)
});

/**define our schema */
var musicListSchema = new mongoose.Schema({
    media_file: String,
    media_name: String,
    media_file_thumbnail: String,
    media_genre: String,
    media_artist_name: String,
    media_album_name: String,
    media_release_date: String
});


/** instances of schema */
var MusicList = mongoose.model("musiclist", musicListSchema);


/** upload music to s3 */

app.post('/upload' ,upload.single('file'), (req,res) => {
    uploadParams.Key = req.file.originalname;
    uploadParams.Body = req.file.buffer;

    const params = uploadParams;
    
    s3Client.upload(params, (err, data) => {
        if (err) {
            console.log("File uplaoded fail" + err);
            res.status(500).json({error:"Error -> " + err});
        }else {
            console.log("File uplaoded success");
            console.log("location" + JSON.stringify(data.Location));
            res.json({message: 'File uploaded successfully','filename': 
            req.file.originalname, 'location': data.Location});
           
        }
       
    });
});

/** save music to the db */
app.post("/addmusic", (req, res) => {
    musicId++;
    let newParam = Object.assign({'musicId':musicId} , req.body );
    var myData = new MusicList(newParam);
    // console.log("myData" + JSON.stringify(myData));
    myData.save()
        .then(item => {
            res.json({saved:true});
        })
        .catch(err => {
            res.status(400).json({ save: false })
        });
});

/**retrieving all music list data */

app.get('/getallMusicList', (req,res)=>{
    MusicList.find({},(err,items) => {
        console.log(err);
        res.json(items);
    })
});

/** delete a music record */

app.delete('/deleterecord/:_id', (req,res) =>{
    MusicList.findByIdAndRemove(req.params._id , (err,data) => {
    if(!err){
        console.log("Deleted");
        res.status(200).send(data);
    } else{
        console.log("Error deleting" + err);
        res.status(400).send({data: "Error in delete"});
    }
  })
});



/** update music record with id */

app.put('/:_id/updaterecord', (req,res) => {
    let id = req.params._id;
    MusicList.findByIdAndUpdate(id, { $set : {
        media_file: req.body.media_file,
        media_name: req.body.media_name,
        media_file_thumbnail: req.body.media_file_thumbnail,
        media_genre: req.body.media_genre,
        media_artist_name: req.body.media_artist_name,
        media_album_name: req.body.media_album_name,
        media_release_date: req.body.media_release_date
    }}, (err,data) => {
        if(err) {
            res.status(200).send('Update Successful');
            console.log("Error in update" + id);
        } else {
            res.status(400).send('Error in update');
        }
    })
});