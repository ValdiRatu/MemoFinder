interface IConfig {
  port: number
  script: string
}

export const config: IConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 1234,
  script: process.env.SCRIPT ? process.env.SCRIPT : 'test_script'
}
