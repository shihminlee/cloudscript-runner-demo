async () => {
  return new Promise((resolve) => {
    context.redisClient.get('key', (err, value) => {
      resolve(value)
    });
  })
}
