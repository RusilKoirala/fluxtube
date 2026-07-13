'use client'

import { useIsFollowing, useFollowerUser, useUnfollowUser } from "@/hooks/useFollow"
import { cn } from "@/lib/utils";
import { UserCheck, UserPlus } from "lucide-react";

interface FollowButtonProps {
    followerId : number;
    followingId: number;
    className?: string;
}


export function FollowButton({followerId, followingId, className}: FollowButtonProps) { 
    const { data: isFollowing = false} = useIsFollowing(followerId, followingId);
    const followUser = useFollowerUser();
    const unfollowUser = useUnfollowUser();


    const handleClick = () => {
        if (isFollowing) {
            unfollowUser.mutate({ 
                followerId, followingId
            })
        }
        else {
            followUser.mutate({
                followerId, followingId
            })
        }
    };


    return (
       <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 px-6 py-2.5 rounded text-sm font-medium uppercase tracking-wider transition-all',
        isFollowing
          ? 'bg-white/10 hover:bg-white/20 text-white'
          : 'bg-[#E50914] hover:bg-[#E50914]/90 text-white',
        className
      )}
    >
        {isFollowing ? (
            <>
            <UserCheck className="w-4 h-4"/>
            <span>Following</span>
            </>
        ): (
            <> 
            <UserPlus className='w-4 h-4'/>
            <span>Follow</span>
            </>
        )}
    </button>
    )
}