import { Link } from "react-router-dom";

const NoPage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg mb-4">Page not found</p>
        <Link to="/" className="text-green-600 font-medium">Go Home</Link>
    </div>
);

export default NoPage;