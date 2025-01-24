'use client'

import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface HeaderComponentProps {
    className?: string;
    children?: ReactNode,
    showWriteButton?: boolean,
}

export default function HeaderComponent(
    value: HeaderComponentProps
) {
    const { user, loading } = useAuth();

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
                        {value.showWriteButton ? <></> : <div className='hidden md:block pl-8'>
                            <div className=' flex flex-row gap-4'>
                                <a className='color-foreground' href='/'>
                                    Home
                                </a>
                                <a className='color-foreground' href='/timeline'>
                                    Timeline
                                </a>
                            </div>

                        </div>}
                    </div>

                    <div></div>
                    {!loading ? <div className="flex items-center flex-row space-x-2">
                        {value.showWriteButton == true && user ? <a
                            href="/form"
                            rel="noopener noreferrer"
                            className='rounded-lg border border-solid border-transparent flex items-center justify-center text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 gap-2'>
                            <img src="/icons/lucide/notebook-pen.svg" alt="Icon" width={20} height={20} />
                            Write
                        </a> : null}
                        {user ? (
                            <div className="flex items-center justify-between w-full">
                                {/* <span className="text-gray-700 font-medium pr-4">
                                    {userData.name || userData.email?.split('@')[0]}
                                </span> */}
                                <div className='h-8 w-8 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] flex items-center justify-center text-sm font-semibold transition-colors duration-200 cursor-pointer'>
                                    {((user.displayName || user.email) ?? 'U')[0].toUpperCase()}
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
                    </div> : <></>}



                </nav>
            </header>

        </>
    );
}