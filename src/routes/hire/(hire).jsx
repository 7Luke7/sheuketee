import { Footer } from "~/Components/Footer"
import { Header } from "~/Components/Header"
import { Hiring } from "~/Components/hirer-guide/Hiring"
import { InterviewWorker } from "~/Components/hirer-guide/InterviewWorker"
import { NewPost } from "~/Components/hirer-guide/NewPost"
import { PayWorker } from "~/Components/hirer-guide/PayWorker"

const Hire = () => {
    return <div>
        <Header></Header>
        <div class="w-[90%] mx-auto">
            <NewPost></NewPost>
            <Hiring></Hiring>
            <InterviewWorker></InterviewWorker>
            <PayWorker></PayWorker>
            <Footer></Footer>
        </div>
    </div>
}

export default Hire