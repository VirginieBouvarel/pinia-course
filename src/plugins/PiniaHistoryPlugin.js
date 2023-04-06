import { ref, reactive } from "vue";

export function PiniaHistoryPlugin({ store, options }) {
  if (!options.historyEnabled) return;

  const history = reactive([]);
  const future = reactive([]);

  const manualEditingHistory = ref(false);
  history.push(JSON.stringify(store.$state));

  store.$subscribe((mutation, state) => {
    console.log(mutation);
    if (!manualEditingHistory.value) {
      history.push(JSON.stringify(state));
      future.splice(0, future.length);
    }
  });

  const undo = () => {
    if (history.length === 1) return;
    manualEditingHistory.value = true;
    future.push(history.pop());
    store.$state = JSON.parse(history.at(-1));
    manualEditingHistory.value = false;
  };
  const redo = () => {
    const latestState = future.pop();
    if (!latestState) return;
    manualEditingHistory.value = true;
    history.push(latestState);
    store.$state = JSON.parse(latestState);
    manualEditingHistory.value = false;
  };

  return {
    history,
    future,
    undo,
    redo,
  };
}
