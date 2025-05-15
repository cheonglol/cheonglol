import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BaseLayout } from "../../layouts/BaseLayout";
import { assignCollapseState } from "../../store/reducers/sideNavigation/sideNavigationSlice";
import LandingIntro from "./components/LandingIntro";
import LandingWhoAmI from "./components/LandingWhoAmI";

const LandingPage = () => {
  const dispatchRedux = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      dispatchRedux(assignCollapseState(false));
    }
  }, []);

  return (
    <BaseLayout
      contentSnap
      content={
        <div>
          <LandingIntro />
          <LandingWhoAmI />
          <AnimatePresence>
            <motion.div
              className="h-screen w-full snap-always snap-start flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <motion.h2
                className="font-DM_Mono text-5xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                What's next?
              </motion.h2>
              <motion.p
                className="text-2xl mb-10 text-center max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                Explore my blog for thoughts and tutorials, or check out my projects!
                <br />
                Or drop me a message.
              </motion.p>
              <motion.div
                className="flex gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <a
                  href="/cheonglol/blog"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-900 hover:text-yellow-200 transition"
                >
                  Go to Blog
                </a>
                <a
                  href="/cheonglol/projects"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-900 hover:text-yellow-200 transition"
                >
                  View Projects
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    />
  );
};

export default LandingPage;
