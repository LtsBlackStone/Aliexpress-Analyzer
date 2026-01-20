import { CategorizedProduct, Statistics } from '@/types';
import XLSX from 'xlsx-js-style';

export function exportToExcel(
  products: CategorizedProduct[],
  statistics: Statistics
) {
  // 创建工作簿
  const workbook = XLSX.utils.book_new();

  // 创建数据行
  const data = [
    // 标题行
    ['速卖通商品数据分析结果'],
    [], // 空行
    // 统计信息
    ['统计指标', '数值'],
    ['分析商品总数', statistics.totalProducts],
    ['符合分类条件商品数', statistics.categorizedCount],
    ['平均访客数', statistics.avgVisitors.toFixed(2)],
    ['平均支付转化率', (statistics.avgConversionRate * 100).toFixed(2) + '%'],
    ['平均收藏加购访客比', (statistics.avgRatio * 100).toFixed(2) + '%'],
    ['平均搜索点击率', (statistics.avgSearchClickRate * 100).toFixed(2) + '%'],
    [], // 空行
    // 表头
    ['商品ID', '商品分类', '运营建议'],
    // 数据行
    ...products.map(p => [p.productId, p.category, p.recommendations])
  ];

  // 创建工作表
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // 设置列宽
  worksheet['!cols'] = [
    { wch: 20 }, // 商品ID
    { wch: 15 }, // 商品分类
    { wch: 80 }  // 运营建议
  ];

  // 设置样式
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

  // 标题样式
  const titleCell = worksheet['A1'];
  if (titleCell) {
    titleCell.s = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
  }

  // 合并标题单元格
  worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];

  // 表头样式 (第12行，索引11)
  for (let col = 0; col <= 2; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 11, c: col });
    const cell = worksheet[cellAddress];
    if (cell) {
      cell.s = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: 'E3F2FD' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
      };
    }
  }

  // 数据行样式 - 自动换行
  for (let row = 12; row <= range.e.r; row++) {
    for (let col = 0; col <= 2; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];
      if (cell && !cell.s) {
        cell.s = {
          alignment: {
            vertical: 'top',
            wrapText: true
          }
        };
      }
    }
  }

  // 统计信息标签样式
  for (let row = 3; row <= 8; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
    const cell = worksheet[cellAddress];
    if (cell) {
      cell.s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'F5F5F5' } }
      };
    }
  }

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, '分析结果');

  // 生成文件名
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
  const fileName = `速卖通商品数据分析_${dateStr}_${timeStr}.xlsx`;

  // 导出文件
  XLSX.writeFile(workbook, fileName);
}
