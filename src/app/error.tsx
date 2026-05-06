'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="flex justify-center">
          <div className="p-4 bg-red-50 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Nimadir noto'g'ri ketdi
          </h1>
          <p className="text-gray-600">
            Tizimda kutilmagan xatolik yuz berdi. Biz buni allaqachon qayd etdik va bartaraf etish ustida ishlayapmiz.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            onClick={() => reset()}
            variant="default"
            className="rounded-full px-8 py-6 bg-dark-blue hover:bg-blue-900 transition-all flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Qayta urinish
          </Button>
          
          <Button 
            variant="outline"
            className="rounded-full px-8 py-6 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Bosh sahifa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
