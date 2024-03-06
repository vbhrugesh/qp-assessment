import express from "express"
const app = express()
const PORT = process.env.PORT

app.use(express.json())

app.get("/", (req, res) => {
    res.json("hello there")
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
