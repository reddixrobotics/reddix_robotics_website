const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/auth/components/LoginForm.tsx', 'utf8');

const regex = /const handleSuccessRedirect = async \(role: string\) => \{/;
const replacement = `const handleSuccessRedirect = async (role: string) => {
    // DEVICE LIMIT CHECK (Phase 2 Security)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && (!role || role === 'USER')) {
        let deviceId = localStorage.getItem('redx_device_id');
        if (!deviceId) {
          deviceId = crypto.randomUUID();
          localStorage.setItem('redx_device_id', deviceId);
        }
        
        // Count active devices
        const { data: activeSessions } = await supabase
          .from('DeviceSession')
          .select('id, device_identifier')
          .eq('is_revoked', false);
          
        if (activeSessions) {
          const uniqueDevices = new Set(activeSessions.map(s => s.device_identifier));
          // If this is a new device and they already have 2 others
          if (!uniqueDevices.has(deviceId) && uniqueDevices.size >= 2) {
            alert('Device Limit Exceeded! You are currently logged in on 2 other devices. Please log out from another device to continue.');
            await supabase.auth.signOut();
            setStatus('error');
            setErrorMessage('Device Limit Exceeded.');
            return;
          }
        }
        
        // Register this device
        await supabase.from('DeviceSession').upsert({
          user_id: user.id,
          device_identifier: deviceId,
          user_agent: navigator.userAgent,
          last_active_at: new Date().toISOString()
        }, { onConflict: 'user_id, device_identifier' });
      }
    } catch (e) {
      console.error("Device tracking error", e);
    }
`;

code = code.replace(regex, replacement);

fs.writeFileSync('frontend/src/features/auth/components/LoginForm.tsx', code);
