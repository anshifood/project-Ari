import express from 'express';

const app = express();

const port = process.env.PORT || 3000;

app.get('/',
  
  
  (req, res) => {
    res.send('<i>Server is ready </i>');
}


);

// a list of 5 jokes 
/*

*/
app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            title: 'A joke',
            content: 'Why did the scarecrow win an award? Because he was outstanding in his field!'
        },
        {
            id: 2,
            title: 'Another joke',
            content: 'Why don’t scientists trust atoms? Because they make up everything!'
        },
        {
            id: 3,
            title: 'A third joke',
            content: 'I told my wife she was drawing her eyebrows too high. She looked surprised.'
        },
        {
            id: 4,
            title: 'A fourth joke',
            content: 'What do you call a fake noodle? An Impasta!'
        },
        {
            id: 5,
            title: 'A fifth joke',
            content: 'Why did the bicycle fall over? Because it was two tired!'
        }
    ];
    res.send(jokes);
});

app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});