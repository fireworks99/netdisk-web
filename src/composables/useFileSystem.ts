import { ref, reactive, computed } from 'vue';
import type { DiskItem } from '@/types';
import { useLayoutStore } from '@/store/layout';
import { getFByCondition } from '@/api/system/disk';
import { Folder } from '@element-plus/icons-vue';

export const useFileSystem = (initialPath?: DiskItem[]) => {

  const path = reactive<DiskItem[]>(
    initialPath || [
      {
        id: -1,
        type: 'FOLDER',
        name: '',
        parentId: null,
        ownerId: -1,
        bucketName: null,
        objectKey: null,
        fileSize: null,
        contentType: null,
        fileExt: null,
        etag: null,
        isDeleted: false,
        deletedAt: null,
        createTime: '',
        updateTime: ''
      }
    ]
  );

  const parentId = computed(() => {
    return path.length > 1 ? path[path.length - 1]?.id : undefined;
  });

  const multi = reactive<any[]>([]);


  // -------------------------- 文件面包屑 start  ------------------------
  const breadcrumbList = computed(() => {
    return path.map(item => ({
      path: item.name + '_' + item.id,
      icon: Folder,
      title: item.name
    }));
  });
  // -------------------------- 文件面包屑 end  --------------------------



  //  ----------------- 返回上级 start  -----------------
  const cdUp = (p?: { path: string }) => {
    if (p?.path) {
      if (p.path === '__ellipsis__') return;
      while (path.length > 1) {
        const last = path[path.length - 1];
        if (last?.name + '_' + last?.id !== p.path) {
          path.pop();
        } else {
          break;
        }
      }
    } else {
      if (path.length > 1) {
        path.pop();
      }
    }
    loadTableData();
  }
  //  ----------------- 返回上级 start  -----------------



  // ----------------- 文件列表 start -----------------
  const iconMap = ref<Record<string, string>>({});

  const icons = ['folder', 'file', 'pdf', 'docx', 'xlsx', 'pptx', 'image', 'audio', 'video', 'md'];

  const loadIcons = async () => {
    for (const icon of icons) {
      const module = await import(`@/assets/images/icons/${icon}.svg?url`);
      iconMap.value[icon] = module.default;
    }
  };

  const getIconUrl = (row: DiskItem) => {
    const iconName = getFileIconName(row);
    return iconMap.value[iconName] || iconMap.value.file;
  };

  const getFileIconName = (row: DiskItem): string => {
    if (row.type === 'FOLDER') {
      return 'folder';
    }

    const extension = getFileExtension(row.name);
    const iconMap: Record<string, string> = {
      pdf: 'pdf', doc: 'docx', docx: 'docx', xls: 'xlsx', xlsx: 'xlsx', ppt: 'pptx',
      pptx: 'pptx', jpg: 'image', jpeg: 'image', png: 'image', svg: 'image', md: 'md',
      mp3: 'audio', mp4: 'video', webm: 'video', mov: 'video', ogv: 'video'
    };

    return iconMap[extension.toLowerCase()] || 'file';
  };

  const getFileExtension = (filename: string): string => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()! : '';
  };

  const keyword = ref('');
  const deleted = ref(false);
  const pageNum = ref(1);
  const pageSize = ref(10);

  const files = ref<DiskItem[]>([]);
  const total = ref(0);

  const loadTableData = async () => {
    const res = await getFByCondition({
      parentId: parentId.value,
      keyword: keyword.value,
      deleted: deleted.value,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    });
    files.value = res.data.data.records;
    total.value = res.data.data.total;
  }

  const handleCurrentChange = () => {
    loadTableData();
  };

  const handleSizeChange = () => {
    pageNum.value = 1;
    loadTableData();
  };
  // ----------------- 文件列表 end -----------------



  // ----------------- 行点击 start -----------------
  const layoutStore = useLayoutStore();
  const eventName = computed(() => {
    return layoutStore.isMobile ? 'row-click' : 'row-dblclick';
  });

  const handleRowClick = (row: DiskItem) => {
    if (row.type === 'FOLDER') {
      path.push(row);
      loadTableData();
    }
  };
  // ----------------- 行点击 end -------------------



  return {
    path,
    parentId,
    multi,

    breadcrumbList,//面包屑

    cdUp,//返回上级

    // 文件列表
    iconMap,
    loadIcons,
    getIconUrl,
    getFileIconName,
    getFileExtension,
    keyword,
    deleted,
    pageNum,
    pageSize,
    files,
    total,
    loadTableData,
    handleCurrentChange,
    handleSizeChange,

    // 行点击
    layoutStore,
    eventName,
    handleRowClick
  };
}
