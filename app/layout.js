export const metadata = {
  title: 'Menning er skattstofn — Reiknivél',
  description: 'Reiknivél sem sýnir skattspor tónlistarviðburða og endurgreiðslu-margfaldarann.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="is">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
