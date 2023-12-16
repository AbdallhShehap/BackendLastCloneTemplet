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
const DetailsFixedRoute = require('./Router/DetailsFexedRoute');
const OfferRoute = require('./Router/OfferRoute');
const ReviewsrRoute = require('./Router/Reviews');
const IconUnderReviewsRoute = require('./Router/IconUnderReviewsRoute');
const NewsSliderRoute = require('./Router/NewsSlider');
const LogoRoute = require('./Router/LogoRoute');
const FooterRoute = require('./Router/FooterRoute');
const FooterSocialIconsRoute = require('./Router/FooterSocialIconsRoute');
const MenuSocialIconsRoute = require('./Router/MenuSocialIconsRoute');
const MainSectionRoute = require('./Router/MainSectionRoute');
const AddPagesRoute = require('./Router/AddPagesRoute');
const Superadmin = require('./Router/SuperadminRoute');

const dotenv = require("dotenv");
dotenv.config({path : "./config.env"});
const PORT = process.env.PORT ;
const path = require('path');


const app = express();

app.use(express.json());
app.use(bodyParser.json());
const cors = require("cors");
const SuperadminModel = require("./Module/SuperadminModel");
app.use(cors());


app.use('/images', express.static(path.join(__dirname, 'images')));


// Use the Login route
app.use('/admin', Superadmin);


// Use the side menu route
app.use('/sidemenu', SideMenuRoute);


// Use the our benfitsroute
app.use('/ourbenfits', OurBenfitsRoute);

// Use the our firstmarquee
app.use('/firstmarquee', FirstMarqueeRoute);
// app.use('/images', express.static(path.join(__dirname, 'images')));


// Use the our secoundmarquee
app.use('/secoundmarquee', SecoundMarqueeRoute);

// Use the our thirdmarquee
app.use('/thirdmarquee', ThridMarqueeRoute);


// Use the our thirdmarquee
app.use('/categories', CategoriesRoute);


// Use the our details
app.use('/details', DetailsRoute);

// Use the our fixddetails
app.use('/fixeddetails', DetailsFixedRoute);



// Use the our details
app.use('/offer', OfferRoute);



// Use the our Reviews
app.use('/reviews', ReviewsrRoute);




// Use the our IconUnderReviewsRoute
app.use('/iconunderreviews', IconUnderReviewsRoute);




// Use the our NewsSliderRoute
app.use('/newsslider', NewsSliderRoute);


// Use the our LogoRoute
app.use('/logo', LogoRoute);


// Use the our FooterRoute
app.use('/footer', FooterRoute);


// Use the our Footer Social Icons Route
app.use('/footericons', FooterSocialIconsRoute);


// Use the our menu Social Icons Route
app.use('/menuicons', MenuSocialIconsRoute);



// Use the our menu Social Icons Route
app.use('/mainsection', MainSectionRoute);



// Use the pages Route
app.use('/pages', AddPagesRoute);




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