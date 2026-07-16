'use client';

import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "./FollowButton";
import { useMovieStore } from "@/store/useMovieStore";
import { Users } from "lucide-react";

interface UserCardProps {
    user: {
        id: number;
        username: string;
        avatarUrl?: string;
        bio?: string;
        followersCount?: number;
    };
}


export function UserCard({ user }: UserCardProps) {
    const currentUserId = useMovieStore((state)=> state.currentUserId);


    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
                <Link href={`/porfile/${user.id}`}>
                {user.avatarUrl ? (
                    <Image 
                    src={user.avatarUrl}
                    alt={user.username}
                    width={64}
                    height={64}
                    className="rounded-full hover:opacity-80 transition-colors"/>
                ): (
                    <div className="w-16 h-16 rounded-full bg-[#E50914] flex items-center justify-center hover:opacity-80 transition-opacity">
                        <span className="text-white font-bold text-xl">
                            {user.username[0].toUpperCase()}
                        </span>
                    </div>
                )}
                </Link>


                <div className="flex-1 min-w-0">
                    <Link href={`/profile/${user.id}`}>
                        <h3 className="text-white font-semibold text-lg hover:text-[#E50914] transition-colors truncate">
                            {user.username}
                        </h3>
                    </Link>

                    {user.bio && (
                        <p className="text-white/60 text-sm mt-1 line-clamp-2">{user.bio}</p>
                    )}

                    {user.followersCount !== undefined && (
                        <div className="flex items-center gap-1 text-white/50 text-sm mt-2">
                            <Users className="w-4 h-4"/>
                            <span>{user.followersCount} followers</span>
                        </div>
                    )}
                </div>

                {currentUserId && currentUserId !== user.id && (
                    <FollowButton 
                    followerId={currentUserId}
                    followingId={user.id}
                    className="shrink-0"
                    />
                )}
            </div>
        </div>
    )
}