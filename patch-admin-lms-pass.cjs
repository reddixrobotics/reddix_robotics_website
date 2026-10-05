const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/admin/AdminLMS.tsx', 'utf8');

const generatePassCode = `  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pass = "Rx-";
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    return pass + "!";
  };

  useEffect(() => {
    fetchData();
    setPassword(generatePassword());
  }, []);`;

code = code.replace(/  useEffect\(\(\) => \{\r?\n    fetchData\(\);\r?\n  \}, \[\]\);/g, generatePassCode);

code = code.replace(/setPassword\(''\);/g, "setPassword(generatePassword());");

fs.writeFileSync('frontend/src/pages/admin/AdminLMS.tsx', code);
