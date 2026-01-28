import "./polyfills"
import SmoothScroll from "smoothscroll-polyfill"
import handleSplashScreen from "./SplashScreen/splash-screen"
import "./App/css/tailwind.css"

// import "threads/register"
import "./Workers/worker-controller"
import "./App/bootstrap"

SmoothScroll.polyfill()
handleSplashScreen()
