import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";

const FILTER_CATEGORIES = [
  {
    name: "By group",
    options: ["Autodirigidos", "Autodirigidos grupo 2", "Grupo 2", "Grupo 3"],
  },
  {
    name: "By group",
    options: ["Autodirigidos", "Autodirigidos grupo 2", "Grupo 2", "Grupo 3"],
  },
  {
    name: "By group",
    options: ["Autodirigidos", "Autodirigidos grupo 2", "Grupo 2", "Grupo 3"],
  },
];

const filterPanelVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    height: 0,
    transition: {
      when: "afterChildren",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      bounce: 0.3,
      duration: 0.4,
    },
  },
};

const filterCategoryVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export const Filter = () => {
  const [showFilter, setShowFilter] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2.5">
      <Button
        variant="neutral"
        className="w-fit"
        aria-pressed={showFilter}
        onClick={() => setShowFilter(!showFilter)}
      >
        Filters
      </Button>
      <AnimatePresence>
        {showFilter && (
          <motion.div
            variants={filterPanelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            layout
            className="space-y-4 container-border px-3.5 py-4"
          >
            <h2 className="text-xl font-bold">Filter OVAs</h2>

            <div className="grid grid-cols-3 gap-6">
              {FILTER_CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.name}
                  variants={filterCategoryVariants}
                  custom={index}
                  className="space-y-2"
                >
                  <h3 className="font-bold">{category.name}</h3>

                  <ul className="space-y-2.5 list-none pl-2.5">
                    {category.options.map((option, optionIndex) => (
                      <motion.li
                        key={option}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * optionIndex + 0.2 }}
                      >
                        <label className="space-y-1 text-sm flex items-center gap-2">
                          <Checkbox />
                          <span>{option}</span>
                        </label>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-between items-center gap-2.5">
              <Button
                variant="neutral"
                onClick={() => setShowFilter(!showFilter)}
              >
                Cancel
              </Button>
              <Button>Apply</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
