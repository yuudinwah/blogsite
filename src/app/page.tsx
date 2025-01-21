'use client'

import { useUser } from '@/context/UserContext';
// import { headers } from 'next/headers';
import Image from 'next/image';
// import { notFound } from 'next/navigation';

// Fungsi untuk validasi domain
// async function validateDomain() {
//   const headersList = headers();
//   const domain = (await headersList).get('host');
//   // Daftar domain yang diizinkan
//   const allowedDomains = ['localhost:3000', 'yourdomain.com'];

//   return allowedDomains.includes(domain || '');
// }

// Metadata generator (opsional)
// export async function generateMetadata() {

//   // Fetch data
//   const data = await fetchData();

//   return {
//     title: `My Blog`,
//     description: 'Main page'
//   };
// }

// Main component
export default function LandingPage() {
    const { userData } = useUser();
    // Validasi domain
  // if (!validateDomain()) {
  //   notFound(); // atau redirect ke halaman error
  // }
  // // Fetch data
  // const datas = await fetchData();

  return (
    <>
      <div className='bg-white justify-center flex flex-row h-screen w-full'>
        <div className="flex flex-col max-w-3xl w-full h-full">
          <div className='w-full h-full flex flex-row justify-between'>
            <div className='flex flex-col justify-center w-full md:w-1/2 h-full px-4'>
              <div className='text-4xl md:text-6xl py-4'>
                Share your passions
              </div>
              <div className='text-sm md:text-base py-4'>
                Create your own blog sites
              </div>
              <div className="flex items-center flex-row py-4">
                <a
                  className="rounded-lg border border-solid border-transparent 
                          transition-colors flex items-center justify-center 
                          bg-foreground text-background hover:bg-[#383838] 
                          dark:hover:bg-[#ccc] text-sm sm:text-base 
                          h-10 sm:h-12 px-4 sm:px-5"
                  href="/auth/signin"
                  // target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Now
                </a>
              </div>
            </div>

            <div className='hidden md:flex md:w-1/2 h-full justify-center items-center'>
              <Image
                src={"/landing-01.png"}
                height={360}
                width={360}
                alt='Landing Image preview'
                className='w-auto h-auto'
              />
            </div>
          </div>

          <div className='h-20 border-t-2 flex flex-row justify-center items-center gap-4 --font-merriweather'>
            <a href="#" className="text-md text-gray-900">Help</a>
            <a href="#" className="text-md text-gray-900">About</a>
            <a href="#" className="text-md text-gray-900">Privacy</a>
            <a href="#" className="text-md text-gray-900">Terms</a>
            <a href="#" className="text-md text-gray-900">Teams</a>
            <a href="#" className="text-md text-gray-900">Status</a>
          </div>
        </div>
      </div>
    </>
  );
}

// Fungsi untuk fetch data
// async function fetchData(): Promise<BlogPost[]> {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`);
//     const data = await response.json();
//     return data.data;
//   } catch (error) {
//     console.error('Error fetching content:', error);
//     return []; // Return empty array on error
//   }
// }