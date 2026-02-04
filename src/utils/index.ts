/**
 * 文件大小格式化
 * @param {*} bytes 
 * @returns 
 */
export function formatBytes(bytes: any) {
  if (bytes === 0) return '0 B';
  if (bytes === null || isNaN(bytes) || bytes < 0) return '';

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  return size.toFixed(2) + ' ' + units[i];
}

/**
 * 
 * @param data 
 * @param fileName 
 * @param fileType 
 */
export async function downloadMinIOFile(url: string, fileName: string = "") {

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('下载失败');

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;

    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.info('下载文件时出错:', error);
  }

}