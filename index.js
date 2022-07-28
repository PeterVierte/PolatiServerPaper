const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const PORT = 8000;
const { writeFileSync } = require("fs");


let finalFile;

const paperNames = ['РВ2', 'ОПП', 'ОЗП1', 'ОЗП2', 'МСЛ'];


app.use(cors());
app.use(express.json({limit: '50mb'}));

function start() {
    try{

        app.listen(PORT, () => {
            console.log("All WORKS");
        })

    } catch(e) {
        console.log(e);
    } 
}

start();

app.post('/getinfo', (req, res) => {
    try{
        const mail = req.body.mail;
        const pass = req.body.pass;

        console.log(mail);
        console.log(pass);

        res.sendStatus(200);
    } catch(err) {
        console.log(err)
    }
})

app.post('/sendfile', async function(req, res){
    const file = req.body.file;
    const fileName = req.body.fileName; 

    var data = file.split(",")[1]

    const image = Buffer.from(data, "base64");
    finalFile = `${__dirname}/files/${fileName}`
    writeFileSync(finalFile, image);

    res.download(finalFile)
});

app.get('/download', (req, res) => {
    res.download(finalFile)
})

app.post('/createFolders', async function (req, res) {
    const names = req.body.names;
    const company = req.body.company;
    let missingPapers = [];

    names.forEach(name => {
        fs.mkdirSync(`folder_files/${name}`);
        fs.mkdirSync(`folder_files/${name}/Уд-ия`);
        fs.mkdirSync(`folder_files/${name}/Уд-ия/${company}`);
        fs.mkdirSync(`folder_files/${name}/Уд-ия/${company}/Монтажник`);

        paperNames.forEach(paper => {
            if(fs.existsSync(`files/${paper} - ${name}.jpg`)) {
                fs.copyFileSync(`files/${paper} - ${name}.jpg`, `folder_files/${name}/Уд-ия/${company}/Монтажник/${paper} - ${name}.jpg`);
            } else {
                missingPapers.push(`${paper} - ${name}`);
            }  
        })
    })
    
    res.send(missingPapers)

})
