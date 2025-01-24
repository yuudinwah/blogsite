'use client'

import { useUser } from '@/context/UserContext';
import Head from 'next/head';
// import { headers } from 'next/headers';
import Image from 'next/image';
import DashboardPage from '../dashboard/page';
// import { notFound } from 'next/navigation';

// Main component
export default function LandingPage() {
    return DashboardPage();

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