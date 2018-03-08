//@ts-check
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const mongoConnectionUrl = process.env.mongoConnectionUrl || "mongodb://localhost:27017/";
const dbName = "flockBuild";
const collection = "build_";
const port = process.argv[2] || 8800;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'app/build')));
app.use('/static', express.static(path.join(__dirname, 'app/build/static')));

MongoClient.connect(mongoConnectionUrl, function (err, client) {
    let db = client.db(dbName);
    db.collection("build_android").createIndex({"build_name": "text" }, () => {
        console.log("Created/Ensured index for collection build_android");
    })
    db.collection("build_ios").createIndex({"build_name": "text" }, () => {
        console.log("Created/Ensured index for collection build_ios");
    })
})

app.get('/', (req, res) => res.sendFile('app/build/index.html', { root: __dirname }));

app.get("/list/:platform/", (req, res) => {
    let limit = 50;
    let start = 0;
    let name = "";
    let platform = req.params.platform;
    if (req.query.limit) {
        let parsedLimit = parseInt(req.query.limit);
        limit = parsedLimit <= 50 ? parsedLimit : 50;
    }
    if (req.query.start) {
        limit = parseInt(req.query.start);
    }
    if (req.query.name){
        name = req.query.name;
    }
    let query = {}
    if (name != ""){
        query = {"$text":{$search:name}};
    }
    queryBuild(collection+platform, query, limit, start).then((data)=>{
        return res.json(data);    
    }, (err)=>{
        return res.status(500).send(err);
    });
    
})

app.post('/create/:platform/', (req, res) => {
    let data = req.body;
    let platform = req.params.platform;
    try {
        validateCreatePayload(data)
        if (!data["description"]){
            data.description = "";
        }
        if(!data["app_version"]){
            data.app_version = "0.0.0";
        }
        MongoClient.connect(mongoConnectionUrl, function (err, client) {
            if (err != null) {
                return res.status(500).send(err);
            }
            let documentPromise = insertDocuments(client, sanitizeInput(data), collection + platform);
            documentPromise.then((data) => {
                return res.json({ status: "success", message: "Successfully inserted into DB", dbResponse: data });
            }, (err) => {
                return res.status(500).send(err);
            })
        });
    }
    catch (e) {
        console.error(e)
        return res.status(500).send({ "error": e });
    }
})

app.listen(port, () => console.log('Build repository running on port: ' + port));

const validateCreatePayload = function (jsonData) {
    if (!jsonData["build_name"]) {
        throw "Missing build name, fieldName: 'build_name'";
    }
    if (!jsonData["url"]) {
        throw "Missing build URL, fieldName: 'url'";
    }
    return;
}

const sanitizeInput = function(jsonData){
    return {build_name:jsonData.build_name, url:jsonData.url, description:jsonData.description, app_version:jsonData.app_version};
}

const queryBuild = function (collectionName, query, limit, start) {
    let promise = new Promise((resolve, reject)=>{
        MongoClient.connect(mongoConnectionUrl, function (err, client) {
            const db = client.db(dbName);
            let promiseDb = db.collection(collectionName).find(query).sort({ _id: -1 }).skip(start).limit(limit).toArray();
            promiseDb.then((data)=>{
                client.close();
                resolve(data);
            }, (err)=>{
                client.close();
                reject(err)});
        });
    })
    return promise;
}

const insertDocuments = function (client, document, collectionName) {
    const db = client.db(dbName);
    document["timestamp"] = (new Date()).getTime();
    const collection = db.collection(collectionName);
    let promise = new Promise((resolve, reject) => {
        collection.insertOne(document, function (err, result) {
            if (err) {
                client.close();
                return reject(err)
            }
            console.log("Inserted document into the collection -> ", JSON.stringify(document));
            client.close();
            return resolve(result)
        });
    });
    return promise;
}