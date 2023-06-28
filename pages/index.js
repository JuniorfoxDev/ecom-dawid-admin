import Layout from "@/components/Layout"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()
  return <Layout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        Hello, {session?.user?.email}
      </h2>
      <div className="flex bg-gray-100 gap-1 text-black rounded-lg overflow-hidden">
           <img src={session?.user?.image} alt="" className="w-8 h-8"/>
             <span className="px-2 text-center pt-1">
              {session?.user?.name}
            </span>
    </div>
    </div>
  </Layout>
}
