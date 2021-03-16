module.exports.run = async (params, context) => {
  return await context.someService.slow();
}
