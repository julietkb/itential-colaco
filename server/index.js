const express = require("express")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 3002

const app = express()

const data = fs.readFileSync(path.resolve(__dirname, "../server/sodas.json"))

app.get("/api", (req, res) => res.json({ message: "Server API" }))

app.get('/sodas', (req, res) => res.send(data))

app.get('/sodas/:sodaName', (req, res) => {
    const sodaName = req.params.sodaName
    let reply = "Soda does not exist"
    const elementIdx = elements.sodas.indexOf((soda) => soda.name === sodaName)
    if (elementIdx >= 0) {
        reply = elements[elementIdx]
    }
    res.send(reply)
})

app.listen(PORT, () => console.log(`ColaCo server listening on ${PORT}`))