import { FaceTecSDK } from "../core-sdk/FaceTecSDK.js/FaceTecSDK";
import type {
  FaceTecSessionResult,
  FaceTecFaceScanResultCallback,
  FaceTecFaceScanProcessor,
} from "../core-sdk/FaceTecSDK.js/FaceTecPublicApi";
import { Config } from "../Config";
import { LivenessCheckProcessor } from "../processors/LivenessCheckProcessor";
import { EnrollmentProcessor } from "../processors/EnrollmentProcessor";
// import { PhotoIDMatchProcessor } from "../processors/PhotoIDMatchProcessor";

export class MyApp {
  public init = (): void => {
    // Set the directory path for FaceTec Browser SDK Resources.
    FaceTecSDK.setResourceDirectory("../../core-sdk/FaceTecSDK.js/resources");
    // Set the directory path for FaceTec Browser SDK images.
    FaceTecSDK.setImagesDirectory("../../core-sdk/FaceTec_images");
    // Initialize FaceTec SDK and validate license.
    FaceTecSDK.initializeInDevelopmentMode(
      Config.DeviceKeyIdentifier,
      Config.PublicFaceScanEncryptionKey,
      function (initializationSuccessful: boolean) {
        console.log("Initialization Result: ", initializationSuccessful);
      }
    );
  };

  // Get the Session Token from the server.
  private getSessionToken = (
    sessionTokenCallback: (sessionToken: string) => void
  ): void => {
    const XHR = new XMLHttpRequest();
    XHR.open("GET", Config.BaseURL + "/session-token");
    XHR.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
    XHR.setRequestHeader(
      "X-User-Agent",
      FaceTecSDK.createFaceTecAPIUserAgentString("")
    );
    XHR.onreadystatechange = function (): void {
      if (this.readyState === XMLHttpRequest.DONE) {
        const sessionToken = JSON.parse(this.responseText).sessionToken;
        sessionTokenCallback(sessionToken);
      }
    };
    XHR.send();
  };

  public onLivenessCheckPressed = (): void => {
    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    this.getSessionToken((sessionToken?: string): void => {
      const livenessCheckProcessor = new LivenessCheckProcessor(
        sessionToken as string,
        () => {
          console.log(
            "Liveness Check Complete",
            livenessCheckProcessor.latestSessionResult?.status
          );
        }
      );
    });
  };

  public onEnrollCheckPressed = (): void => {
    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    this.getSessionToken((sessionToken?: string): void => {
      const enrollProcessor = new EnrollmentProcessor(
        sessionToken as string,
        () => {
          console.log(
            "onEnrollCheckPressed Check Complete",
            enrollProcessor.latestSessionResult?.status
          );
        }
      );
    });
  };
}

window.onload = (): void => {
  const MyFaceTecApp = new MyApp();
  MyFaceTecApp.init();
  // @ts-ignore
  // Make the class available to the html file.
  window.MyFaceTecApp = MyFaceTecApp;
};
