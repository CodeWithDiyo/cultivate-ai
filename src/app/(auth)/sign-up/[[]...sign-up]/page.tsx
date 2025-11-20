import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Join Cultivate AI</h1>
          <p className="text-gray-600">Start your climate innovation journey today</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
          <SignUp 
            path="/sign-up" 
            routing="path" 
            signInUrl="/sign-in"
            appearance={{
              elements: {
                formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white transition-colors",
                footerActionLink: "text-green-600 hover:text-green-700",
                formFieldInput: "border-gray-300 focus:border-green-500 focus:ring-green-500",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
