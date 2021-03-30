import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full min-h-screen p-0 flex flex-col items-center justify-center bg-yellow-200 ">
      <div className="flex flex-row items-center">
        <h1 className="text-5xl font-extrabold tracking-wide">BeeBeeLearn</h1>
        <img src="/bee-outline.svg" alt="BeeBee" className="ml-3 w-16 h-16" />
      </div>
      <div>
        <Link href="/student">
          <a>Student Home</a>
        </Link>
      </div>
    </main>
  );
}
