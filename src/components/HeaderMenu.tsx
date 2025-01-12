'use client'

import { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // gunakan next/navigation untuk Next.js 13+

interface HeaderMenuInterface {
    content: string;
    action?: string | (() => void); // action bisa string atau function
    subMenus?: HeaderMenuInterface[];
    children?: ReactNode;
}

export default function HeaderMenuComponent({ 
    content, 
    action, 
    subMenus, 
    children 
}: HeaderMenuInterface) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        if (!action) return;

        if (typeof action === 'string') {
            router.push(action);
        } else {
            action();
        }
    };

    return (
        <>
            <div className="-mx-3 lg:relative">
                <button 
                    type="button" 
                    className="lg:flex lg:items-center lg:gap-x-1 lg:text-sm/6 lg:font-semibold lg:text-gray-900 flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50" 
                    aria-controls="disclosure-1" 
                    aria-expanded="false"
                    onClick={() => {
                        if (subMenus) {
                            setOpen(!open);
                        } else {
                            handleClick();
                        }
                    }}
                >
                    {content}

                    <svg 
                        className={`size-5 flex-none text-gray-400 ${subMenus ? "" : "hidden"}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor" 
                        aria-hidden="true" 
                        data-slot="icon"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                </button>
                <div className={`lg:absolute lg:-left-8 lg:top-full lg:z-10 lg:mt-3 lg:w-screen lg:max-w-md lg:overflow-hidden lg:flex-auto lg:pl-16 pl-8 ${open ? "" : "hidden"}`}>
                    {children}
                    {subMenus?.map((item, index) => (
                        <HeaderMenuComponent key={index} {...item} />
                    ))}
                </div>
            </div>
        </>
    );
}
