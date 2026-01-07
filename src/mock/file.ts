export const listFiles = () => {
  return {
    code: 200,
    msg: 'success',
    data: [
      {
        id: 1,
        originalName: 'mock.png',
        fileSize: 123456,
        createTime: '2026-01-06'
      }
    ]
  }
}
