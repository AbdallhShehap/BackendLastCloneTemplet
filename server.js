//Import Modules
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./Module/allData");
const SideMenuRoute = require('./Router/SideMenuRoute');
const OurBenfitsRoute = require('./Router/OurBenfitsRoute');
const FirstMarqueeRoute = require('./Router/FirstMarqueeRoute');
const SecoundMarqueeRoute = require('./Router/SecoundMarqueeRoute');
const ThridMarqueeRoute = require('./Router/ThirdMarqueeRoute');
const CategoriesRoute = require('./Router/CategoriesRoute');
const DetailsRoute = require('./Router/DetailsRoute');
const OfferRoute = require('./Router/OfferRoute');

const dotenv = require("dotenv");
dotenv.config({path : "./config.env"});
const PORT = process.env.PORT ;



const app = express();

app.use(express.json());
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());




// Use the side menu route
app.use('/sidemenu', SideMenuRoute);


// Use the our benfitsroute
app.use('/ourbenfits', OurBenfitsRoute);

// Use the our firstmarquee
app.use('/firstmarquee', FirstMarqueeRoute);

// Use the our secoundmarquee
app.use('/secoundmarquee', SecoundMarqueeRoute);

// Use the our thirdmarquee
app.use('/thirdmarquee', ThridMarqueeRoute);


// Use the our thirdmarquee
app.use('/categories', CategoriesRoute);


// Use the our details
app.use('/details', DetailsRoute);



// Use the our details
app.use('/offer', OfferRoute);




app.get('/', (req, res) => {
    res.send('Welcome to the Qtech templet ');
  });


//   app.use((err, req, res, next) => {
//     if (err instanceof SyntaxError) {
//         // Handle JSON parsing error
//         res.status(400).json({ error: 'Invalid JSON' });
//     } else {
//         // Forward other errors to the default Express error handler
//         next(err);
//     }
// });




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})