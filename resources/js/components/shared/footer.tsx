import {Github, LifeBuoy} from "lucide-react";

const Footer = () => {
    return (
        <footer className="mt-auto rounded-t-2xl bg-gray-100 py-12 text-center shadow-xl">
            <div className="mx-auto max-w-5xl">
                <p className="text-gray-600">An open-source project by</p>
                <div className="mt-6 flex flex-col items-center">
                    <img
                        src={asset('assets/images/github-avatar.jpg')}
                        alt="Founder Avatar"
                        className="h-20 w-20 rounded-full border-4 border-gray-300 shadow-lg"
                    />
                    <h3 className="mt-3 text-2xl font-bold text-gray-900">
                        Muhammed Elfeqy
                    </h3>
                    <p className="text-gray-600">
                        Software Engineer & Open-Source Contributor
                    </p>
                    <div className="mt-5 flex space-x-6">
                        <a
                            href="https://github.com/thefeqy"
                            target={'_blank'}
                            className="transition-colors hover:text-primary"
                        >
                            <Github size={24} />
                        </a>
                        <a
                            href="https://github.com/sponsors/thefeqy"
                            target={'_blank'}
                            className="transition-colors hover:text-primary"
                        >
                            <LifeBuoy size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
