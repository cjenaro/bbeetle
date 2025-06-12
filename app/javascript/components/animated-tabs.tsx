import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface Tab {
  id: string | number;
  label: string;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  activeTab: string | number;
  onTabChange: (tabId: string | number) => void;
  className?: string;
}

export default function AnimatedTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "" 
}: AnimatedTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [clipPath, setClipPath] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const calculateClipPath = () => {
    const container = containerRef.current;
    const activeTabElement = activeTabRef.current;

    if (container && activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      const { offsetWidth: containerWidth } = container;
      
      const clipLeft = (offsetLeft / containerWidth) * 100;
      const clipRight = ((offsetLeft + offsetWidth) / containerWidth) * 100;
      
      return `inset(0 ${100 - clipRight}% 0 ${clipLeft}% round 0.5rem)`;
    }
  };

  // Calculate initial position without animation
  useLayoutEffect(() => {
    const newClipPath = calculateClipPath();
    setClipPath(newClipPath || "");
    setTimeout(() => {
      setIsInitialized(true);
    }, 200);
  }, []);

  // Handle active tab changes with animation
  useEffect(() => {
    if (isInitialized) {
      const newClipPath = calculateClipPath();
      setClipPath(newClipPath || "");
    }
  }, [activeTab, isInitialized]);

  return (
    <div className={`relative ${className}`}>
      <div 
        role="tablist" 
        className="tabs tabs-box overflow-x-auto"
        ref={containerRef}
      >
        {tabs.map((tab) => (
          <button
            role="tab"
            key={tab.id}
            ref={tab.id === activeTab ? activeTabRef : null}
            className="tab"
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        animate={{ clipPath }}
        transition={isInitialized ? { duration: 0.2, ease: "easeOut" } : { duration: 0 }}
      >
        <div role="tablist" className="tabs tabs-box overflow-x-auto">
          {tabs.map((tab) => (
            <button
              role="tab"
              key={tab.id}
              className="tab tab-active"
              tabIndex={-1}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 