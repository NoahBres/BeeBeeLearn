import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen p-0 bg-yellow-200 ">
      <div className="flex flex-row items-center">
        <h1 className="text-5xl font-extrabold tracking-wide">BeeBeeLearn</h1>
        <img src="/bee-outline.svg" alt="BeeBee" className="w-16 h-16 ml-3" />
      </div>
      <div>
        <Link href="/student">
          <a>Student Home</a>
        </Link>
      </div>
    </main>
  );
}
