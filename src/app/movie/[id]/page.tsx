'use client';

import { useAddToWatchlist, useRemoveFromWatchlist, useWatched, useWatchlist } from "@/hooks/useWatchlist";
import { useMovieStore } from "@/store/useMovieStore";
import { use } from "react";
import { Header } from "@/components/Header";
import { getImageUrl } from "@/lib/api/tmdb";
import { Calendar, Clock, Star, Plus, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieGrid } from "@/components/MovieGrid";



export default function MovieDetailPage({ params }: {params: Promise<{id: string}>}) {
    const {id}= use(params);
    const movieId = parseInt(id);

    const { data : movie, isLoading } = useMovieDetails(movieId)
    const { data: recommendations } = useRecommendations(movieId);

    const currentUserId = useMovieStore((state)=> state.currentUserId)
    const { data: watchlist = []} = useWatchlist(currentUserId || 0);


    const { data: watched=[]} = useWatched(currentUserId || 0)

    const addToWatchlist = useAddToWatchlist();




    const removeFromWatchlist = useRemoveFromWatchlist();
    const addToWatched = useAddToWatchlist();

    const isInWatchlist = watchlist.some((item:any)=> item.movieId === movieId);
    const isWatched = watched.some((item: any)=> item.movieId === movieId);


    if (isLoading) 
    {
        return(
            <div className="min-h-screen bg-black">
                <Header/>
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-400">Loading movie detail..</p>
                </div>
            </div>
        )
    }

    if (!movie)
    {
        return(
            <div className="min-h-screen bg-black">
                <Header/>
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-400">Movie not found</p>
                </div>
            </div>
        )
    }



    return (
        <div className="min-h-screen bg-black">
            <Header/>
            <div className="relative h-[70vh]">
                <Image 
                    src={getImageUrl(movie.backdrop_path, 'original')}
                    alt={movie.title}
                    fill
                    className='object-cover'
                    priority
                />

                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"/>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="container mx-auto">
                        <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>

                        {movie.tagline && (
                            <p className="text-xl text-gray-300 italic mb-4">
                                {movie.tagline}
                            </p>
                        )}

                        <div className="flex items-center gap-6 text-white mb-6">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                <span className="font-semibold">{movie.vote_average}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5"/>
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                        </div>

                        {movie.runtime && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5"/>
                                <span>{movie.runtime}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mb-6">
                        {currentUserId && (
                            <>
                                <Button variant={isInWatchlist ? "secondary": "default"}
                                onClick={()=>{
                                    if (isInWatchlist) {
                                        removeFromWatchlist.mutate({userId: currentUserId, movieId})
                                    } else {
                                        addToWatchlist.mutate({userId: currentUserId,movieId})
                                    }
                                }}
                                >

                                {isInWatchlist ? <Check className="w-5 h-5 mr-2"/>  : <Plus className="w-5 h-5 mr-2"/>}
                                {isInWatchlist ? 'In watchlist': 'Add to watchlist'}
                                </Button>

                                <Button 
                                    variant={isWatched ? 'secondary': 'outline'}
                                    onClick={()=> addToWatched.mutate({userId: currentUserId, movieId})}
                                    disabled={isWatched}
                                >
                                    <Eye className="w-5 h-5 mr-2"/>
                                    {isWatched ? 'Watched': 'Mark as Watched'}
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {movie.genre?.map((genre: any)=> {
                            <span key={genre.id} className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm text-white">
                                {genre.name}
                            </span>
                        })}
                    </div>



                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-4xl mb-12">
                            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                {movie.overview}
                            </p> 
                        </div>

                        {recommendations && recommendations.length > 0 && (
                            <section>
                                <MovieGrid movies={recommendations} title="You Might Also Like"/>
                            </section>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    )
}