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
    const [open, setOpen] = useState(false);
    return (
        <>
            <header className={"fixed bg-white shadow-lg fixed w-screen h-20 z-10" + (value.className ?? "")}>
                <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="/" className="-m-1.5 p-1.5">
                            My Blog
                        </a>
                    </div>
                    <div className={"flex "}>
                        <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" onClick={() => setOpen(!open)}>
                            <span className="sr-only">Open main menu</span>
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                    
                </nav>
                <div className={`${open ? '' : 'hidden'}`} role="dialog" aria-modal="true">
                    <div className="fixed inset-0 z-10"></div>
                    <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <Image className="dark:invert" src="/icon-192.png" alt="logo" width={50} height={50} priority />
                                {/* <Image src="/icon-192.png" alt='logo'></Image> */}
                            </a>
                            <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setOpen(!open)}>
                                <span className="sr-only">Close menu</span>
                                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {/* <HeaderMenuComponent content={"Product"} subMenus={[{ content: "Analitics" }, { content: "Engagement" }]} key={0} />
                                    <HeaderMenuComponent content={"Features"} key={1} />
                                    <HeaderMenuComponent content={"Marketplace"} key={2} />
                                    <HeaderMenuComponent content={"Company"} key={3} /> */}
                                </div>
                                <div className="py-6">
                                    <HeaderMenuComponent content={"Log in"} key={3} action='/dashboard' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

        </>
    );
}