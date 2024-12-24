// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generatePassword(options: any) {
  const {
    length,
    useNumbers,
    useUppercase,
    useLowercase,
    useSymbols,
    allowDuplicates,
    allowSequential,
  } = options;

  const numbers = "0123456789";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  let charSet = "";
  if (useNumbers) charSet += numbers;
  if (useUppercase) charSet += uppercase;
  if (useLowercase) charSet += lowercase;
  if (useSymbols) charSet += symbols;

  if (!charSet) return "Please select at least one option.";

  const generate = () => {
    let password = "";
    for (let i = 0; i < length; i++) {
      const char = charSet[Math.floor(Math.random() * charSet.length)];
      if (!allowDuplicates && password.includes(char)) i--;
      else password += char;
    }

    if (!allowSequential) {
      for (let i = 0; i < password.length - 1; i++) {
        if (Math.abs(password.charCodeAt(i) - password.charCodeAt(i + 1)) === 1)
          return generate();
      }
    }

    return password;
  };

  return Array(4)
    .fill(null)
    .map(() => generate());
}
