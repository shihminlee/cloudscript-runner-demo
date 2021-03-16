module.exports.run = async (params, context) => {
  context.someService.fast = () => {
    while (true) {}
  }
  return await context.someService.fast();
}
