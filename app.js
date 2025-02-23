const express = require('express');
const crypto = require('node:crypto');
const cors = require('cors');

const movies = require('./movies.json');
const z = require('zod');
const { validateMovie , validatePartial } = require('./schemas/movies.js');

const app = express();
app.use(express.json());
app.use(cors({
    origin: (origin, cb) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:3000',
            'http://localhost:8080',
            'https://localhost:3333'
        ]

        if (ACCEPTED_ORIGINS.includes(origin)){
            return cb(null, true)
        }
        if (!origin){
            return cb(null, true)
        }

        return cb(new Error('Not allowed by CORS'))
    }
}))

app.disable('x-powered-by');


app.get('/', (req, res) => {
    res.json({ message: 'Tranka palanka' });
})

// traer pelis 
app.get('/movies', (req, res) => {
    const { genre } = req.query;
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies);
    }    
    res.json(movies);
})

// traer id
app.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id);
    if (movie) return res.json(movie);

    res.status(404).json({ message: 'Movie not found' });
})

// postear peli

app.post('/movies/', (req, res) => {
    const result = validateMovie(req.body)
    if (!result.success){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    movies.push(newMovie);
    res.status(201).json(newMovie);
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartial(req.body);

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex] = updatedMovie;
    return res.json(updatedMovie);
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);
    
    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    movies.splice(movieIndex, 1);
    return res.json({message: 'Movie deleted'});
})


const PORT = process.env.PORT ?? 3333;


app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
})