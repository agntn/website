import { PUBLIC_LIBRARIES } from "../utils/libraries";

/** One clock for every landing panel: the constellation, the grid and the code sample follow the same library. */
export function useLandingClock(intervalMs = 3200) {
  const index = ref(0);
  const tick = ref(0);
  const paused = ref(false);

  const current = computed(() => PUBLIC_LIBRARIES[index.value % PUBLIC_LIBRARIES.length]!);

  function step(delta = 1) {
    index.value = (index.value + delta + PUBLIC_LIBRARIES.length) % PUBLIC_LIBRARIES.length;
    tick.value += 1;
  }

  let timer: ReturnType<typeof setInterval> | undefined;

  onMounted(() => {
    timer = setInterval(() => {
      if (!paused.value) {
        step();
      }
    }, intervalMs);
  });

  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer);
    }
  });

  return { index, tick, paused, current, step, libraries: PUBLIC_LIBRARIES };
}
