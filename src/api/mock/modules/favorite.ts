export default new Proxy({
  "/favorite/page": {
    "code": 200,
    "msg": "success",
    "data": {
      "total": 2,
      "records": [
        {
          "id": 9,
          "type": "FILE",
          "name": "word.docx",
          "parentId": null,
          "ownerId": 1,
          "bucketName": "netdisk",
          "objectKey": "user-1/1770183713221_word.docx",
          "fileSize": 56990,
          "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "fileExt": "docx",
          "etag": "809acf7e3435eb17b132bfeb0eabbaeb",
          "isDeleted": false,
          "deletedAt": null,
          "createTime": "2026-02-04T13:41:54",
          "updateTime": "2026-02-24T16:25:57"
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
        }
      ]
    }
  },
} as { [key: string]: any }, {
  get(target, prop) {
    if (/^\/favorite\/\d+\/url$/.test(prop as string)) {
      return {
        "code": 200,
        "msg": "success",
        "data": null
      }
    }
    return target[prop as string];
  }
})