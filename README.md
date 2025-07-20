# Warhammer Fantasy Tavern

A comprehensive React-based web application that simulates an immersive Warhammer Fantasy tavern environment with AI-powered characters, real-time conversations, and enhanced character customization features.

## Features

- **AI-Powered Characters**: 6+ distinct characters with unique personalities using OpenRouter API
- **Real-time Conversations**: WebSocket-based live tavern interactions
- **Character Customization**: Expanded creation system with technology options, weapons, armor, and cybernetics
- **Dynamic Scenes**: Multiple tavern atmospheres and scene generation
- **Story Threads**: Interconnected narratives and plot hooks
- **Rumor System**: Dynamic gossip network affecting gameplay
- **Polish Language Support**: Authentic medieval fantasy dialogue

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js + Express, WebSocket server
- **AI Integration**: OpenRouter API (Llama models)
- **State Management**: Zustand
- **UI Components**: Radix UI + shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM (optional, uses in-memory storage by default)

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd warHammerChat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenRouter API key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Netlify Deployment

### Prerequisites

1. **OpenRouter API Key**: Get your API key from [OpenRouter](https://openrouter.ai/)
2. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket

### Deployment Steps

1. **Connect to Netlify**
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Functions directory: `netlify/functions`

3. **Set Environment Variables**
   Go to Site settings > Environment variables and add:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your application

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key for AI conversations | Yes |
| `DATABASE_URL` | PostgreSQL connection string (optional) | No |
| `NODE_ENV` | Environment (development/production) | Auto-set |

## API Endpoints

### Tavern System
- `POST /api/tavern/generate-conversation` - Generate AI conversations
- `POST /api/tavern/character-response` - Get character responses
- `GET /api/tavern/characters` - Get all characters

### WebSocket Events
- `ws://localhost:5000/ws` - Real-time tavern communication
- Events: `scene-change`, `start-conversation`, `send-message`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── stores/        # Zustand state management
│   │   └── types/         # TypeScript type definitions
├── server/                # Backend Express server
│   ├── openrouter.ts      # OpenRouter API integration
│   ├── routes.ts          # API route handlers
│   └── storage.ts         # Data storage layer
├── shared/                # Shared types and schemas
├── netlify/               # Netlify deployment configuration
│   └── functions/         # Serverless functions
├── netlify.toml           # Netlify configuration
└── package.json           # Dependencies and scripts
```

## Character System

The application features 6 main characters:

1. **Wilhelm von Schreiber** - Empire Scholar
2. **Greta Żelazna Kuźnia** - Dwarf Blacksmith  
3. **Aelindra Szept Księżyca** - Elf Mage
4. **Marcus Steiner** - Empire Scout
5. **Lorenzo Złota Ręka** - Tilean Merchant
6. **Balin Poszukiwacz Złota** - Dwarf Merchant

Each character has unique:
- Personality traits and speaking styles
- Relationships with other characters
- Secrets and personal goals
- Background stories and motivations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
