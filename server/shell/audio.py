from gradio_client import Client
import shutil
import os
import re
import sys

def generate_valid_filename(text):
    """
    根据输入文本生成合法的文件名
    移除或替换不合法字符，限制长度
    """
    # 移除不合法的文件名字符
    filename = re.sub(r'[<>:"/\\|?*]', '', text)
    # 替换空格为下划线
    filename = filename.replace(' ', '_')
    # 限制长度，避免文件名过长
    filename = filename[:50]
    # 确保文件名不为空
    if not filename:
        filename = "default"
    return f"{filename}.wav"

def tts_with_download(text, voice_display="Jennifer / 詹妮弗", language_display="English / 英文", download_path=None):
    client = Client("https://qwen-qwen3-tts-demo.ms.show/")
    result = client.predict(
        text=text,
        voice_display=voice_display,
        language_display=language_display,
        api_name="/tts_interface",
    )
    
    print(f"Temporary file path: {result}")
    
    if download_path is None:
        # 如果没有指定下载路径，使用默认路径和基于text生成的文件名
        default_dir = "/Users/eli/Documents/github/dictate-englist-fullstack/server/public"
        filename = generate_valid_filename(text)
        download_path = os.path.join(default_dir, filename)
    
    # 确保目标目录存在
    os.makedirs(os.path.dirname(download_path), exist_ok=True)
    # 复制文件到指定路径
    shutil.copy2(result, download_path)
    print(f"Audio file saved to: {download_path}")
    return download_path

# 命令行调用支持
if __name__ == "__main__":
    # 从命令行获取参数
    if len(sys.argv) == 3:
        text = sys.argv[1]
        output_path = sys.argv[2]
        tts_with_download(text, download_path=output_path)
    elif len(sys.argv) == 2:
        text = sys.argv[1]
        tts_with_download(text)
    elif len(sys.argv) == 1:
        # 默认测试
        text = "Hello, this is a default test message."
        tts_with_download(text)
    else:
        print("Usage: python audio.py <text> [output_path]")
        sys.exit(1)