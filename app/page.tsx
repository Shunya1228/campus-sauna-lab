import './globals.css'
import Top from "../components/Top";
import { UniversityProvider } from "../components/UniversityContext";

export default async function Index() {

  return (
    <div>
        <main className="flex-grow">
        <Top />
        </main>
    </div>
  )
}
