// import HomeH2 from "@/pages/home/components/HomeH2"
// import HomeReviewsDove from "@/pages/home/sections/reviews/assets/images/home-reviews-dove.png"
// import HomeReviewsSinglePhoto from "@/pages/home/sections/reviews/assets/images/home-review-single-photo.png"
// import ReviewsBg from "@/pages/home/sections/reviews/assets/backgrounds/ReviewsBg"
// import { ReviewCard } from "@/shared/components/ui/cards/ReviewCard"
// import { mockReviewsData } from "@/entities/review/model/mock"
// import HomeReviewsDoveThoughts from "@/pages/home/sections/reviews/assets/visual/HomeReviewsDoveThoughts"
// import FloatingDove from "@/shared/assets/doves/FloatingDove"
// import ReviewsRoadBg from "@/pages/home/sections/reviews/assets/backgrounds/ReviewsRoadBg"
// import HomeReviewsFeather from "@/pages/home/sections/reviews/assets/visual/HomeReviewsFeather"
// import { BorderWrapper } from "@/shared/components/wrappers/BorderWrapper"
// import HomeReviewsSinglePhotoBorder from "@/pages/home/sections/reviews/assets/borders/HomeReviewsSinglePhotoBorder"
// import StoryReviewBg1 from "@/pages/home/sections/reviews/assets/images/story-review-bg-1.jpg"
// import StoryReviewBg2 from "@/pages/home/sections/reviews/assets/images/story-review-bg-2.jpg"
// import ReviewsBgVisuals from "@/pages/home/sections/reviews/assets/visual/ReviewsBgVisuals"
// import ReviewsBgClouds from "@/pages/home/sections/reviews/assets/backgrounds/ReviewsBgClouds"
// import ReviewsStepPath from "@/pages/home/sections/reviews/assets/visual/ReviewsStepPath"
// import { motion } from "framer-motion"
// import { ReviewAnimationWrapper } from "@/pages/home/sections/reviews/ui/ReviewAnimationWrapper"

// const HomeReviews = (props: React.HTMLAttributes<HTMLElement>) => {
//     return (
//         <section className={`${props.className} px-2.5 desktop:px-10 mt-20 w-full flex flex-col gap-10 items-center pb-48 relative desktop:mt-50`}>
//             <div className="relative flex flex-col w-full z-20">
//                 <div className="w-full desktop:max-w-max flex flex-col relative gap-2.5 pr-24 desktop:pr-0">
//                     <HomeH2 className="w-full max-w-max text-secondary">
//                         Вот они! <br />
//                         Герои нашего времени
//                     </HomeH2>

//                     <FloatingDove
//                         className="-right-2.5 bottom-0 desktop:-right-1/2 max-w-max h-full"
//                         thoughts={<HomeReviewsDoveThoughts />}
//                         thoughtsClassName="-top-16 -left-28 xs:-top-4 xs:-left-36 max-w-40 desktop:top-0 desktop:left-36"
//                         doveClassName="max-w-30 h-full desktop:max-w-55"
//                         doveSrc={HomeReviewsDove}
//                     >
//                         <HomeReviewsFeather className="absolute -left-1/3 bottom-2 desktop:top-1/3 max-w-10 desktop:max-w-20" />
//                     </FloatingDove>
//                     <div className="absolute desktop:-left-16 desktop:top-1/3 desktop:max-w-max desktop:h-full bottom-0 w-full items-center flex-col flex ">
//                     </div>
//                 </div>
//             </div>

//             <ul className="desktop:hidden flex flex-row gap-2.5 pl-2 overflow-x-scroll scrollbar-hidden overflow-y-hidden max-w-mobile mobile:max-w-[clamp(360px,100vw,1280px)] w-full self-start justify-start z-30">
//                 {mockReviewsData.map((review, idx) => (
//                     <ReviewAnimationWrapper key={review.nickName} index={idx}>
//                         <ReviewCard
//                             {...review}
//                             variant="notepad"
//                             className="max-h-max"
//                         />
//                     </ReviewAnimationWrapper>
//                 ))}
//             </ul>

//             <ul className="hidden desktop:grid grid-cols-17 grid-rows-12 gap-5 pl-2 w-full z-20">
//                 <ReviewAnimationWrapper index={0} className="col-span-5 row-span-5 w-full">
//                     <ReviewCard
//                         key={mockReviewsData[0].nickName}
//                         {...mockReviewsData[0]}
//                         variant="notepad"
//                         className="max-h-max max-w-none"
//                     />
//                 </ReviewAnimationWrapper>

//                 <ReviewAnimationWrapper index={1} className="col-span-5 row-span-4 col-start-7">
//                     <ReviewCard
//                         key={mockReviewsData[1].nickName}
//                         {...mockReviewsData[1]}
//                         variant="notepad"
//                         className="max-h-max max-w-none"
//                     />
//                 </ReviewAnimationWrapper>

//                 <ReviewAnimationWrapper index={2} className="col-span-4 row-span-5 col-start-14">
//                     <ReviewCard
//                         key={mockReviewsData[2].nickName}
//                         {...mockReviewsData[2]}
//                         variant="story"
//                         bgImage={StoryReviewBg1}
//                         description={undefined}
//                         customBorderColor="text-primary"
//                         className="max-h-max *:h-full max-w-none h-full"
//                     />
//                 </ReviewAnimationWrapper>

//                 <ReviewAnimationWrapper index={3} className="flex col-span-4 row-span-4 col-start-7 row-start-5 relative p-1 max-h-60 max-w-60 w-full h-full aspect-square">
//                     <img src={HomeReviewsSinglePhoto} alt="" className="aspect-square object-contain rounded-full" />
//                     <BorderWrapper borderComponent={HomeReviewsSinglePhotoBorder} />
//                 </ReviewAnimationWrapper>

//                 <ReviewAnimationWrapper index={4} className="col-span-5 row-span-4 col-start-4 row-start-9">
//                     <ReviewCard
//                         key={mockReviewsData[3].nickName}
//                         {...mockReviewsData[3]}
//                         variant="notepad"
//                         className="max-h-max max-w-none"
//                     />
//                 </ReviewAnimationWrapper>

//                 <ReviewAnimationWrapper index={5} className="col-span-5 row-span-5 col-start-11 row-start-8">
//                     <ReviewCard
//                         key={mockReviewsData[4].nickName}
//                         {...mockReviewsData[4]}
//                         variant="notepad"
//                         className="max-h-max max-w-none"
//                     />
//                 </ReviewAnimationWrapper>
//             </ul>

//             <ul className="hidden desktop:grid grid-cols-14 grid-rows-5 gap-5 pl-2 w-full z-20 pb-49">
//                 <ReviewAnimationWrapper index={6} className="flex col-span-3 row-span-3 relative p-1 max-h-60 max-w-60 w-full h-full aspect-square">
//                     <img src={HomeReviewsSinglePhoto} alt="" className="aspect-square object-contain rounded-full" />
//                     <BorderWrapper borderComponent={HomeReviewsSinglePhotoBorder} />
//                 </ReviewAnimationWrapper>

//                 <ReviewAnimationWrapper index={7} className="col-span-4 row-span-5 col-start-6">
//                     <ReviewCard
//                         key={mockReviewsData[2].nickName}
//                         {...mockReviewsData[2]}
//                         variant="story"
//                         bgImage={StoryReviewBg2}
//                         description={undefined}
//                         customBorderColor="text-primary"
//                         className="max-h-max h-full *:h-full text-primary max-w-none"
//                     />
//                 </ReviewAnimationWrapper>

//                 <ReviewAnimationWrapper index={8} className="col-span-4 row-span-3 col-start-11">
//                     <ReviewCard
//                         key={mockReviewsData[3].nickName}
//                         {...mockReviewsData[3]}
//                         variant="notepad"
//                         className="max-h-max max-w-none"
//                     />
//                 </ReviewAnimationWrapper>
//             </ul>

//             <ReviewsRoadBg className="absolute -top-4/17 right-0 w-full max-w-max z-10 pointer-events-none object-cover" />

//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 1, delay: 0.5 }}
//                 className="absolute -top-5/17 desktop:-top-2/17 left-0 w-full max-w-max z-10 pointer-events-none object-cover"
//             >
//                 <ReviewsStepPath className="w-full h-full" />
//             </motion.div>

//             <ReviewsBgClouds className="absolute -bottom-11 desktop:-bottom-28 mx-auto min-w-full object-cover h-max z-20" />

//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 1, delay: 1.2 }}
//                 className="absolute bottom-20 desktop:bottom-14 mx-auto mt-auto h-full max-h-max w-full min-w-full z-10 pointer-events-none object-cover"
//             >
//                 <ReviewsBgVisuals className="w-full h-full" />
//             </motion.div>

//             <ReviewsBg className="absolute bottom-0 max-h-212 mx-auto mt-auto min-w-full z-0 pointer-events-none object-cover" preserveAspectRatio="none" />
//         </section>
//     )
// }

// export default HomeReviews