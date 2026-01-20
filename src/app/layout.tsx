import './globals.css'

export const metadata = {
  title: '命理终端 - AI 八字算命',
  description: '使用 AI 和八字命理分析你的人生运势',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-text selection:bg-primary selection:text-black">{children}</body>
    </html>
  )
}
