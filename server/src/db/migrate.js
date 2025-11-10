import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // 스키마 파일 읽기
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    // SQL 문을 세미콜론으로 분리 (PARTITION 문 처리 고려)
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    const connection = await pool.getConnection();
    
    try {
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await connection.query(statement);
            console.log('✓ Executed statement');
          } catch (error) {
            // 테이블이 이미 존재하는 경우 무시
            if (error.code === 'ER_TABLE_EXISTS_ERROR') {
              console.log('⚠ Table already exists, skipping...');
            } else {
              throw error;
            }
          }
        }
      }
      
      console.log('✓ Migration completed successfully');
    } finally {
      connection.release();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

migrate();

