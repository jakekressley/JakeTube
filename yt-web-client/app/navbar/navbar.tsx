"use client"

import Image from "next/image";
import Link from "next/link";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../utilities/firebase/firebase";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)

    // calls it once on load
    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user)
        })

        return () => unsubscribe()
    })

    return (
        <nav>
            <Link href="/">
                <Image 
                    src="/youtube-logo.svg" 
                    alt="YouTube Logo"
                    width="90"
                    height="20"
                    className="cursor-pointer flex justify-between align-center p-4"
                />
            </Link>
            { 
                // TODO: Add upload button           
            }
            <SignIn user={user}/>
        </nav>
    )
}