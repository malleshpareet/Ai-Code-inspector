import { useLoader } from '../../context/LoaderContext';
import RotatingText from './RotatingText';
import { AnimatePresence, motion } from 'motion/react';

export default function GlobalLoader() {
    const { isLoading } = useLoader();

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                    <RotatingText
                        texts={['Code Inspector', 'Analyzing...', 'Securing...', 'Optimizing...']}
                        mainClassName="px-4 py-2 text-black overflow-hidden justify-center rounded-lg text-2xl font-bold transition-colors duration-500"
                        colors={['bg-cyan-300', 'bg-yellow-300', 'bg-green-300', 'bg-purple-300']}
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2000}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
