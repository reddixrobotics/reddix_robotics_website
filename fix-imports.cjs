const fs = require('fs');
let routes = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');
routes = routes.replace(/import \{ Navigate \} from 'react-router-dom';\nimport \{ createBrowserRouter \} from 'react-router-dom';/, "import { createBrowserRouter, Navigate } from 'react-router-dom';");
fs.writeFileSync('frontend/src/routes/index.tsx', routes);
