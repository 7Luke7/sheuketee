import {Categories} from "~/Components/Categories"
import { Footer } from "~/Components/Footer"
import { Header } from "~/Components/Header"
import { SecondHero } from "~/Components/Hero_Second"
import { Hero } from "~/Components/Hero_Section"
import {HirerLanding} from "~/Components/HirerLanding"
import {WorkerLanding} from "~/Components/WorkerLanding"

const Landing = () => {
    return <>
        <Header></Header>
        <div class="w-[90%] m-auto">
            <Hero></Hero>
            <div class="flex flex-col items-center">
                <SecondHero></SecondHero>
                <Categories></Categories>
                <HirerLanding></HirerLanding>
                <WorkerLanding></WorkerLanding>
            </div>
            <Footer></Footer>
        </div>
    </>
}

export default Landing