from gradio_client import Client
import shutil
import os
import re

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

# 示例用法
if __name__ == "__main__":
    # 测试1：使用较长的文本
    text1 = "Refactor the MobileModal component with the following requirements:"
    tts_with_download(text1)
    
    # 测试2：使用包含特殊字符的文本
    text2 = "Hello, world! How are you?"
    tts_with_download(text2)
    
    # 测试3：使用较短的文本
    text3 = "Simple test"
    tts_with_download(text3)
    
    # 也可以指定自定义路径
    # custom_path = "/Users/eli/Documents/custom_output.wav"
    # tts_with_download(text, download_path=custom_path)