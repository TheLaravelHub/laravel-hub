import React from 'react'
import { toast, Toaster as SonnerToaster } from 'sonner'

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

// Custom compact toast component
export const CustomToast = {
    success: (message: string, options?: any) => {
        toast.custom(
            (t) => (
                <div className="flex max-w-sm items-center rounded-md border border-border bg-white p-3 shadow-lg">
                    <div className="mr-3 flex-shrink-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-4 text-green-500"
                        >
                            <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
                            <path
                                fillRule="evenodd"
                                d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                        {message}
                    </div>
                </div>
            ),
            { duration: 4000, position: 'top-right', ...options },
        )
    },

    error: (message: string, options?: any) => {
        toast.custom(
            (t) => (
                <div className="flex max-w-sm items-center rounded-md border border-border bg-white p-3 shadow-lg">
                    <div className="mr-3 flex-shrink-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-4 text-red-500"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                        {message}
                    </div>
                </div>
            ),
            { duration: 4000, position: 'top-right', ...options },
        )
    },

    info: (message: string, options?: any) => {
        toast.custom(
            (t) => (
                <div className="flex max-w-sm items-center rounded-md border border-border bg-white p-3 shadow-lg">
                    <div className="mr-3 flex-shrink-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-4 text-blue-500"
                        >
                            <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                        {message}
                    </div>
                </div>
            ),
            { duration: 4000, position: 'top-right', ...options },
        )
    },
}

// Custom Toaster component with proper height
export const CustomToaster = ({ ...props }: ToasterProps) => {
    return (
        <SonnerToaster
            position="top-right"
            expand={false}
            closeButton
            {...props}
        />
    )
}
