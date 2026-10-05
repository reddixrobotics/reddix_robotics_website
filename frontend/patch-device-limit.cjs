const fs = require('fs');
let code = fs.readFileSync('src/features/auth/components/LoginForm.tsx', 'utf8');

const target = `          if (!uniqueDevices.has(deviceId) && uniqueDevices.size >= 2) {
            alert('Device Limit Exceeded! You are currently logged in on 2 other devices. Please log out from another device to continue.');
            await supabase.auth.signOut();
            setStatus('error');
            setErrorMessage('Device Limit Exceeded.');
            return;
          }`;

const replacement = `          if (!uniqueDevices.has(deviceId) && uniqueDevices.size >= 2) {
            const confirmClear = window.confirm('Device Limit Exceeded! You are currently logged in on 2 other devices (or you previously used Incognito mode).\\n\\nDo you want to forcefully log out of all other devices to continue here?');
            if (confirmClear) {
               await supabase.from('DeviceSession').delete().neq('device_identifier', deviceId);
            } else {
               await supabase.auth.signOut();
               setStatus('error');
               setErrorMessage('Device Limit Exceeded.');
               return;
            }
          }`;

if(code.includes('Device Limit Exceeded!')) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/features/auth/components/LoginForm.tsx', code);
    console.log("Patched successfully");
} else {
    console.log("Could not find target string");
}
