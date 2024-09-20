import confetti from "canvas-confetti"
import { onCleanup, onMount } from 'solid-js';
import { setup_done } from "~/routes/api/user";

export const FireworkConfetti = () => {

  const randomInRange = (min, max) => {
    return Math.random() * (max - min) + min
  }
    onMount(() => {
      setup_done()
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };


      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    
      return () => clearInterval(repeatFor)
    })
    const timeout = setTimeout(() => {
      document.getElementById('completed-message').remove()
    }, 15000);
    onCleanup(() => clearTimeout(timeout));

    return <div class="fixed">
    </div>
}