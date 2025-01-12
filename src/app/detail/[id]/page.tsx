import { supabase } from '@/utils/supabase';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import HeaderComponent from '@/components/Header';

// Tipe untuk props
type Props = {
    params: {
        id: string
    },
    searchParams: { [key: string]: string | string[] | undefined }
}

// Fungsi untuk validasi domain
async function validateDomain() {
    const headersList = headers();
    const domain = (await headersList).get('host');
    // Daftar domain yang diizinkan
    const allowedDomains = ['localhost:3000', 'yourdomain.com'];

    return allowedDomains.includes(domain || '');
}

// Fungsi untuk validasi ID
async function validateId(id: string) {
    // Contoh validasi ID
    const isValidId = /^\d+$/.test(id); // Contoh: ID harus berupa angka
    if (!isValidId) return false;

    // Bisa tambahkan pengecekan ke database
    try {
        // Contoh menggunakan Supabase
        const { data, error } = await supabase
            .from('blogsPages')
            .select('*')
            .eq('id', id)
            .single();

        return !!data;
    } catch {
        return false;
    }
}

// Metadata generator (opsional)
export async function generateMetadata({ params }: Props) {
    const id = (await params).id;

    // Fetch data
    const data = await fetchData(id);

    return {
        title: `${data?.title || id}`,
        description: data?.shortContent || 'Detail page'
    };
}

// Main component
export default async function DetailPage({ params }: Props) {
    const id = (await params).id;

    // Validasi domain
    if (!validateDomain()) {
        notFound(); // atau redirect ke halaman error
    }

    // Validasi ID
    const isValidId = await validateId(id);
    if (!isValidId) {
        notFound(); // atau redirect ke halaman error
    }

    // Fetch data
    const data = await fetchData(id);

    return (
        <>
            <div className="flex flex-col lg:flex-row">
                {/* Sidebar */}
                <div className="sm:hidden lg:block bg-gray-200 lg:w-80 h-auto lg:h-screen py-16 lg:py-8 lg:fixed lg:z-0 lg:drop-shadow-sm">
                    <div className="w-full p-4 gap-16 flex flex-col items-center">
                        <Image
                            className="dark:invert"
                            src="/next.svg"
                            alt="Next.js logo"
                            width={180}
                            height={38}
                            priority
                        />
                        <h1 className="text-3xl lg:text-xl font-bold mb-4">My Blog</h1>

                        <div className="flex gap-4 items-center flex-row lg:flex-col">
                            <a
                                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                                href="/form"
                            >
                                <Image
                                    className="dark:invert"
                                    src="/vercel.svg"
                                    alt="Vercel logomark"
                                    width={20}
                                    height={20}
                                />
                                Create
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-screen lg:pl-80 pt-8 items-center flex flex-col">
                    <div className="px-16 py-8 min-h-screen lg:max-w-screen-md flex flex-col">
                        <div className="py-8 pt-8">
                            <article className="py-8">
                                {data && (
                                    <div>
                                        <div dangerouslySetInnerHTML={{ __html: data.content }} />
                                    </div>
                                )}
                            </article>
                        </div>

                    </div>

                    {/* Footer */}

                    <footer className="w-full bg-gray-800 text-white">
                        <div className="flex flex-wrap justify-between px-4 py-6 max-w-7xl mx-auto">
                            <div>
                                <h2 className="py-2 font-medium">About</h2>
                                <p>
                                    Project ini dibuat untuk memenuhi Test Interview 2.
                                </p>
                            </div>
                            <div>
                                <h2 className="py-2 font-medium">Hosted by</h2>
                                <p>
                                    void
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>

            </div>
        </>
    );
}

// Fungsi untuk fetch data
async function fetchData(id: string): Promise<BlogPost> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog?id=${id}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching content:', error);
        throw error; // Return empty array on error
    }
}