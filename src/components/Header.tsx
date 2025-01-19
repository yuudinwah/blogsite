'use client'

interface HeaderComponentProps {
    className?: string; // Tambahkan interface untuk props
}
import Image from 'next/image';
import { useUser } from '@/context/UserContext';

export default function HeaderComponent(
    value: HeaderComponentProps
) {
    const { userData } = useUser();

    return (
        <>
            <header className={"fixed bg-white shadow-sm fixed w-screen h-20 z-10" + (value.className ?? "")}>
                <nav className="mx-auto flex max-w-3xl items-center justify-between py-4 px-4" aria-label="Global">
                    <div className="flex items-center flex-row">
                        <a href="/" className="-m-1.5 p-1.5">
                            <Image className="dark:invert" src="/icon-192.png" alt="logo" width={50} height={50} priority />
                        </a>
                        <a href="/" className='-m-1.5 p-1.5 text-lg font-bold pl-4'>
                            BlogSite
                        </a>
                    </div>
                    <div className="flex items-center flex-row space-x-2">
                        {userData ? (
                            <div className="flex items-center justify-between w-full">
                                <span className="text-gray-700 font-medium pr-4">
                                    {userData.name || userData.email?.split('@')[0]}
                                </span>
                                <div className='h-8 w-8 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] flex items-center justify-center text-sm font-semibold transition-colors duration-200 cursor-pointer'>
                                    {((userData.name || userData.email) ?? 'U')[0].toUpperCase()}
                                </div>
                            </div>
                        ) : (
                            <a
                                className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                                href="/auth/signin"
                                rel="noopener noreferrer"
                            >
                                Get Started
                            </a>
                        )}
                    </div>



                </nav>
            </header>

        </>
    );
}