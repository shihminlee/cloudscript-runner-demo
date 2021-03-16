async () => {
  context.someService.fast = () => {
    while (true) {}
  }
  return await context.someService.fast();
}
