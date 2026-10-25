(() => {
  if (window.parent === window) return;
  let previous = 0;
  const report = () => {
    const height = Math.ceil(document.body.getBoundingClientRect().height) + 16;
    if (height === previous) return;
    previous = height;
    window.parent.postMessage({type: 'ggj-exercise-height', height}, location.origin);
  };
  new ResizeObserver(report).observe(document.body);
  window.addEventListener('load', report);
  report();
})();

