'use client'

import { dateFormat } from '@/utils/dateExtension';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('Public');
  const [tabs, setTabs] = useState<string[]>(['+', 'Public', 'Following']);
  const [posts, setposts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log("fetch data==============")
        const result = await fetchData({ tag: activeTab });
        setposts(result);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  return (
    <>
      <div className='bg-white justify-center flex flex-row h-screen w-full'>
        <div className="flex flex-col max-w-3xl w-full p-20">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200
                ${activeTab === tab
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  {tab}
                </button>
              ))}
            </nav>

          </div>
          <div className='py-4'>
            {posts.map((post, index) => {
              return <div className="py-8 border-b border-gray-200" key={index}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-2">
                      {dateFormat((new Date(post.createdAt)), "MMMM dd, yyyy")} - {post.meta.readingTime} menit baca
                    </p>
                    <a
                      className="text-xl font-bold text-gray-600 mb-8"
                      href={`/detail/${post.id}`}
                    >
                      {post.title}
                    </a>
                    <p className="text-gray-600 my-4">
                      viewer : {post.clickTimes}, likes : {post.likes}
                    </p>
                  </div>

                  {/* More Menu Button */}
                  <div className="relative">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg"
                     
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>

                    
                  </div>
                </div>
              </div>
            })}
          </div>
        </div>
      </div>
    </>
  );
}

async function fetchData({ tag }: { tag?: string }): Promise<BlogPost[]> {
  try {
    const response = await fetch(`/api/blog?tag=${tag}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching content:', error);
    return []; // Return empty array on error
  }
}
