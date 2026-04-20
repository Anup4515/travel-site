"use client";

import { useEffect, useRef } from "react";

type FlightWidgetFrameProps = {
  onLoad?: () => void;
};

const TP_WIDGET_URL = "https://tpwdg.com/wl_web/main.js?wl_id=16058";

export default function FlightWidgetFrame({ onLoad }: FlightWidgetFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let setupTimer: ReturnType<typeof setTimeout> | null = null;
    let heightTimer: ReturnType<typeof setTimeout> | null = null;

    const adjustHeight = () => {
      try {
        const iframeDoc = iframe.contentDocument;
        if (!iframeDoc?.body) return;

        const bodyHeight = iframeDoc.body.scrollHeight;
        if (bodyHeight > 0) {
          iframe.style.height = `${bodyHeight + 100}px`;
        }
      } catch (error) {
        console.error("Error adjusting flight widget iframe height:", error);
      }
    };

    const setupIframe = () => {
      try {
        const iframeDoc = iframe.contentDocument;
        if (!iframeDoc) return;
        
        iframeDoc.open();
        const htmlContent = `
          <!doctype html>
          <html>
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <style>
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  min-height: 100%;
                  background: #fff;
                }
                * {
                  box-sizing: border-box;
                }
              </style>
            </head>
            <body>
              <div id="tpwl-search" style="width: 100%; padding: 20px; background: #fff;"></div>
              <div id="tpwl-tickets" style="width: 100%; padding: 20px; background: #fff;"></div>
              <script type="module" src="${TP_WIDGET_URL}"><\/script>
              <script>
                (function () {
                  var launcherText = "TPWIDGET FLIGHT SEARCH";

                  function hideLauncher() {
                    var candidates = Array.from(document.querySelectorAll("button, a, input[type='button'], input[type='submit'], [role='button'], div, span"));

                    candidates.forEach(function (el) {
                      var isInput = el.tagName === "INPUT";
                      var text = isInput ? (el.value || "") : (el.textContent || "");

                      if (text.trim().toUpperCase() === launcherText) {
                        el.style.display = "none";
                      }
                    });
                  }

                  hideLauncher();
                  var observer = new MutationObserver(hideLauncher);
                  observer.observe(document.documentElement, { childList: true, subtree: true });

                  setTimeout(function () {
                    observer.disconnect();
                  }, 10000);
                })();
              </script>
            </body>
          </html>
        `;
        
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        if (onLoad) onLoad();

        heightTimer = setTimeout(adjustHeight, 2000);
      } catch (error) {
        console.error("Error setting up flight widget iframe:", error);
      }
    };

    setupTimer = setTimeout(setupIframe, 100);

    return () => {
      if (setupTimer) clearTimeout(setupTimer);
      if (heightTimer) clearTimeout(heightTimer);
    };
  }, [onLoad]);

  return (
    <iframe
      ref={iframeRef}
      title="Flights widget"
      className="w-full min-h-175 border-0 rounded-b-2xl bg-white"
      loading="lazy"
      sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
    />
  );
}
