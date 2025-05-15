import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BaseLayout } from "../../layouts/BaseLayout";
import { assignCollapseState } from "../../store/reducers/sideNavigation/sideNavigationSlice";
import LandingIntro from "./components/LandingIntro";
import LandingWhoAmI from "./components/LandingWhoAmI";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatchRedux = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const blogPath = params.get("blog");
    if (blogPath) {
      const filename = blogPath.split("/").pop();
      if (filename) {
        navigate(`/cheonglol/blog/${filename}`, { replace: true });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [dispatchRedux, navigate]);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      dispatchRedux(assignCollapseState(false));
    }
  }, [dispatchRedux]);

  return (
    <BaseLayout
      contentSnap={true}
      content={
        <div className="h-full">
          <div className="min-h-screen w-full snap-always snap-start">
            <LandingIntro />
          </div>
          <div className="min-h-screen w-full snap-always snap-start">
            <LandingWhoAmI />
          </div>
          <AnimatePresence>
            <motion.div
              className="min-h-screen w-full snap-always snap-start flex flex-col items-center justify-center px-4 py-10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <motion.h2
                className="font-DM_Mono text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                What's next?
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 text-center max-w-xl px-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                Explore my blog for thoughts and tutorials, or check out my projects!
                <br className="hidden sm:block" />
                Or drop me a message.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-xs sm:max-w-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <button
                  onClick={() => navigate("/cheonglol/blog")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-base md:text-lg hover:bg-blue-900 hover:text-yellow-200 transition w-full"
                >
                  Go to Blog
                </button>
                <button
                  onClick={() => navigate("/cheonglol/projects")}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold text-base md:text-lg hover:bg-green-900 hover:text-yellow-200 transition w-full"
                >
                  View Projects
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    />
  );
};

export default LandingPage;
