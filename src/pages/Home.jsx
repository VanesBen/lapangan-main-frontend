import HeroImg from "../assets/image/Hero.png"
import Button from "../components/atomic/Button"

export default function Home() {
    return (
        <>
            <section id="Hero" className="relative " >
                <img className="w-full h-[450px] md:h-auto object-cover" src={HeroImg} alt="" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                    <h1 className="text-3xl text-primary font-extrabold">SAATNYA TURUN KE LAPANGAN</h1>
                    <p className="text-[15pt]">Cari lokasi terdekat, kunci slot waktumu, dan siap main tanpa ribet.</p>
                    <Button title={"Cari Lapangan"}/>
                </div>
            </section>
        </>
    )
}