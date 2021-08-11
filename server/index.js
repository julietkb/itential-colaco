const express = require("express")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 3002

const app = express()

const fileName = "../server/sodas.json"
const data = fs.readFileSync(path.resolve(__dirname, fileName))

app.get("/api", (req, res) => res.json({ message: "Server API" }))

app.get('/sodas', (req, res) => res.send(data))

app.get('/sodas/:sodaName', (req, res) => {
    const sodaName = req.params.sodaName
    let reply = "Soda does not exist"
    const elementIdx = data.sodas.indexOf((soda) => soda.name === sodaName)
    if (elementIdx >= 0) {
        reply = data.sodas[elementIdx]
    }
    res.send(reply)
})

app.post('/sodas?name=:sodaName&quantity=:quantity', (req, res) => {
    const {quantity, sodaName} = req.params
    let reply = "Quantity cannot be updated"
    const elementIdx = data.sodas.indexOf((soda) => soda.name === sodaName)
    if (quantity && elementIdx >= 0) {
        // const soda = data.sodas[elementIdx]
        // const sodaWithUpdatedQuantity = {...soda, quantity}
        data.sodas[elementIdx].quantity = quantity
        fs.writeFileSync(fileName, JSON.stringify(data))
        reply = data.sodas[elementIdx]
    }
    res.send(reply)
})

app.listen(PORT, () => console.log(`ColaCo server listening on ${PORT}`))