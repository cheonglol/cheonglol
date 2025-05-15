import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "../LandingePage.module.css";
import { shuffleArray } from "../../../utils";

const cyclingTextPhrases = [
  "loves felines (+other animals, but felines are the best)",
  "enjoys simple meals, like chicken rice",
  "plays Street Fighter",
  "writes code with taste",
  "streams games for fun, not fame",
  "collects dark humor memes like rare artifacts",
  "values freedom, focus, and flexibility",
  "building a startup solo, on purpose",
  "designs tools that feel like shortcuts",
  "turns chaos into working software",
  "works fast, ships often, learns in public",
  "thinking in systems, speaking in stories",
  "turning small bets into strong leverage",
  "writes code like casting spells",
  "not here to build hype — here to build use",
  "sees feedback as data, not judgment",
  "making digital products with soul",
  "stacks late nights into long-term skill",
  "more into questions than assumptions",
  "building in the open, owning every commit",
  "writes interfaces that speak human",
  "choosing craft over clout, always",
  "deploying tools for outsiders like me",
  "obsessed with design that disappears",
  "optimizing for clarity, not complexity",
  "treating code like a second language",
];

const CYCLING_TEXT_INTERVAL_MS = 3000;

const whatIDoCards = [
  {
    title: "AI Chatbot Development",
    description:
      "Builds AI chatbots for businesses to automate customer engagement and capture leads.",
    bg: "bg-gradient-to-r from-blue-900 to-blue-700",
  },
  {
    title: "Pitch Deck Creation",
    description: "Creates compelling pitch decks for startups and SMEs to communicate their value.",
    bg: "bg-gradient-to-r from-purple-900 to-pink-800",
  },
  {
    title: "Digital Transformation Consulting",
    description:
      "Helps businesses identify and implement digital solutions for growth and retention.",
    bg: "bg-gradient-to-r from-green-900 to-green-700",
  },
  {
    title: "Customer Retention Strategy",
    description: "Analyzes customer base and crafts strategies to improve retention and loyalty.",
    bg: "bg-gradient-to-r from-yellow-900 to-orange-700",
  },
];

const WHAT_I_DO_SLIDE_INTERVAL_MS = 3500;

const LandingWhoAmI = () => {
  const [cyclingTextIndex, setCyclingTextIndex] = useState(0);
  const [shuffledPhrases, setShuffledPhrases] = useState(() => shuffleArray(cyclingTextPhrases));
  const currentIndexRef = useRef(0);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const cyclingTextInterval = setInterval(() => {
      currentIndexRef.current += 1;
      if (currentIndexRef.current >= shuffledPhrases.length) {
        const newShuffle = shuffleArray(cyclingTextPhrases);
        setShuffledPhrases(newShuffle);
        currentIndexRef.current = 0;
        setCyclingTextIndex(0);
      } else {
        setCyclingTextIndex(currentIndexRef.current);
      }
    }, CYCLING_TEXT_INTERVAL_MS);
    return () => clearInterval(cyclingTextInterval);
  }, [shuffledPhrases.length]);

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setSliderIndex((idx) => (idx + 1) % whatIDoCards.length);
    }, WHAT_I_DO_SLIDE_INTERVAL_MS);
    return () => clearInterval(sliderInterval);
  }, []);

  return (
    <div className="relative h-screen snap-always snap-start flex flex-col items-center mr-4">
      <div className="pt-[20vh] pb-8 w-full max-w-4xl px-4">
        <h1 className="font-DM_Mono mb-4 text-5xl">whoami?</h1>
        <div className="text-xl mb-6">
          I&apos;m someone who <br />
          <span
            className={
              styles["cycling-text"] +
              " bg-blue-700 text-white px-2 py-1 font-DM_Mono font-bold mt-4 block w-fit rounded-lg"
            }
            style={{ display: "inline-block", minWidth: 120 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={shuffledPhrases[cyclingTextIndex]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                style={{ display: "inline-block" }}
              >
                {shuffledPhrases[cyclingTextIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        {/* What I Do Slider */}
        <p className="font-bold italic font-DM_Mono mt-10 mb-4 text-2xl">whatido?</p>
        <AnimatePresence mode="wait">
          <motion.section
            key={whatIDoCards[sliderIndex].title}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className={`
              flex flex-col justify-center items-start mr-4 
              ${whatIDoCards[sliderIndex].bg}
              transition-all duration-300 shadow-2xl rounded-2xl
              w-full max-w-[95vw] min-w-[80vw] min-h-[30vh]
              sm:max-w-[26rem] sm:min-w-[21.25rem] sm:min-h-[40vh]
              md:max-w-[56.25rem] md:min-w-[37.5rem] md:min-h-[45vh]
              p-4 sm:p-8
            `}
            style={{
              color: "white",
              overflow: "hidden",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              boxShadow: "0 0.5rem 2rem rgba(0,0,0,0.25)",
            }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 px-2 md:px-4">
              {whatIDoCards[sliderIndex].title}
            </h2>
            <div className="text-base sm:text-lg md:text-xl leading-relaxed md:leading-loose px-2 md:px-4">
              {whatIDoCards[sliderIndex].description}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingWhoAmI;
