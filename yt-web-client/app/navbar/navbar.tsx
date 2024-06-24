import Image from "next/image";
import Link from "next/link";
import SignIn from "./sign-in";


export default function Navbar() {
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
            <SignIn />
        </nav>
    )
}