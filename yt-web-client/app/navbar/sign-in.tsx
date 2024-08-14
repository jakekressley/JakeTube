"use client"

import { Fragment } from "react";
import { signInWithGoogle, signOut } from "../utilities/firebase/firebase";
import { User } from "firebase/auth";

interface SignInProps {
    user: User | null
}

export default function SignIn({ user }: SignInProps) {
    return (
        <Fragment>
            {user ? 
                (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={signOut}>
                        Sign Out
                    </button>
                ) : (
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" onClick={signInWithGoogle}>
                        Sign In
                    </button>
                )
            }
        </Fragment >
    )
}