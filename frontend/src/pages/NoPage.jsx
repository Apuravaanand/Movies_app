import { Link } from "react-router-dom";

const NoPage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">

        <img
            src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif"
            alt="404 animation"
            className="w-full max-w-md h-64 object-cover rounded-lg shadow-md mb-6"
        />

        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-lg mb-4 text-gray-600">Page not found</p>

        <Link
            to="/"
            className="text-green-600 font-medium hover:underline"
        >
            Go Home
        </Link>
    </div>
);

export default NoPage;