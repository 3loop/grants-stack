import React, { Fragment, ReactNode, useRef, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

// Add custom styles to prevent layout shifts
const modalStyles = {
  fixedSizeModal: {
    height: 'auto',
    maxHeight: '90vh', // Match widget max height
    transition: 'none',
    animationDuration: '0s',
    overflow: 'visible'
  }
};

interface InfoModalProps {
  title?: string;
  titleSize?: "sm" | "lg";
  body?: JSX.Element;
  isOpen: boolean;
  setIsOpen:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((flag: boolean) => void);
  children?: ReactNode;
  isIframe?: boolean;
  className?: string;
}

export default function InfoModal({
  title = "",
  titleSize = "sm",
  isOpen = false,
  setIsOpen = () => {
    /**/
  },

  children,
  ...props
}: InfoModalProps) {
  const cancelButtonRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Set up resize listener
    window.addEventListener("resize", checkMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`relative ${props.className ?? "z-10"}`}
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}
        data-testid="generic-modal"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-grey-400 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className={`fixed z-10 inset-0 ${props.isIframe ? "p-0" : ""}`}>
          <div className={`flex items-center justify-center h-full text-center ${props.isIframe ? "p-0" : "p-2 sm:p-4"}`}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative ${
                  props.isIframe ? "" : "bg-white shadow-xl"
                } ${
                  props.isIframe && isMobile ? "w-full h-full" : "w-full max-w-[550px]"
                } text-left transform transition-all ${
                  props.isIframe ? "p-0" : "px-2 sm:px-4 pt-4 sm:pt-5 pb-4 sm:p-6"
                }`}
                style={props.isIframe ? { 
                  height: isMobile ? '100%' : 'auto',
                  maxHeight: isMobile ? '100%' : '85vh',
                  background: 'transparent', 
                  boxShadow: 'none',
                  border: 'none',
                  borderRadius: isMobile ? '0' : '16px',
                  overflow: 'hidden' // Hide scrollbar
                } : undefined}
              >
                {/* Close button for mobile */}
                {props.isIframe && isMobile && (
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 left-4 z-50 px-4 py-2 rounded-full bg-gray-800 text-white flex items-center"
                    style={{ fontSize: '16px' }}
                  >
                    <span className="mr-1">✕</span>
                    <span>Close</span>
                  </button>
                )}
                
                <div className={`${props.isIframe && isMobile ? "h-full" : ""}`}>
                  <div className={`mt-2 sm:mt-0 text-center sm:text-left w-full ${props.isIframe ? "p-0 m-0" : ""}`}>
                    <Dialog.Title
                      as="h3"
                      className={`${
                        titleSize === "sm" ? "text-base" : "text-2xl"
                      } leading-6 font-semibold text-grey-500 text-center ${props.isIframe ? "hidden" : ""}`}
                      data-testid="Info-heading"
                    >
                      {title}
                    </Dialog.Title>
                    {props.body && (
                      <div className={`${props.isIframe ? "m-0 p-0 h-full" : "mt-2"}`}
                           style={props.isIframe && isMobile ? { height: '100vh' } : undefined}>
                        {props.body}
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
        {children}
      </Dialog>
    </Transition.Root>
  );
}
