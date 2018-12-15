const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (request, response) => {
    response.redirect('./public/index.html');
});

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});
