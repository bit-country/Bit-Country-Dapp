import md5 from "js-md5";

export default function shortCodes(string) {
  const hash = md5(string);
  const chars = [ "a", "b", "c", "d", "e", "f", "g", "h",
    "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5",
    "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H",
    "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z" ];
  
  var shortCodes = [];
  
  for (let i = 0; i < 4; i++) {
    const subString = hash.substring(i * 8, i * 8 + 8);
    const number = parseInt(subString, 16);
    let lHexLong = 0x3FFFFFFF & number;

    var outChars = "";

    for (let j = 0; j < 6; j++) {
      let index = 0x0000003D & lHexLong;

      outChars += chars[index];
      lHexLong = lHexLong >> 5;
    }

    shortCodes[i] = outChars;
  }
  
  return shortCodes;
}