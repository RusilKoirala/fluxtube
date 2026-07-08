
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'


// my wonderfull usersss 
export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ 
        autoIncrement: true
    }),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    createdAt: text('created_at').notNull(),
})


// my movies schema
export const movies = sqliteTable('movies', {
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



// my movie watchlist
export const watchlist = sqliteTable('watchlist', {
    id: integer('id').primaryKey({ autoIncrement: true}),
    userId: integer('user_id').notNull(),
    movieId: integer('movie_id').notNull(),
    addedAt: text('added_at').notNull(),
})


// my watched moives
export const watched = sqliteTable('watched',{
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    movieId: integer('movie_id').notNull(),
    watchedAt: text('watched_at').notNull(),
    rating: integer('rating'),
})



// reviews schema
export const reviews = sqliteTable('reviews', {
    id: integer('id').primaryKey({ 
        autoIncrement: true
    }),
    userId: integer('user_id').notNull(),
    movieId: integer('movie_id').notNull(),
    content: text('content').notNull(),
    rating: integer('rating').notNull(),
    createdAt: text('created_at').notNull(),
})