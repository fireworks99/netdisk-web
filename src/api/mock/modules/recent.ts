export default new Proxy({
  "/recent/page": {
    "code": 200,
    "msg": "success",
    "data": {
      "total": 4,
      "records": [
        {
          "id": 5,
          "type": "FILE",
          "name": "code.vue",
          "parentId": null,
          "ownerId": 1,
          "bucketName": "netdisk",
          "objectKey": "user-1/1770182000883_code.vue",
          "fileSize": 8520,
          "contentType": "",
          "fileExt": "vue",
          "etag": "f4f3a3d23ae4af3226b659987af07649",
          "isDeleted": false,
          "deletedAt": null,
          "createTime": "2026-02-04T13:13:20",
          "updateTime": "2026-02-24T16:20:48"
        },
        {
          "id": 11,
          "type": "FILE",
          "name": "execl.xlsx",
          "parentId": null,
          "ownerId": 1,
          "bucketName": "netdisk",
          "objectKey": "user-1/1770183748197_execl.xlsx",
          "fileSize": 9856,
          "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "fileExt": "xlsx",
          "etag": "5ebbeef5afeab4e434d12bfa4de6e651",
          "isDeleted": false,
          "deletedAt": null,
          "createTime": "2026-02-04T13:42:28",
          "updateTime": "2026-02-24T16:25:59"
        },
        {
          "id": 6,
          "type": "FILE",
          "name": "image.svg",
          "parentId": null,
          "ownerId": 1,
          "bucketName": "netdisk",
          "objectKey": "user-1/1770182245034_image.svg",
          "fileSize": 932,
          "contentType": "image/svg+xml",
          "fileExt": "svg",
          "etag": "0d38388fb4931a7bd31a4cd2ff82a7d5",
          "isDeleted": false,
          "deletedAt": null,
          "createTime": "2026-02-04T13:17:25",
          "updateTime": "2026-02-04T13:17:25"
        },
        {
          "id": 8,
          "type": "FILE",
          "name": "video.mp4",
          "parentId": null,
          "ownerId": 1,
          "bucketName": "netdisk",
          "objectKey": "user-1/1770183099660_video.mp4",
          "fileSize": 1570024,
          "contentType": "video/mp4",
          "fileExt": "mp4",
          "etag": "d9061d3da8601932e98f79ec8ba1c877",
          "isDeleted": false,
          "deletedAt": null,
          "createTime": "2026-02-04T13:31:39",
          "updateTime": "2026-02-04T13:31:39"
        }
      ]
    }
  },
} as { [key: string]: any }, {
  get(target, prop) {
    return target[prop as string];
  }
})