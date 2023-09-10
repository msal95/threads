import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

export const metaData = {
    title: "Threads",
    description: "A Next.Js 13 Meta Threads Application"
}

const inter = Inter({subsets: ["latin"]})

export default function RootLayout({children}:{children: React.ReactNode}){
    return(
        <ClerkProvider>
            <html lang='en'>
                <body className={inter.className}>

                </body>
            </html>
        </ClerkProvider>
    )
}