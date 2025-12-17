
'use client';

import { FC } from 'react';
import { Card } from './card';

interface GuaranteeBlockProps {
    dictionary: {
        title: string;
        description: string;
    }
}

const GuaranteeSeal: FC = () => (
    <div className="relative w-28 h-28 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path
                d="M 50,2 A 48,48 0 1 1 49.99,2.0001"
                fill="#2563eb"
                stroke="#1e40af"
                strokeWidth="2"
                transform="rotate(0, 50, 50)"
                pathLength="360"
            />
            <path
                id="circlePath"
                d="M 15,50 A 35,35 0 1 1 85,50 A 35,35 0 1 1 15,50"
                fill="none"
            />
            <text>
                <textPath href="#circlePath" className="text-[9px] font-bold fill-white tracking-widest" startOffset="0%" textAnchor="middle">
                    KAFOLAT • KAFOLAT • KAFOLAT • KAFOLAT • KAFOLAT • KAFOLAT
                </textPath>
            </text>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="text-2xl font-black">100%</div>
            <div className="text-xs font-bold tracking-wider">KAFOLAT</div>
        </div>
    </div>
);

const GuaranteeBlock: FC<GuaranteeBlockProps> = ({ dictionary }) => {
    if (!dictionary) return null;

    return (
        <div className="my-8">
            <Card className="max-w-2xl mx-auto bg-gray-50 border-gray-200 p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <GuaranteeSeal />
                    <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-lg sm:text-xl font-bold text-gray-800">{dictionary.title}</h4>
                        <p className="mt-1 text-sm text-gray-600">
                           {dictionary.description}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default GuaranteeBlock;

