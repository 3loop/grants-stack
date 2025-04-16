import { SquidWidget as Squid } from "@0xsquid/widget";
import { useState, useEffect } from "react";

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
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Safety check for potential errors
    const timer = setTimeout(() => {
      const squidElement = document.querySelector('[data-testid="squid-widget"]');
      if (!squidElement) {
        console.warn("Squid widget not loaded correctly, falling back to iframe");
        setHasError(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // If there's an error with React widget, fall back to iframe
  if (hasError) {
    const config = {
      integratorId: "gitcoin-50ed7b9e-5407-48c2-9b94-f443b53f6cd4",
      instantExec: true,
      apiUrl: "https://apiplus.squidrouter.com",
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
      disabledChains: {
        source: ["pacific-1", "osmosis-1"],
        destination: ["pacific-1", "osmosis-1"]
      },
    };

    const configString = encodeURIComponent(JSON.stringify(config));
    const iframeUrl = `https://studio.squidrouter.com/iframe?config=${configString}`;

    return (
      <div style={{ position: "relative", width: "500px", height: "684px" }}>
        <iframe
          title="squid_widget"
          width="500"
          height="684"
          src={iframeUrl}
          style={{ display: "block" }}
        />
      </div>
    );
  }

  // React widget configuration
  const config = {
    integratorId: "gitcoin-50ed7b9e-5407-48c2-9b94-f443b53f6cd4",
    apiUrl: "https://apiplus.squidrouter.com",
    companyName: "Gitcoin",
    style: {
      neutralContent: "#667085",
      baseContent: "#111827",
      base100: "#F9FAFB",
      base200: "#F3F4F6",
      base300: "#E5E7EB",
      error: "#EF4444",
      warning: "#F59E0B",
      success: "#10B981",
      primary: "#00B171",
      secondary: "#9CA3AF",
      secondaryContent: "#1F2937",
      neutral: "#9CA3AF",
      roundedBtn: "8px",
      roundedBox: "12px",
    },
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
    disabledChains: {
      source: ["pacific-1", "osmosis-1"],
      destination: ["pacific-1", "osmosis-1"]
    },
  };

  return (
    <div style={{ width: "500px", height: "684px" }}>
      <Squid config={config} />
    </div>
  );
};

export default SquidWidget;
