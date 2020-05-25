export const initDb = async () => {
  console.log(`Filling Database with Wikipedia's dirty dirty garbage...`)

  const done = await new Promise<boolean>(() => {
    setTimeout((): boolean => {
      console.log('... and Done!')
      return true
    }, 1000)
  })

  return done
}
