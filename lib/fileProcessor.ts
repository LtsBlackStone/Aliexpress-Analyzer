import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { detectFileEncoding } from './encodings';
import { Product, COLUMN_MAPPING } from '@/types';

export async function processFile(file: File): Promise<Product[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    return processCSV(file);
  } else if (extension === 'xlsx') {
    return processXLSX(file);
  } else {
    throw new Error('不支持的文件格式。请上传 CSV 或 XLSX 文件。');
  }
}

async function processCSV(file: File): Promise<Product[]> {
  const encoding = await detectFileEncoding(file);

  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      encoding: encoding,
      header: true,
      complete: (results) => {
        try {
          const products = extractProducts(results.data as any[]);
          resolve(products);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error)
    });
  });
}

function processXLSX(file: File): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const products = extractProducts(jsonData);
        resolve(products);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsArrayBuffer(file);
  });
}

function extractProducts(data: any[]): Product[] {
  if (data.length === 0) {
    throw new Error('文件中没有数据');
  }

  const firstRow = data[0];
  const headers = Object.keys(firstRow);

  const findColumn = (targetName: string): string => {
    const found = headers.find(h => h.trim() === targetName);
    if (!found) {
      throw new Error(`缺少必需列: ${targetName}`);
    }
    return found;
  };

  const productIdCol = findColumn(COLUMN_MAPPING.PRODUCT_ID);
  const visitorsCol = findColumn(COLUMN_MAPPING.VISITORS);
  const conversionRateCol = findColumn(COLUMN_MAPPING.CONVERSION_RATE);
  const addToCartCol = findColumn(COLUMN_MAPPING.ADD_TO_CART);
  const favoritesCol = findColumn(COLUMN_MAPPING.FAVORITES);
  const searchClickRateCol = findColumn(COLUMN_MAPPING.SEARCH_CLICK_RATE);

  return data.map((row, index) => {
    const visitors = Number(row[visitorsCol]) || 0;
    const conversionRate = Number(row[conversionRateCol]) || 0;
    const addToCart = Number(row[addToCartCol]) || 0;
    const favorites = Number(row[favoritesCol]) || 0;
    const searchClickRate = Number(row[searchClickRateCol]) || 0;

    return {
      productId: String(row[productIdCol] || `商品${index + 1}`),
      visitors,
      conversionRate,
      addToCart,
      favorites,
      searchClickRate
    };
  });
}
