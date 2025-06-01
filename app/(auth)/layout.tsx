import React from 'react';
import "../globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <main style={{ flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}