const { AudioService } = require('./dist/sentences/audio.service');

async function testAudio() {
  const audioService = new AudioService();
  
  try {
    console.log('Testing audio generation with relative path...');
    const text = 'Test audio generation with relative path';
    const audioUrl = await audioService.generateAudio(text);
    console.log('Success! Audio URL:', audioUrl);
    
    // 检查文件是否存在
    const filePath = './public/' + audioUrl.split('/public/')[1];
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      console.log('File exists:', filePath);
      console.log('File size:', fs.statSync(filePath).size, 'bytes');
    } else {
      console.log('File not found:', filePath);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAudio();