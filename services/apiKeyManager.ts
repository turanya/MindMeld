interface ApiKeyStatus {
  key: string;
  credits: number;
}

class ApiKeyManager {
  private keys: ApiKeyStatus[] = [];
  private currentKeyIndex = 0;

  constructor(initialKeys: string[]) {
    this.keys = initialKeys.map(key => ({ key, credits: -1 }));
  }

  async getCurrentKey(): Promise<string | null> {
    if (this.keys.length === 0) return null;

    // Try current key first
    if (await this.isKeyValid(this.currentKeyIndex)) {
      return this.keys[this.currentKeyIndex].key;
    }

    // Try other keys if current key is invalid
    for (let i = 0; i < this.keys.length; i++) {
      if (i === this.currentKeyIndex) continue;
      if (await this.isKeyValid(i)) {
        this.currentKeyIndex = i;
        return this.keys[i].key;
      }
    }

    return null;
  }

  private async isKeyValid(index: number): Promise<boolean> {
    try {
      const response = await fetch('https://api.stability.ai/v1/user/balance', {
        headers: {
          Authorization: `Bearer ${this.keys[index].key}`
        }
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.keys[index].credits = data.credits;

      return data.credits > 0;
    } catch {
      return false;
    }
  }

  async getKeyBalance(key: string): Promise<number> {
    const keyIndex = this.keys.findIndex(k => k.key === key);
    if (keyIndex === -1) return 0;
    
    if (this.keys[keyIndex].credits === -1) {
      await this.isKeyValid(keyIndex);
    }
    
    return this.keys[keyIndex].credits;
  }
}

// Initialize with your API keys
const stabilityApiKeys = [
  'sk-nt9ybCyhxSz5oMZ6wtztjTaIu39tDNWhWD3aoBHRwwNZqlL5',
  'sk-gpmzjxjjaFUFEEqBK3kaKfRJ8XAUdXlpZBXriDwtZMON9rDM',
  'sk-Lt2107ZcsD1XXVYhFLcwEFXCP0fjAMhCxI5seW0sof6pzI8V',
  'sk-D8jlpgvImxvgbTJ2sFsHElXbcEsJ4Kczdqw4p9FKD9NSmcV6',
  'sk-e1fAoY20Wbkl6XBc8RWUhhho3dByfQGtaMGfvR4yVJrVvVyy',
  'sk-HeT4XSSQU43ugO6sPGVuDersoTgGLCfyXiiAYDK5yqgJEGHq',
  'sk-k4j8F1aiDGzzVNKwuUGWoqfR9AII0gZcbbOESHB56wzO230E',
  'sk-H5xN7at7ZC3dlmK15lPKCdubV3y3ngmxEouDGq6p6sJPB7Lp',
  'sk-RJbIKRfmFkHU8ar4RvSGBPgqfuIWzAAZq47KA5XhLZnaGgvo',
  'sk-cU5RqlkfG4AWnP9Q217RF1wRghge6URtc7iqnJgvM9AiUNrz'
];

export const apiKeyManager = new ApiKeyManager(stabilityApiKeys);
