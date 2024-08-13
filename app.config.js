import { defineConfig } from "@solidjs/start/config";
// import mkcert from "vite-plugin-mkcert";
import dotenv from "dotenv";

export default defineConfig(() => {
  dotenv.config();
  return {
    ssr: true,
//   vite: {
//      server: {
//        https: true
// },
//     plugins: [
//       mkcert({
//         force: true,
//         savePath: "./cert",
//       }),
//     ],
//   },
//   server: {
//     https: {
//       cert: "./cert/cert.pem",
//       key: "./cert/dev.pem"
//     },
//   },
// }

}

})
