'use client'

import { UserProfile } from "@/types/user"
import { Film, List, Clock, Star} from 'lucide-react';
import Image from "next/image";

export function UserProfileCard({ user} : { user: UserProfile}) {
    return (
        <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-start gap-6">

                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-800">
                    { user.avatarUrl ? (
                        <Image src={user.avatarUrl} alt={user.username} fill className="object-cover"/>
                    ): (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                            {user.username[0].toUpperCase()}
                        </div>
                    )}
                </div>


                <div className="flex-1">
                    <h1 className="text-3xl font-bond text-white">{user.username}</h1>
                    <p className="text-gray-400 mt-1">{user.email}</p>

                    {user.bio && (
                        <p className="text-gray-300 mt-3">{user.bio}</p>
                    )}

                    <div className="flex gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <List className="w-5 h-5 text-blue-500"/>
                            <div>
                                <p className="text-2xl font-bold text-white">{user.watchlistCount}</p>
                                <p className="text-sm text-gray-400">Watchlist</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-500"/>
                            <div>
                                <p className="text-2xl font-bold text-white">{user.reviewCount}</p>
                                <p className="text-sm text-gray-400">Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}