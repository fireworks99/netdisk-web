export default new Proxy({
  "/file": {
    "code": 200,
    "msg": "success",
    "data": [
      {
        "id": 5,
        "originalName": "reverse.png",
        "storageName": "a0c2d146-a38a-494a-8ab5-24305496a853.png",
        "storagePath": "D:/NetDisk/a0c2d146-a38a-494a-8ab5-24305496a853.png",
        "fileSize": 191017,
        "contentType": "image/png",
        "createTime": "2026-01-06T15:35:41"
      },
      {
        "id": 4,
        "originalName": "报表.png",
        "storageName": "7b4aea2f-0d72-4214-baeb-65a38ac84ba0.png",
        "storagePath": "D:/NetDisk/7b4aea2f-0d72-4214-baeb-65a38ac84ba0.png",
        "fileSize": 340729,
        "contentType": "image/png",
        "createTime": "2026-01-06T15:35:18"
      },
      {
        "id": 3,
        "originalName": "报表.png",
        "storageName": "43a0f8c6-2343-4f50-9780-b33f9cc5868a.png",
        "storagePath": "D:/NetDisk/43a0f8c6-2343-4f50-9780-b33f9cc5868a.png",
        "fileSize": 340729,
        "contentType": "image/png",
        "createTime": "2026-01-06T15:28:36"
      },
      {
        "id": 2,
        "originalName": "内填充白.png",
        "storageName": "d3a2009f-51b3-4c46-b207-72db4881cb55.png",
        "storagePath": "D:/NetDisk/d3a2009f-51b3-4c46-b207-72db4881cb55.png",
        "fileSize": 6426,
        "contentType": "image/png",
        "createTime": "2026-01-06T15:14:31"
      }
    ]
  },
  "/file/upload": {
    "code": 200,
    "msg": "文件上传成功",
    "data": null
  }
} as { [key: string]: any }, {
  get(target, prop) {
    if (/^\/file\/\d+\/url$/.test(prop as string)) {
      return {
        "code": 404,
        "msg": "文件不存在",
        "data": null
      }
    }
    return target[prop as string];
  }
})