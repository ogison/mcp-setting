# MCP Dashboard - Specification

## 1. Project Overview

### 1.1 Goal
Provide an npm package that lets users configure and manage Claude Code Model Context Protocol (MCP) settings through a browser-based GUI.

### 1.2 Target Users
- Developers using Claude Code
- Users who want to manage MCP settings with a GUI
- Users who need to manage multiple MCP servers efficiently

### 1.3 Project Name
`mcp-dashboard`

## 2. Functional Requirements

### 2.1 Core Features

#### 2.1.1 Command-line launch
```bash
npx mcp-dashboard
```
- Start the web server
- Automatically open the default browser
- Use a random or user-specified port

#### 2.1.2 Load MCP settings
- Auto-detect Claude Code config file
  - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
  - Windows: `%APPDATA%/Claude/claude_desktop_config.json`
  - Linux: `~/.config/Claude/claude_desktop_config.json`
- Load and display existing MCP settings

#### 2.1.3 Edit MCP settings
- Add MCP servers
  - Server name
  - Command
  - Args (array)
  - Environment variables (optional)
- Edit MCP servers
- Delete MCP servers
- Enable/disable MCP servers

#### 2.1.4 Save settings
- Validation
  - JSON syntax check
  - Required field checks
  - Optional: check if command is executable
- Backup
  - Automatically back up existing settings before saving
  - Backup file: `claude_desktop_config.json.backup.[timestamp]`
- Write to config file

#### 2.1.5 Presets
- Provide presets for commonly used MCP servers
  - Filesystem MCP
  - Git MCP
  - GitHub MCP
  - Brave Search MCP
  - Other official MCP servers
- One-click add from presets

### 2.2 Additional Features

#### 2.2.1 Import/Export settings
- Export as JSON
- Import from JSON
- Make sharing settings easy

#### 2.2.2 Connection test
- Test connectivity to an MCP server
- Display error messages

#### 2.2.3 Log viewer
- Show MCP server logs (future enhancement)

## 3. Tech Stack

### 3.1 Backend
- **Node.js**: v18+
- **Express**: web server framework
- **TypeScript**: type-safe development

### 3.2 Frontend
- **React**: UI library
- **Vite**: build tool
- **TailwindCSS**: styling
- **React Hook Form**: form management
- **Zod**: validation

### 3.3 Others
- **open**: auto-launch browser
- **commander**: CLI option parsing
- **chalk**: colored console output

## 4. UI/UX Specification

### 4.1 Layout

```
+--------------------------------------------------+
|  MCP Dashboard                 [Import] [Export] |
+--------------------------------------------------+
|                                                  |
|  Config file path: ~/.config/Claude/claude_...   |
|                                        [Reload]  |
|                                                  |
|  +--------------------------------------------+  |
|  | MCP Servers                      [+ Add]   |  |
|  +--------------------------------------------+  |
|  |                                            |  |
|  | ○ filesystem-server           [Edit][Del] |  |
|  |   Command: npx                             |  |
|  |   Args: -y @modelcontextprotocol/server... |  |
|  |                                            |  |
|  | ○ git-server                  [Edit][Del] |  |
|  |   Command: npx                             |  |
|  |   Args: -y @modelcontextprotocol/server... |  |
|  |                                            |  |
|  | ✕ github-server (disabled)    [Edit][Del] |  |
|  |   Command: npx                             |  |
|  |   Args: -y @modelcontextprotocol/server... |  |
|  |                                            |  |
|  +--------------------------------------------+  |
|                                                  |
|  [Save Changes]                   [Discard]      |
|                                                  |
+--------------------------------------------------+
```

### 4.2 Screens

#### 4.2.1 Main screen
- MCP server list
- Enable/disable state per server
- Add/Edit/Delete buttons

#### 4.2.2 Add/Edit modal
```
+----------------------------------+
|  Add MCP Server           [x]    |
+----------------------------------+
|                                  |
|  Server Name *                   |
|  [_________________________]     |
|                                  |
|  Command *                       |
|  [_________________________]     |
|                                  |
|  Arguments (one per line)        |
|  [_________________________]     |
|  [_________________________]     |
|  [+ Add Argument]                |
|                                  |
|  Environment Variables           |
|  Key         Value               |
|  [_______]   [____________] [-]  |
|  [+ Add Variable]                |
|                                  |
|  □ Enable this server            |
|                                  |
|  [Cancel]           [Save]       |
+----------------------------------+
```

#### 4.2.3 Preset selection modal
```
+----------------------------------+
|  Add from Preset          [x]    |
+----------------------------------+
|                                  |
|  Search: [_______________]       |
|                                  |
|  ○ Filesystem MCP                |
|    Access local files and dirs   |
|                                  |
|  ○ Git MCP                       |
|    Git repository operations     |
|                                  |
|  ○ GitHub MCP                    |
|    GitHub API integration        |
|                                  |
|  ○ Brave Search MCP              |
|    Web search capabilities       |
|                                  |
|  [Cancel]           [Add]        |
+----------------------------------+
```

### 4.3 Color Scheme
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Background: White/Light Gray
- Text: Dark Gray (#1F2937)

### 4.4 Responsive Design
- Desktop-first (recommended min width: 1024px)
- Tablet support (768px and up)

## 5. API Specification

### 5.1 REST API Endpoints

#### 5.1.1 Get config
```
GET /api/config
Response: {
  "mcpServers": {
    "server-name": {
      "command": "string",
      "args": ["string"],
      "env": {
        "KEY": "value"
      },
      "disabled": boolean
    }
  }
}
```

#### 5.1.2 Save config
```
POST /api/config
Request: {
  "mcpServers": { ... }
}
Response: {
  "success": boolean,
  "message": "string"
}
```

#### 5.1.3 Validate config
```
POST /api/config/validate
Request: {
  "mcpServers": { ... }
}
Response: {
  "valid": boolean,
  "errors": ["string"]
}
```

#### 5.1.4 Get presets
```
GET /api/presets
Response: {
  "presets": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "config": { ... }
    }
  ]
}
```

#### 5.1.5 Get config path
```
GET /api/config/path
Response: {
  "path": "string",
  "exists": boolean
}
```

#### 5.1.6 Connection test
```
POST /api/test/:serverName
Response: {
  "success": boolean,
  "message": "string"
}
```

## 6. Data Structures

### 6.1 MCP config file format (Claude Desktop Config)
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "--repository",
        "/path/to/repo"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      },
      "disabled": true
    }
  }
}
```

### 6.2 Internal data model
```typescript
interface MCPServer {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  disabled?: boolean;
}

interface MCPConfig {
  mcpServers: Record<string, MCPServer>;
}

interface Preset {
  id: string;
  name: string;
  description: string;
  category: string;
  config: MCPServer;
}
```

## 7. Security Requirements

### 7.1 File access
- Limit config file access to read/write
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
- Show toast notifications for errors
- Output error details to the console
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
