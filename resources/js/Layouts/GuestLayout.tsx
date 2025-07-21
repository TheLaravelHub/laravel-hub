import { Link } from '@inertiajs/react'
import { PropsWithChildren } from 'react'
import Image from '@/components/image'

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-background pt-6 sm:justify-center sm:pt-0">
            <div className="mt-6">
                <Link href="/">
                    <Image
                        src="/assets/images/logo.png"
                        alt="Laravel Hub"
                        width={150}
                    />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden rounded-lg bg-card px-6 py-8 shadow-md sm:max-w-md">
                {children}
            </div>
        </div>
    )
}
