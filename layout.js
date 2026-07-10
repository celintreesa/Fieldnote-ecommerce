export const metadata = {
  title: "Fieldnote — Paper, ink, and things worth keeping",
  description: "A stationery e-commerce demo built with Next.js and React.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
