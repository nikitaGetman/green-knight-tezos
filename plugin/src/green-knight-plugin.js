const ROOT_ELEMENT_ID = "greenKnightRoot";
const BASE_URL = `http://localhost:3000`;
const PLUGIN_ROUTE = `${BASE_URL}/plugin?linkId=`;

function getPluginRoute(secureLinkId) {
  return `${PLUGIN_ROUTE}${secureLinkId}`;
}

class GreenKnightPlugin {
  secureLinkId = null;

  constructor(secureLinkId) {
    this.secureLinkId = secureLinkId;
  }

  async test(secureLinkId) {
    return new Promise((resolve, reject) => {
      const { document } = window;

      const rootEl = document.createElement("div");
      rootEl.setAttribute("id", ROOT_ELEMENT_ID);
      rootEl.innerHTML = styles;

      const iframe = document.createElement("iframe");

      iframe.onload = () => {
        console.log("Green Knight plugin loaded");
      };
      iframe.onerror = () => {
        console.error("Green Knight plugin load error!");
        reject("Green Knight plugin load error!");
      };

      iframe.src = getPluginRoute(secureLinkId || this.secureLinkId);

      rootEl.appendChild(iframe);
      document.body.appendChild(rootEl);

      const closeIframe = () => {
        rootEl.remove();
      };

      window.onmessage = function (event) {
        if (event.type === "message") {
          const message = event.data || "";
          if (String(message).startsWith("Green Knight plugin:")) {
            if (message.includes("success")) {
              closeIframe();
              resolve(message);
            }
            if (message.includes("error")) {
              reject(message);
            }
          }
        }
      };
    });
  }
}

window.GreenKnightPlugin = GreenKnightPlugin;

const styles = `<style>
#greenKnightRoot{
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  align-items:center;
  justify-content: center;
}

#greenKnightRoot iframe{
  border: none;
  width: 100vw;
  height: 100vh;
  border-radius: 20px;
}
#greenKnightRoot iframe body{
  background: transparent;
}
</style>`;
