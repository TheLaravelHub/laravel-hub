import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Star } from 'lucide-react'
import Navbar from '@/components/shared/navbar'
import { Head } from '@inertiajs/react'
import { Category, MetaType, Package as PackageType } from '@/types'
import { Badge } from '@/components/ui/badge'
import HeroSection from '@/components/shared/hero-section'
import Footer from '@/components/shared/footer'
import { formatNumber } from '@/lib/utils'
import { useInView } from 'react-intersection-observer'
import { BeatLoader } from 'react-spinners'
import axios from 'axios'

interface IndexProps {
    categories: { data: Category[] }
    packages: {
        data: PackageType[]
        meta: MetaType
    }
}

export default function Index({ categories, packages }: IndexProps) {
    const [packagesData, setPackagesData] = useState(packages.data)
    const packagesRef = useRef<HTMLDivElement>(null)
    const [hasMorePages, setHasMorePages] = useState<boolean>(
        packages.meta.current_page < packages.meta.last_page,
    )
    const [nextPage, setNextPage] = useState<number | null>(
        hasMorePages ? packages.meta.current_page + 1 : null,
    )
    const { ref, inView } = useInView({})

    useEffect(() => {
        if (inView && nextPage) {
            axios
                .get(route('homepage'), { params: { page: nextPage } })
                .then((response) => {
                    const data = response.data
                    setPackagesData((prevPackages) => {
                        return [...prevPackages, ...data.data]
                    })
                    setHasMorePages(
                        data.meta.current_page < data.meta.last_page,
                    )
                    if (hasMorePages) {
                        setNextPage(data.meta.current_page + 1)
                    } else {
                        setNextPage(null)
                    }
                })
                .catch((error) => console.error(error))
        }
    }, [inView])

    return (
        <>
            <Head title={'Home'} />
            <div className="relative flex min-h-screen flex-col bg-background text-gray-900">
                {/*Navbar*/}
                <Navbar />

                {/*Hero Section*/}
                <HeroSection
                    categories={categories.data}
                    packagesData={packagesData}
                    setPackagesData={setPackagesData}
                    packagesRef={packagesRef}
                />

                {/* Packages */}
                <section
                    ref={packagesRef}
                    className="max-w-8xl mx-auto grid grid-cols-1 gap-8 px-6 py-6 md:grid-cols-2"
                >
                    {packagesData.map((pkg) => (
                        <Card
                            key={pkg.id}
                            className="rounded-2xl border border-border bg-card p-6 shadow-md"
                        >
                            <CardContent className="flex flex-col items-start space-y-4 p-0 md:p-6">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src={pkg.owner_avatar as string}
                                            alt={pkg.owner}
                                            className="h-16 w-16 rounded-full"
                                        />
                                        <a
                                            href={pkg.repository_url}
                                            target={'_blank'}
                                        >
                                            <h3 className="ml-4 text-2xl font-semibold text-primary">
                                                {pkg.name}
                                            </h3>
                                        </a>
                                    </div>
                                    <div className="flex flex-col items-center justify-center space-y-1">
                                        <Star
                                            size={24}
                                            className="text-yellow-400"
                                        />
                                        <p className="text-center text-muted-foreground">
                                            {formatNumber(pkg.stars)}
                                        </p>
                                    </div>
                                </div>
                                {pkg.description && (
                                    <p className="mt-2 text-muted-foreground">
                                        {pkg.description.length > 50 ? (
                                            <>
                                                {pkg.description.substring(
                                                    0,
                                                    50,
                                                )}
                                                ...
                                            </>
                                        ) : (
                                            pkg.description
                                        )}
                                    </p>
                                )}
                            </CardContent>
                            <CardFooter>
                                {pkg.categories.map((category) => (
                                    <Badge
                                        key={category.id}
                                        variant={'outline'}
                                        className="mr-1"
                                    >
                                        {category.name}
                                    </Badge>
                                ))}
                            </CardFooter>
                        </Card>
                    ))}
                </section>
                {hasMorePages && (
                    <div className="flex w-full justify-center py-6">
                        <div
                            ref={ref}
                            className="-translate-y-16"
                        ></div>
                        <BeatLoader
                            color="#9c3af5"
                            loading={true}
                            size={16}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                )}

                {/* Footer */}
                <Footer />
            </div>
        </>
    )
}
