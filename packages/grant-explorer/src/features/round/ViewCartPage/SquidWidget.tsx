import { SquidWidget as Squid } from "@0xsquid/widget";
import { useEffect, useState } from "react";

export type SwapParams = {
  fromChainId: string;
  toChainId: string;
  fromTokenAddress?: string;
  toTokenAddress?: string;
};

const SquidWidget = ({
  fromChainId,
  toChainId,
  fromTokenAddress,
  toTokenAddress,
}: SwapParams) => {
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

  // React widget configuration following official documentation
  const config = {
    integratorId: "gitcoin-50ed7b9e-5407-48c2-9b94-f443b53f6cd4",
    apiUrl: "https://apiplus.squidrouter.com",
    themeType: "dark" as const,
    initialAssets: {
      from: {
        chainId: fromChainId,
        address: fromTokenAddress?.toLowerCase() || "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
      to: {
        chainId: toChainId,
        address: toTokenAddress?.toLowerCase() || "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    },
    availableChains: {
      source: ["8453", "1"],
      destination: ["42161"]
    },
    slippage: 1,
    hideAnimations: true, // Reduces height requirements
  };

  return (
    <div style={{ 
      width: '100%',
      maxWidth: isMobile ? '100%' : '500px',
      height: isMobile ? '100%' : 'auto',
      margin: '0 auto',
      overflow: 'hidden', // Hide scrollbar completely
      position: 'relative'
    }}>
      <Squid config={config} />
    </div>
  );
};

export default SquidWidget;
