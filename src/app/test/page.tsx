import React from 'react';

export default function TestPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>SSR Test Page</h1>
      <p>If you can see this, the basic Next.js 15 environment is working on Firebase.</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  );
}
