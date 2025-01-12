'use client'

import { useState } from 'react';

interface FooterComponentProps {
    className?: string; // Tambahkan interface untuk props
}
import Image from 'next/image';

export default function FooterComponent(
    value: FooterComponentProps
) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <footer className={"w-full bg-gray-800 text-white p-16 " + (value.className ?? "")}>
                <div className="flex flex-col justify-between px-4 py-6 max-w-7xl mx-auto">
                    <div>
                        <h2 className="pt-8 font-medium">About</h2>
                        <p>
                            Project ini dibuat untuk memenuhi Test Interview 2.
                        </p>
                    </div>
                    <div>
                        <h2 className="pt-8 font-medium">Hosted by</h2>
                        <p>
                            void
                        </p>
                    </div>
                </div>
            </footer>

        </>
    );
}