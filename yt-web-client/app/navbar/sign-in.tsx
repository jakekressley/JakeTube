"use client"

import { Fragment } from "react";

import { signInWithGoogle, signOut } from "../utilities/firebase/firebase";

export default function SignIn() {
    return (
        <Fragment>
            <button className="--sign-in-out-button" onClick={signOut}>
                Sign Out
            </button>
            <button className="--sign-in-out-button" onClick={signInWithGoogle}>
                Sign In
            </button>
        </Fragment>
    )
}