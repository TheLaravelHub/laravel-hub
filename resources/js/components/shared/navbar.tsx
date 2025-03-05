import { BookmarkPlus, Github, LifeBuoy } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Image from '@/components/image'
import { Link } from '@inertiajs/react'

const Navbar = () => {
    const [showNav, setShowNav] = useState(true)
    const navRef = useRef<HTMLDivElement>(null)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setShowNav(false)
            } else {
                setShowNav(true)
            }
            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])
    return (
        <header
            ref={navRef}
            className={`fixed left-0 right-0 top-0 z-50 bg-background shadow-lg transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'}`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between p-6">
                <Link
                    href={route('homepage')}
                    className="flex items-center space-x-2"
                >
                    <Image
                        src={'/assets/images/Indxs-logo.png'}
                        alt="Indxs"
                        width={150}
                    />
                </Link>
                <nav className="flex space-x-6">
                    <a
                        href="https://github.com/indxs/indxs"
                        target={'_blank'}
                        className="flex items-center space-x-2 transition-colors hover:text-primary"
                    >
                        <Github size={28} />{' '}
                        <span className={'hidden md:block'}>GitHub</span>
                    </a>
                    <a
                        href="https://github.com/sponsors/thefeqy"
                        target={'_blank'}
                        className="flex items-center space-x-2 transition-colors hover:text-primary"
                    >
                        <LifeBuoy size={28} />{' '}
                        <span className={'hidden md:block'}>Support</span>
                    </a>
                    <a
                        href="https://github.com/Indxs/indxs/discussions/new?category=package-submission"
                        target={'_blank'}
                        className="flex items-center space-x-2 transition-colors hover:text-primary"
                    >
                        <BookmarkPlus size={28} /> <span>Submit a package</span>
                    </a>
                </nav>
            </div>
        </header>
    )
}

export default Navbar
