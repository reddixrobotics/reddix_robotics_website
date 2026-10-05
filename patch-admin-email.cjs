const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/admin/AdminLMS.tsx', 'utf8');

const targetStr = `setStatus(\`Success! Student account created for \${email}\`);
      setEmail('');`;

const replacementStr = `setStatus(\`Provisioned! Sending email to \${email}...\`);
      
      try {
        await fetch(\`\${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${session.access_token}\` },
          body: JSON.stringify({
            to: email,
            subject: 'Welcome to the Reddix Robotics Learning Portal!',
            html: \`
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #b91c1c;">Welcome to Reddix Robotics!</h2>
                <p>Your student portal account has been created successfully.</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Login URL:</strong> <a href="https://reddixrobotics.com/login">reddixrobotics.com/login</a></p>
                  <p><strong>Email:</strong> \${email}</p>
                  <p><strong>Password:</strong> \${password}</p>
                </div>
                <p>Please log in using the credentials above to access your assigned courses.</p>
                <p>Best regards,<br/>The Reddix Robotics Team</p>
              </div>
            \`
          })
        });
        setStatus(\`Success! Account created and email sent to \${email}\`);
      } catch (mailErr) {
        setStatus(\`Success, but failed to send email to \${email}. Give them the password manually: \${password}\`);
      }

      setEmail('');`;

code = code.replace(targetStr, replacementStr);

fs.writeFileSync('frontend/src/pages/admin/AdminLMS.tsx', code);
