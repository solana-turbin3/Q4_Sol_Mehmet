import React, { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      alert('Please select at least one character type');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
  };

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#c4ff9e] mb-8">Password Generator</h1>

      <div className="bg-black border border-[#c4ff9e] rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            readOnly
            value={password}
            placeholder="Generated password will appear here"
            className="input-primary flex-1 mr-4"
          />
          <div className="flex space-x-2">
            <button
              onClick={generatePassword}
              className="p-2 text-[#c4ff9e] hover:bg-[#c4ff9e]/10 rounded-md transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!password}
              className="p-2 text-[#c4ff9e] hover:bg-[#c4ff9e]/10 rounded-md transition-colors disabled:opacity-50"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#c4ff9e] mb-2">
              Password Length: {length}
            </label>
            <input
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="form-checkbox text-[#c4ff9e]"
              />
              <span className="text-[#c4ff9e]">Uppercase Letters</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="form-checkbox text-[#c4ff9e]"
              />
              <span className="text-[#c4ff9e]">Lowercase Letters</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="form-checkbox text-[#c4ff9e]"
              />
              <span className="text-[#c4ff9e]">Numbers</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="form-checkbox text-[#c4ff9e]"
              />
              <span className="text-[#c4ff9e]">Special Characters</span>
            </label>
          </div>
        </div>
      </div>

      <button onClick={generatePassword} className="btn-primary w-full">
        Generate Password
      </button>
    </div>
  );
}