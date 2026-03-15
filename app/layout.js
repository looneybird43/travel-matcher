export const metadata = {
  title: "Travel Matchmaker — Find Your Next Trip",
  description: "Answer 6 questions. Get 3 trips you'd never have found on your own.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0e0a07" }}>
        {children}
      </body>
    </html>
  );
}
