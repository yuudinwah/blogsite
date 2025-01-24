'use client'

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                {/* Header */}
                <div className="text-center">
                    <h2 className="mt-2 text-xl font-bold text-gray-900">
                        Create account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please fill in your information
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="fullName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700"
                            >
                                Gender
                            </label>
                            <div className="mt-2 space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        className="form-radio h-4 w-4 text-indigo-600"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Male</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        className="form-radio h-4 w-4 text-indigo-600"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Female</span>
                                </label>
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label
                                htmlFor="dateOfBirth"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Date of Birth
                            </label>
                            <div className="mt-1">
                                <input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="terms"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            I agree to the{' '}
                            <a href="#"
                                className="font-medium text-foreground hover:text-[#383838]"
                            >
                                Terms and Conditions
                            </a>
                        </label>
                    </div>

                    {/* Sign Up Button */}
                    <div>
                        <button
                            type="submit"
                            className="rounded-lg border border-solid border-transparent 
                          transition-colors flex items-center justify-center 
                          bg-foreground text-background hover:bg-[#383838] 
                          dark:hover:bg-[#ccc] text-sm sm:text-base 
                          h-10 sm:h-12 px-4 sm:px-5 w-full">
                            Sign up
                        </button>
                    </div>
                </form>

                {/* Sign In Link */}
                <div className="text-center text-sm">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <a
                            href="./signin"
                            className="font-medium text-foreground hover:text-[#383838]"
                        >
                            Sign in
                        </a>
                    </p>
                </div>

                {/* <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Or sign up with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div>
                            <button
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Sign up with Google</span>
                                Google
                            </button>
                        </div>

                        <div>
                            <button
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Sign up with Facebook</span>
                                Facebook
                            </button>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};