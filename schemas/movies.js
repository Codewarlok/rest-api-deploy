const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Title must be a string',
        required_error: 'Title is required'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
        {
            required_error: 'Movie genre is required',
            invalid_type_error: 'Movie genre must be an array of enum Genre'
        }) ,
    year: z.number().int().min(1888).max(2077),
    duration: z.number().int().positive(),
    director: z.string(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    })
});

function validateMovie (object) {
    return movieSchema.safeParse(object)
}

function validatePartial (object ) {
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie, validatePartial
}