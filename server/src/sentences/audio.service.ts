import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class AudioService {
  private readonly logger: AppLogger | null = null;

  constructor(logger?: AppLogger) {
    if (logger) {
      this.logger = logger;
      this.logger.setContext('AudioService');
    }
  }

  private generateValidFilename(text: string): string {
    // 移除不合法的文件名字符
    let filename = text.replace(/[<>:"/\\|?*]/g, '');
    // 替换空格为下划线
    filename = filename.replace(/\s+/g, '_');
    // 限制长度，避免文件名过长
    filename = filename.substring(0, 50);
    // 确保文件名不为空
    if (!filename) {
      filename = 'default';
    }
    return `${filename}.wav`;
  }

  async generateAudio(text: string): Promise<string> {
    try {
      if (this.logger) {
        this.logger.log(`Generating audio for text: ${text}`, 'generateAudio');
      } else {
        console.log(`Generating audio for text: ${text}`);
      }
      
      // 生成文件名
      const filename = this.generateValidFilename(text);
      const publicDir = path.join(__dirname, '../../public');
      const outputPath = path.join(publicDir, filename);
      
      // 确保public目录存在
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
        if (this.logger) {
          this.logger.debug(`Created public directory: ${publicDir}`, 'generateAudio');
        } else {
          console.log(`Created public directory: ${publicDir}`);
        }
      }
      
      // 调用Python脚本生成音频
      const scriptPath = path.join(__dirname, '../../shell/audio.py');
      
      // 打印调试信息，检查Python脚本是否存在
      if (!fs.existsSync(scriptPath)) {
        if (this.logger) {
          this.logger.error(`Python script not found: ${scriptPath}`, 'generateAudio');
        } else {
          console.error(`Python script not found: ${scriptPath}`);
        }
        throw new Error(`Python script not found: ${scriptPath}`);
      }
      
      // 构造Python命令
      const command = `cd "${path.dirname(scriptPath)}" && uv run python3 audio.py "${text}" "${outputPath}"`;
      
      if (this.logger) {
        this.logger.debug(`Running command: ${command}`, 'generateAudio');
      } else {
        console.log(`Running command: ${command}`);
      }
      
      // 执行命令并添加更详细的错误处理
      try {
        execSync(command, { stdio: 'inherit' });
      } catch (execError) {
        if (this.logger) {
          this.logger.error(`Python script execution failed: ${execError.message}`, execError.stack, 'generateAudio');
        } else {
          console.error(`Python script execution failed: ${execError.message}`, execError.stack);
        }
        throw execError;
      }
      
      // 验证文件是否生成成功
      if (!fs.existsSync(outputPath)) {
        throw new InternalServerErrorException('Audio file generation failed');
      }
      
      if (this.logger) {
        this.logger.debug(`Generated audio file: ${outputPath}`, 'generateAudio');
      } else {
        console.log(`Generated audio file: ${outputPath}`);
      }
      
      // 返回相对路径
      return `/public/${filename}`;
    } catch (error) {
      if (this.logger) {
        this.logger.error(`Failed to generate audio: ${error.message}`, error.stack, 'generateAudio');
      } else {
        console.error(`Failed to generate audio: ${error.message}`, error.stack);
      }
      throw new InternalServerErrorException('Failed to generate audio');
    }
  }
}
