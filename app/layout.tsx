export const metadata = {
  title: "PokePeak Produkt-Chat",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#f7f7f8",
          color: "#111",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
          <h1 style={{ fontSize: 20, marginBottom: 24 }}>
            <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
              PokePeak — Produkt-Chat
            </a>
          </h1>
          {children}
        </div>
      </body>
    </html>
  );
}
