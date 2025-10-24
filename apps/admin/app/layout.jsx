
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{fontFamily:'Inter, system-ui, Arial'}}>
        <main style={{maxWidth:960, margin:'40px auto', padding:'0 20px'}}>
          {children}
        </main>
      </body>
    </html>
  );
}
