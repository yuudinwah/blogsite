'use client'

import { useState } from 'react';
import HeaderMenu from './HeaderMenu';
import HeaderMenuComponent from './HeaderMenu';

interface HeaderComponentProps {
    className?: string; // Tambahkan interface untuk props
}
import Image from 'next/image';

export default function HeaderComponent(
    value: HeaderComponentProps
) {
    return (
        <>
            <header className={"fixed bg-white shadow-lg fixed w-screen h-20 z-10" + (value.className ?? "")}>
                <nav className="mx-auto flex max-w-3xl items-center justify-between py-4" aria-label="Global">
                    <div className="flex items-center flex-row">
                        <a href="/" className="-m-1.5 p-1.5">
                            <Image className="dark:invert" src="/icon-192.png" alt="logo" width={50} height={50} priority />
                        </a>
                        <a href="/" className='-m-1.5 p-1.5 text-lg font-bold pl-4'>
                            BlogSite
                        </a>
                    </div>
                    <div className="flex items-center flex-row ">
                        <a
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                            href="/form"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Create
                        </a>
                    </div>

                </nav>
            </header>

        </>
    );
}