// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import "./app.css";
import { register } from "swiper/element/bundle";
import 'swiper/css/bundle';

register()

mount(() => <StartClient />, document.getElementById("app"));