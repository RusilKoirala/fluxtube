'use client'

import { use } from "react"
import { Header } from "@/components/Header"
import { UserProfileCard } from "@/components/UserProfileCard"
import { useUser } from "@/hooks/useUser"

export default function ProfilePage({ params}: {params: Promise<{id: string}>}) {
    const { id } = use(params);
    const userId = parseInt(id);

    const { data: user, isLoading} = useUser(userId);

    return (
        <div className="min-h-screen bg-black">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Loading profile...</p>
                    </div>
                ): user ? (
                    <UserProfileCard user={user} />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400">User not found</p>
                    </div>
                )}
            </main>
        </div>
    )
}