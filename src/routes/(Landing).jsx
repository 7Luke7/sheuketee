import { Footer } from "~/Components/Footer"
import { Header } from "~/Components/Header"
import { SecondHero } from "~/Components/Hero_Second"
import { Hero } from "~/Components/Hero_Section"
import { ThirdHero } from "~/Components/Third_Hero"

const Landing = () => {
    return <>
        <Header></Header>
        <div class="w-[90%] m-auto">
            <Hero></Hero>
            <div class="flex flex-col items-center">
                <SecondHero></SecondHero>
                <ThirdHero></ThirdHero>
            </div>
            <Footer></Footer>
        </div>
    </>
}

export default Landing