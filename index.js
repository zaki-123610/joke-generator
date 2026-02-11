import express from"express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : true}));

app.get("/", (req , res) =>{
    res.render("index.ejs", { joke : null});
});

app.post("/joke", async (req, res) =>{
    const userName = req.body.name;
    try{
        const result = await axios.get("https://v2.jokeapi.dev/joke/Any?safe-mode",{
            params: {
                "safe-mode": true
            }
        });
        const jokeData = result.data;
        let jokeText = "";

        if (jokeData.type ==="single"){
            jokeText = jokeData.joke;
        } else if (jokeData.type === "twopart") {
            jokeText = `${jokeData.setup} ... ${jokeData.delivery}`;
        }
        
        jokeText = `${userName}, here is your joke: ${jokeText}`;

        res.render("index.ejs", { joke: jokeText });
    } catch (error){
        console.log("Unable to retrieve data, please try again later.");
        res.status(500).send("Error fetching joke");
    }
});

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});