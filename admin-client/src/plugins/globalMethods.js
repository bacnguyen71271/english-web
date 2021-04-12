export default {
    install (Vue) {
      Vue.mixin({
        methods: {
          toDateTime (dateInput) {
            let date = null;
            try {
              dateInput.getFullYear()
              date = dateInput
            } catch (e) {
              date = new Date(dateInput)
            }
            return `${date.getFullYear() }-${  (`0${  date.getMonth() + 1}`).slice(-2)  }-${  date.getDate() < 10 ? `0${  date.getDate()}` : date.getDate()} ${  date.getHours() < 10 ? `0${  date.getHours()}` : date.getHours()}:${  date.getMinutes() < 10 ? `0${  date.getMinutes()}` : date.getMinutes()}`
          },
          toSlug (s, opt) {
              s = String(s)
              opt = Object(opt)
        
              let defaults = {
                  'delimiter': '-',
                  'limit': undefined,
                  'lowercase': true,
                  'replacements': {},
                  'transliterate': (typeof (XRegExp) === 'undefined') ? true : false
              }
        
              // Merge options
              for (let k in defaults) {
                  if (!opt.hasOwnProperty(k)) {
                      opt[k] = defaults[k]
                  }
              }
        
              let char_map = {
                // Latin
                'À': 'A',
                'Á': 'A',
                'Â': 'A',
                'Ã': 'A',
                'Ä': 'A',
                'Å': 'A',
                'Æ': 'AE',
                'Ç': 'C',
                'È': 'E',
                'É': 'E',
                'Ê': 'E',
                'Ë': 'E',
                'Ì': 'I',
                'Í': 'I',
                'Î': 'I',
                'Ï': 'I',
                'Ð': 'D',
                'Ñ': 'N',
                'Ò': 'O',
                'Ó': 'O',
                'Ô': 'O',
                'Õ': 'O',
                'Ö': 'O',
                'Ő': 'O',
                'Ø': 'O',
                'Ù': 'U',
                'Ú': 'U',
                'Û': 'U',
                'Ü': 'U',
                'Ű': 'U',
                'Ý': 'Y',
                'Þ': 'TH',
                'ß': 'ss',
                'à': 'a',
                'á': 'a',
                'â': 'a',
                'ã': 'a',
                'ä': 'a',
                'å': 'a',
                'æ': 'ae',
                'ç': 'c',
                'è': 'e',
                'é': 'e',
                'ê': 'e',
                'ë': 'e',
                'ì': 'i',
                'í': 'i',
                'î': 'i',
                'ï': 'i',
                'ð': 'd',
                'ñ': 'n',
                'ò': 'o',
                'ó': 'o',
                'ô': 'o',
                'õ': 'o',
                'ö': 'o',
                'ő': 'o',
                'ø': 'o',
                'ù': 'u',
                'ú': 'u',
                'û': 'u',
                'ü': 'u',
                'ű': 'u',
                'ý': 'y',
                'þ': 'th',
                'ÿ': 'y',
        
                // Latin symbols
                '©': '(c)',
        
                // Greek
                'Α': 'A',
                'Β': 'B',
                'Γ': 'G',
                'Δ': 'D',
                'Ε': 'E',
                'Ζ': 'Z',
                'Η': 'H',
                'Θ': '8',
                'Ι': 'I',
                'Κ': 'K',
                'Λ': 'L',
                'Μ': 'M',
                'Ν': 'N',
                'Ξ': '3',
                'Ο': 'O',
                'Π': 'P',
                'Ρ': 'R',
                'Σ': 'S',
                'Τ': 'T',
                'Υ': 'Y',
                'Φ': 'F',
                'Χ': 'X',
                'Ψ': 'PS',
                'Ω': 'W',
                'Ά': 'A',
                'Έ': 'E',
                'Ί': 'I',
                'Ό': 'O',
                'Ύ': 'Y',
                'Ή': 'H',
                'Ώ': 'W',
                'Ϊ': 'I',
                'Ϋ': 'Y',
                'α': 'a',
                'β': 'b',
                'γ': 'g',
                'δ': 'd',
                'ε': 'e',
                'ζ': 'z',
                'η': 'h',
                'θ': '8',
                'ι': 'i',
                'κ': 'k',
                'λ': 'l',
                'μ': 'm',
                'ν': 'n',
                'ξ': '3',
                'ο': 'o',
                'π': 'p',
                'ρ': 'r',
                'σ': 's',
                'τ': 't',
                'υ': 'y',
                'φ': 'f',
                'χ': 'x',
                'ψ': 'ps',
                'ω': 'w',
                'ά': 'a',
                'έ': 'e',
                'ί': 'i',
                'ό': 'o',
                'ύ': 'y',
                'ή': 'h',
                'ώ': 'w',
                'ς': 's',
                'ϊ': 'i',
                'ΰ': 'y',
                'ϋ': 'y',
                'ΐ': 'i',
        
                // Turkish
                'Ş': 'S',
                'İ': 'I',
                'Ç': 'C',
                'Ü': 'U',
                'Ö': 'O',
                'Ğ': 'G',
                'ş': 's',
                'ı': 'i',
                'ç': 'c',
                'ü': 'u',
                'ö': 'o',
                'ğ': 'g',
        
                // Russian
                'А': 'A',
                'Б': 'B',
                'В': 'V',
                'Г': 'G',
                'Д': 'D',
                'Е': 'E',
                'Ё': 'Yo',
                'Ж': 'Zh',
                'З': 'Z',
                'И': 'I',
                'Й': 'J',
                'К': 'K',
                'Л': 'L',
                'М': 'M',
                'Н': 'N',
                'О': 'O',
                'П': 'P',
                'Р': 'R',
                'С': 'S',
                'Т': 'T',
                'У': 'U',
                'Ф': 'F',
                'Х': 'H',
                'Ц': 'C',
                'Ч': 'Ch',
                'Ш': 'Sh',
                'Щ': 'Sh',
                'Ъ': '',
                'Ы': 'Y',
                'Ь': '',
                'Э': 'E',
                'Ю': 'Yu',
                'Я': 'Ya',
                'а': 'a',
                'б': 'b',
                'в': 'v',
                'г': 'g',
                'д': 'd',
                'е': 'e',
                'ё': 'yo',
                'ж': 'zh',
                'з': 'z',
                'и': 'i',
                'й': 'j',
                'к': 'k',
                'л': 'l',
                'м': 'm',
                'н': 'n',
                'о': 'o',
                'п': 'p',
                'р': 'r',
                'с': 's',
                'т': 't',
                'у': 'u',
                'ф': 'f',
                'х': 'h',
                'ц': 'c',
                'ч': 'ch',
                'ш': 'sh',
                'щ': 'sh',
                'ъ': '',
                'ы': 'y',
                'ь': '',
                'э': 'e',
                'ю': 'yu',
                'я': 'ya',
        
                // Ukrainian
                'Є': 'Ye',
                'І': 'I',
                'Ї': 'Yi',
                'Ґ': 'G',
                'є': 'ye',
                'і': 'i',
                'ї': 'yi',
                'ґ': 'g',
        
                // Czech
                'Č': 'C',
                'Ď': 'D',
                'Ě': 'E',
                'Ň': 'N',
                'Ř': 'R',
                'Š': 'S',
                'Ť': 'T',
                'Ů': 'U',
                'Ž': 'Z',
                'č': 'c',
                'ď': 'd',
                'ě': 'e',
                'ň': 'n',
                'ř': 'r',
                'š': 's',
                'ť': 't',
                'ů': 'u',
                'ž': 'z',
        
                // Polish
                'Ą': 'A',
                'Ć': 'C',
                'Ę': 'e',
                'Ł': 'L',
                'Ń': 'N',
                'Ó': 'o',
                'Ś': 'S',
                'Ź': 'Z',
                'Ż': 'Z',
                'ą': 'a',
                'ć': 'c',
                'ę': 'e',
                'ł': 'l',
                'ń': 'n',
                'ó': 'o',
                'ś': 's',
                'ź': 'z',
                'ż': 'z',
        
                // Latvian
                'Ā': 'A',
                'Č': 'C',
                'Ē': 'E',
                'Ģ': 'G',
                'Ī': 'i',
                'Ķ': 'k',
                'Ļ': 'L',
                'Ņ': 'N',
                'Š': 'S',
                'Ū': 'u',
                'Ž': 'Z',
                'ā': 'a',
                'č': 'c',
                'ē': 'e',
                'ģ': 'g',
                'ī': 'i',
                'ķ': 'k',
                'ļ': 'l',
                'ņ': 'n',
                'š': 's',
                'ū': 'u',
                'ž': 'z',
        
                'Ũ': 'U',
                'Ụ': 'U',
                'Ủ': 'U',
                'Ú': 'U',
                'Ù': 'U',
                'ũ': 'u',
                'ụ': 'u',
                'ủ': 'u',
                'ú': 'u',
                'ù': 'u',
        
                'Ú': 'U',
                'Ù': 'U',
                'Ủ': 'U',
                'Ũ': 'U',
                'Ụ': 'U',
                'ú': 'u',
                'ù': 'u',
                'ủ': 'u',
                'ũ': 'u',
                'ụ': 'u',
        
                'Ứ': 'U',
                'Ừ': 'U',
                'Ử': 'U',
                'Ữ': 'U',
                'Ự': 'U',
                'Ư': 'U',
                'ứ': 'u',
                'ừ': 'u',
                'ử': 'u',
                'ữ': 'u',
                'ự': 'u',
                'ư': 'u',
        
                'Á': 'A',
                'À': 'A',
                'Ả': 'A',
                'Ã': 'A',
                'Ạ': 'A',
                'á': 'a',
                'à': 'a',
                'ả': 'a',
                'ã': 'a',
                'ạ': 'a',
                'Ấ': 'A',
                'Ầ': 'A',
                'Ẩ': 'A',
                'Ẫ': 'A',
                'Ậ': 'A',
                'Â': 'A',
                'ấ': 'a',
                'ầ': 'a',
                'ẩ': 'a',
                'ẫ': 'a',
                'ậ': 'a',
                'â': 'a',
        
                'Ắ': 'A',
                'Ằ': 'A',
                'Ẳ': 'A',
                'Ẵ': 'A',
                'Ặ': 'A',
                'Ă': 'A',
                'ắ': 'a',
                'ằ': 'a',
                'ẳ': 'a',
                'ẵ': 'a',
                'ặ': 'a',
                'ă': 'a',
        
                'Ế': 'E',
                'Ề': 'E',
                'Ể': 'E',
                'Ễ': 'E',
                'Ệ': 'E',
                'Ê': 'E',
                'ế': 'e',
                'ề': 'e',
                'ể': 'e',
                'ễ': 'e',
                'ệ': 'e',
                'ê': 'e',
                'Đ': 'D',
                'đ': 'd',
                'Í': 'I',
                'Ì': 'I',
                'Ỉ': 'I',
                'Ĩ': 'I',
                'Ị': 'I',
                'í': 'i',
                'ì': 'i',
                'ỉ': 'i',
                'ĩ': 'i',
                'ị': 'i',
                'Ý': 'Y',
                'Ỳ': 'Y',
                'Ỷ': 'Y',
                'Ỹ': 'Y',
                'Ỵ': 'Y',
                'ý': 'y',
                'ỳ': 'y',
                'ỷ': 'y',
                'ỹ': 'y',
                'ỵ': 'y',
        
                'Ơ': 'O',
                'Ớ': 'O',
                'Ờ': 'O',
                'Ở': 'O',
                'Ỡ': 'O',
                'Ợ': 'O',
                'ơ': 'o',
                'ớ': 'o',
                'ờ': 'o',
                'ở': 'o',
                'ỡ': 'o',
                'ợ': 'o',
        
                'Ó': 'O',
                'Ò': 'O',
                'Ỏ': 'O',
                'Õ': 'O',
                'Ọ': 'O',
                'ó': 'o',
                'ò': 'o',
                'ỏ': 'o',
                'õ': 'o',
                'ọ': 'o',
              }
          
              // Make custom replacements
              for (let k in opt.replacements) {
                  s = s.replace(RegExp(k, 'g'), opt.replacements[k])
              }
          
              // Transliterate characters to ASCII
              if (opt.transliterate) {
                  for (let k in char_map) {
                      s = s.replace(RegExp(k, 'g'), char_map[k])
                  }
              }
          
              // Replace non-alphanumeric characters with our delimiter
              let alnum = (typeof (XRegExp) === 'undefined') ? RegExp('[^a-z0-9]+', 'ig') : XRegExp('[^\\p{L}\\p{N}]+', 'ig')
              s = s.replace(alnum, opt.delimiter)
          
              // Remove duplicate delimiters
              s = s.replace(RegExp('[' + opt.delimiter + ']{2,}', 'g'), opt.delimiter)
          
              // Truncate slug to max. characters
              s = s.substring(0, opt.limit)
          
              // Remove delimiter from ends
              s = s.replace(RegExp('(^' + opt.delimiter + '|' + opt.delimiter + '$)', 'g'), '')
          
              return opt.lowercase ? s.toLowerCase() : s
            },
          dateToDateString (dateInput) {
            let date = null;
            try {
              dateInput.getFullYear()
              date = dateInput
            } catch (e) {
              date = new Date(dateInput)
            }
            return `${date.getFullYear()  }-${  (`0${  date.getMonth() + 1}`).slice(-2)  }-${  date.getDate() < 10 ? `0${  date.getDate()}` : date.getDate()}`
          },
          dateToDateTimeString (dateInput) {
            let date = null;
            try {
              dateInput.getFullYear()
              date = dateInput
            } catch (e) {
              date = new Date(dateInput)
            }
            return `${date.getFullYear() }-${  (`0${  date.getMonth() + 1}`).slice(-2)  }-${  date.getDate() < 10 ? `0${  date.getDate()}` : date.getDate()} ${  date.getHours() < 10 ? `0${  date.getHours()}` : date.getHours()}:${  date.getMinutes() < 10 ? `0${  date.getMinutes()}` : date.getMinutes()}`
          },
  
          groupBy (array, key) {
            return array.reduce((result, currentValue) => {
              (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue)
              return result
            }, {})
          },
          formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
  
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
            const i = Math.floor(Math.log(bytes) / Math.log(k));
  
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
          },
          formatNumber (n, p = 2, ts = ',', dp = '.') {
            const t = []
            if (n === Infinity) { n = 0 }
            if (isNaN(n)) { n = 0 }
            // Get number and decimal part of n
            n = Number(n).toFixed(p).split('.')
  
            // Add thousands separator and decimal point (if requied):
            for (let iLen = n[0].length, i = iLen ? iLen % 3 || 3 : 0, j = 0; i <= iLen; i += 3) {
              t.push(n[0].substring(j, i))
              j = i
            }
            // Insert separators and return result
            return t.join(ts) + (n[1] ? dp + n[1] : '')
          },
  
          convertStringToDate (str, format) {
            if (str == null || str.length < 8) {
              return null
            }
            const pattern = /(\d{4})(\d{2})(\d{2})/
            try {
              const dateString = str.replace(pattern, '$1-$2-$3')
              if (!isNaN(Date.parse(dateString))) {
                return new Date(dateString)
              } else {
                return null
              }
            } catch (e) {
              return null
            }
          },
          convertContent (str) {
            // Gộp nhiều dấu space thành 1 space
            str = str.replace(' ', '')
            // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của xâu
            str.trim()
            // remove tv
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
            str = str.replace(/đ/g, 'd')
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
            str = str.replace(/Đ/g, 'D')
            return str
          }
        }
      })
    }
  }