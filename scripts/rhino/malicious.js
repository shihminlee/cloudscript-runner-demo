function jsFunction(s) {
  Math.random = () => {
    return 1;
  };
  return Math.random();
}
