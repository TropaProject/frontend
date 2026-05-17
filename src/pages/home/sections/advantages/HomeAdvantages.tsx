// pages/home/sections/advantages/HomeAdvantages.tsx

import HomeH2 from "@/pages/home/components/HomeH2"
import HomeAdvantagesRoadBg from "@/pages/home/sections/advantages/assets/backgrounds/HomeAdvantagesRoadBg"
import AdvantagesNumbers from "@/pages/home/sections/advantages/components/AdvantagesCards"
import ComparisonCards from "@/pages/home/sections/advantages/components/ComparisonCards"



const HomeAdvantages = (props: React.HTMLAttributes<HTMLElement>) => {
    return (
        <section id={props.id} className={`${props.className} flex flex-col w-full relative mb-24 desktop:mb-56`}>
            <div className="flex flex-col w-full z-10 desktop:px-10">
                <div className="relative flex flex-col w-full gap-5 z-10">
                    <HomeH2 className="z-10 items-center text-center">
                        Мой сервис лучше <br />
                        и вот почему
                    </HomeH2>
                </div>

                <AdvantagesNumbers />

                <ComparisonCards />
            </div>

            <HomeAdvantagesRoadBg className="absolute left-0 -bottom-1/7 z-0 desktop:flex hidden" />
        </section>
    )
}

export default HomeAdvantages