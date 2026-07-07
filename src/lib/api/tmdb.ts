import axios from 'axios'

export const tmdbClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_TMDB_BASE_URL,
    params: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
    }
})

export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;

export const getImageUrl = (path: string | null, size: string = 'w500') => {
    if (!path) return '/placeholder-movie.png'
    return `${IMAGE_BASE_URL}/${size}${path}`
}