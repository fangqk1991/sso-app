import { axiosGET } from '@fangcha/app-request'

describe('Test request.test.ts', () => {
  it(`axiosGET`, async () => {
    console.info(await axiosGET('https://httpbin.org/get').quickSend())
  })
})
