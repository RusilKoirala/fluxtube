
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

const movies = sqliteTable('movies', {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    overview: text('overview'),
    posterPath: text('poster_path'),
    backdropPath: text('backdrop_path'),
    releaseDate: text('release_date'),
    voteAverage: integer('vote_average'),
    genres: text('genres'),
    runtime: integer('runtime'),
})

export const watchlist = sqliteTable('watchlist', {
    id: integer('id').primaryKey({ autoIncrement: true}),
    movieId: integer('movie_id').notNull(),
    addedAt: text('added_at').notNull(),
})

export const watched = sqliteTable('watched',{
    id: integer('id').primaryKey({ autoIncrement: true }),
    movieId: integer('movie_id').notNull(),
    watchedAt: text('watched_at').notNull(),
    rating: integer('rating')
})