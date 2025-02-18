import Link from "next/link";

export default function Home() {
  return (
    <div className=" h-screen  w-screen  ">
      <nav className="flex  justify-between gap-2 w-full p-2 bg-gray-300">

        <div className="font-bold text-3xl " >
          My GPT
        </div>
        <div className="flex gap-2 items-center">
          <button className="flex items-center justify-center px-3 py-1 border rounded-md bg-blue-300 text-white font-serif font-bold">
            <Link href={"/login"}>Login</Link>
          </button>
          <button className="flex items-center justify-center px-3 py-1 border rounded-md bg-blue-300 text-white font-serif font-bold">
          <Link href={"/signup"}>Sign Up</Link>
          </button>
        </div>
      </nav>
    </div>
  );
}
