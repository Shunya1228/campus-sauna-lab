import "./globals.css";
import Top from "../components/top/Top";

export default async function Index() {
  return (
    <div>
      <main className="flex-grow">
        <Top />
      </main>
    </div>
  );
}