# MCP Dashboard - Implementation Plan

## 1. Project Structure

```
mcp-dashboard/
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
├── LICENSE
├── SPEC.md
├── IMPLEMENTATION_PLAN.md
├── bin/
│   └── cli.js                 # CLI entry point
├── src/
│   ├── server/                # Backend
│   │   ├── index.ts           # Express server
│   │   ├── routes/
│   │   │   ├── config.ts      # Config API
│   │   │   └── presets.ts     # Preset API
│   │   ├── services/
│   │   │   ├── configManager.ts   # Config file management
│   │   │   ├── validator.ts       # Validation
│   │   │   └── presetManager.ts   # Preset management
│   │   ├── utils/
│   │   │   ├── paths.ts           # Path resolution
│   │   │   └── fileSystem.ts      # File operations
│   │   └── types/
│   │       └── index.ts           # Type definitions
│   ├── client/                # Frontend
│   │   ├── index.html
│   │   ├── src/
│   │   │   ├── main.tsx       # Entry point
│   │   │   ├── App.tsx        # Main component
│   │   │   ├── components/
│   │   │   │   ├── ServerList.tsx
│   │   │   │   ├── ServerCard.tsx
│   │   │   │   ├── ServerModal.tsx
│   │   │   │   ├── PresetModal.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Toast.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useConfig.ts
│   │   │   │   └── usePresets.ts
│   │   │   ├── services/
│   │   │   │   └── api.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── styles/
│   │   │       └── index.css
│   │   └── vite.config.ts
│   └── presets/
│       └── mcpServers.json    # Preset definitions
└── dist/                      # Build artifacts
    ├── server/
    └── client/
```

## 2. Implementation Phases

### Phase 1: Project Setup (1-2 days)
- [x] Initialize repository
- [x] Configure package.json
- [x] Configure TypeScript
- [x] Set up build tools
- [x] Install dependencies

### Phase 2: Backend Foundation (2-3 days)
- [x] Base Express server structure
- [x] Config file path resolution logic
- [x] Config file read/write service
- [x] Backup functionality
- [x] Validation logic
- [x] Preset manager

### Phase 3: API Implementation (2-3 days)
- [x] GET /api/config
- [x] POST /api/config
- [x] POST /api/config/validate
- [x] GET /api/presets
- [x] GET /api/config/path
- [x] Error handling
- [x] CORS configuration

### Phase 4: Frontend Foundation (2-3 days)
- [x] React + Vite setup
- [x] TailwindCSS configuration
- [x] Routing configuration
- [x] API client service
- [x] Custom hooks (useConfig, usePresets)
- [x] Type definitions

### Phase 5: UI Components (3-4 days)
- [x] Header component
- [x] ServerList component (integrated into App.tsx)
- [x] ServerCard component
- [x] ServerModal component (add/edit)
- [x] PresetModal component
- [x] Toast notification component
- [x] Styling

### Phase 6: Feature Integration (2-3 days)
- [x] CRUD operations
- [x] Preset selection functionality
- [x] Import/export functionality
- [x] Enable/disable toggle
- [x] Form validation
- [x] Error handling

### Phase 7: CLI Implementation (1-2 days)
- [x] CLI entry point
- [x] Command-line option parsing
- [x] Server startup logic
- [x] Automatic browser launch
- [x] Port management
- [x] Shutdown handling

### Phase 8: Testing (2-3 days)
- [x] Backend unit tests (ConfigManager, Validator)
- [ ] API integration tests
- [ ] Frontend component tests
- [ ] E2E tests
- [ ] Cross-platform tests

### Phase 9: Documentation & Release Prep (1-2 days)
- [x] Write README.md
- [x] Usage documentation
- [x] Preset list documentation
- [x] CHANGELOG.md
- [x] npm package configuration
- [x] Versioning

### Phase 10: Release (1 day)
- [ ] npm publish
- [ ] Create GitHub release
- [ ] Release notes

**Total estimated time: 17-26 days (about 3-4 weeks)**

## 3. Detailed Task Breakdown

### 3.1 Phase 1: Project Setup

#### Task 1.1: package.json configuration
```json
{
  "name": "mcp-dashboard",
  "version": "0.1.0",
  "description": "GUI tool for managing Claude Code MCP settings",
  "bin": {
    "mcp-dashboard": "./dist/cli.js"
  },
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "tsx watch src/server/index.ts",
    "dev:client": "vite",
    "build": "npm run build:server && npm run build:client",
    "build:server": "tsc -p tsconfig.server.json",
    "build:client": "vite build",
    "start": "node dist/server/index.js",
    "test": "jest",
    "lint": "eslint src/**/*.{ts,tsx}",
    "format": "prettier --write src/**/*.{ts,tsx}"
  },
  "keywords": ["mcp", "claude", "claude-code", "gui", "config"],
  "author": "",
  "license": "MIT"
}
```

#### Task 1.2: Dependencies
```bash
# Backend
npm install express cors body-parser open chalk commander

# Dev dependencies
npm install -D typescript @types/node @types/express @types/cors tsx nodemon concurrently

# Frontend
npm install react react-dom react-hook-form zod @hookform/resolvers

# Frontend dev dependencies
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer @types/react @types/react-dom

# Testing
npm install -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom
```

#### Task 1.3: TypeScript configuration
- tsconfig.json (shared)
- tsconfig.server.json (server)
- tsconfig.client.json (client)

#### Task 1.4: .gitignore
```
node_modules/
dist/
.env
*.log
```

### 3.2 Phase 2: Backend Foundation

#### Task 2.1: Config file path resolution
- Determine default config file path (e.g., `~/.config/Claude/claude_desktop_config.json`)
- Resolve paths across OSes
- Provide path via API (GET /api/config/path)
- Implement safety checks to avoid directory traversal

#### Task 2.2: Config Manager
- Load config file
- Save config file with validation
- Backup existing config when overwriting
- JSON parse/stringify with indentation
- Handle missing file gracefully

#### Task 2.3: Validator
- Use Zod for schema validation
- Validate `mcpServers` structure
- Validate each server's command/args/env
- Return detailed error messages

### 3.3 Phase 3: API Implementation

#### Task 3.1: Route definitions
- `/api/config`
  - GET: return current config
  - POST: save config
- `/api/config/validate`
  - POST: validate config without saving
- `/api/presets`
  - GET: return preset list
- `/api/config/path`
  - GET: return resolved config path

#### Task 3.2: Controller implementation
- Implement handlers for each endpoint
- Consistent error responses
- CORS configuration (localhost only)

### 3.4 Phase 4: Frontend Foundation

#### Task 4.1: Vite configuration
- React + TypeScript template
- TailwindCSS setup
- Proxy API requests to backend during dev

#### Task 4.2: API Client
- axios-based client
- Methods: getConfig, saveConfig, validateConfig, getPresets, getConfigPath

#### Task 4.3: Custom hooks
- `useConfig`: fetch/save config, manage loading/error states
- `usePresets`: fetch presets, manage selection state

### 3.5 Phase 5: UI Components

#### Task 5.1: Component structure
- Header: title, actions
- ServerList: list of server cards, add button
- ServerCard: server info, enable/disable toggle, edit/delete buttons
- ServerModal: form for add/edit, validation
- PresetModal: select from presets and apply
- Toast: notifications

#### Task 5.2: ServerModal form
- Manage form with React Hook Form
- Validate with Zod
- Dynamic args/env add/remove

### 3.6 Phase 6: Feature Integration

#### Task 6.1: CRUD workflow
- Load config on startup
- Add/edit/delete servers
- Persist changes via API

#### Task 6.2: Preset workflow
- Load presets
- Apply selected preset to form
- Merge with existing config

#### Task 6.3: Import/export
- Import config file (JSON)
- Export current config as JSON download

#### Task 6.4: Enable/disable toggle
- Toggle `disabled` flag per server

### 3.7 Phase 7: CLI Implementation

#### Task 7.1: CLI entry
- `#!/usr/bin/env node`
- Options: `--port`, `--open`, `--config-path`
- Start backend server and Vite build output
- Auto-open browser (use `open`)
- Graceful shutdown (handle SIGINT)

### 3.8 Phase 8: Testing

#### Task 8.1: Backend unit tests
- ConfigManager: load/save/backup
- Validator: valid/invalid cases

#### Task 8.2: Integration tests
- API endpoints
- Mock file system as needed

#### Task 8.3: Frontend tests
- Component rendering
- Form validation behavior

#### Task 8.4: E2E
- Simulate adding/editing/deleting servers
- Validate config download/upload

### 3.9 Phase 9: Documentation & Release Prep
- Update README with usage and screenshots
- Document presets (`src/presets/mcpServers.json`)
- Update CHANGELOG for each milestone
- Prepare npm metadata

### 3.10 Phase 10: Release
- Build client and server
- Publish to npm
- Create GitHub release and notes

## 4. UI/UX Specification

### 4.1 Layout

| Layout element          | Description                                         |
|-------------------------|-----------------------------------------------------|
| Header                  | Title, open config button, import/export buttons    |
| Main content (left)     | MCP server list (cards)                             |
| Main content (right)    | Add/edit modal, preset modal, toast notifications   |
| Footer                  | Config file path: ~/.config/Claude/claude_...       |

### 4.2 Screens

#### 4.2.1 Main screen
- MCP server list
- Enable/disable state per server
- Add/edit/delete buttons

#### 4.2.2 Add/Edit modal
- Fields: name, description, command, args[], env{}, disabled
- Validation errors shown inline
- Use presets button

#### 4.2.3 Preset selection modal
- Filterable preset list
- Apply to form and close
- Preview preset details

### 4.3 Color scheme
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Background: White/Light Gray
- Text: Dark Gray (#1F2937)

### 4.4 Responsive design
- Desktop-first (min width 1024px recommended)
- Tablet support (768px and up)

## 5. API Specification

### 5.1 REST API Endpoints

#### 5.1.1 Get config
- **GET /api/config**
- Returns current MCP config JSON

#### 5.1.2 Save config
- **POST /api/config**
- Validates and saves provided config
- Returns saved config

#### 5.1.3 Validate config
- **POST /api/config/validate**
- Validates without saving
- Returns validation result

#### 5.1.4 Get presets
- **GET /api/presets**
- Returns available presets

#### 5.1.5 Get config path
- **GET /api/config/path**
- Returns resolved config path

#### 5.1.6 Connection test
- **GET /health** (optional)

## 6. Data Structures

### 6.1 MCP config file format (Claude Desktop Config)
```json
{
  "mcpServers": {
    "server-name": {
      "command": "string",
      "args": ["string"],
      "env": {
        "KEY": "VALUE"
      },
      "disabled": false,
      "description": "string"
    }
  }
}
```

### 6.2 Internal data model
```ts
interface MCPConfig {
  mcpServers: Record<string, {
    command: string;
    args?: string[];
    env?: Record<string, string>;
    disabled?: boolean;
    description?: string;
  }>;
}
```

## 7. Security Requirements

### 7.1 File access
- Config file access limited to read/write
- Prevent path traversal
- Check appropriate file permissions

### 7.2 Input validation
- Prevent command injection
- Sanitize environment variable values
- Strict JSON structure validation

### 7.3 Localhost only
- Web server listens on localhost only
- No external network access

## 8. Error Handling

### 8.1 Error cases
- Config file does not exist
- Config file read error
- JSON parse error
- Config file write error
- Invalid MCP config
- Port conflict

### 8.2 Error display
- Show toast notifications
- Log details to console
- User-friendly error messages

## 9. Performance Requirements
- Web server startup: within 3 seconds
- Browser launch: immediately after server start
- UI response: within 100ms
- Config save: within 1 second

## 10. Compatibility

### 10.1 OS compatibility
- macOS (10.15 or later)
- Windows (10 or later)
- Linux (major distributions)

### 10.2 Node.js version
- Node.js 18.x or later

### 10.3 Browser compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 11. Future Enhancements
- MCP server status monitoring
- Real-time log viewer
- Config sync (cloud integration)
- Custom preset creation and sharing
- Multiple profile support
- Dark mode
- Localization support
