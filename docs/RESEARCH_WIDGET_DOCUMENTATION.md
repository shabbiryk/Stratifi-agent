# StratiFi Research Widget Documentation

## 📚 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Component Structure](#component-structure)
5. [Usage Guide](#usage-guide)
6. [API Integration](#api-integration)
7. [Styling & Customization](#styling--customization)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Overview

The StratiFi Research Widget is a floating chat interface that provides users with instant access to DeFi research and educational content. It's designed to be non-intrusive while offering powerful research capabilities without leaving the main application.

### Key Benefits

- Instant DeFi education and research
- Context-aware responses
- Non-disruptive user experience
- Mobile-responsive design

## Features

### 1. Floating Action Button (FAB)

- Fixed position bottom-right
- Robot icon with pulse animation
- Smooth open/close transitions
- Minimizable interface

### 2. Chat Interface

- Clean, modern design
- Message history with user/AI bubbles
- Quick topic selection
- Real-time typing indicators
- Markdown support in responses

### 3. Research Topics

```typescript
const RESEARCH_PROMPTS = [
  "What is DeFi lending?",
  "Explain yield farming",
  "How do liquidity pools work?",
  "What are smart contract risks?",
  "Compare lending protocols",
];
```

### 4. Response Categories

- DeFi protocol explanations
- Yield strategies
- Risk analysis
- Market insights
- Protocol comparisons

## Technical Architecture

### File Structure

```
components/
├── ui/
│   ├── floating-chat-button.tsx    # Entry point
│   └── research-chat-widget.tsx    # Main widget
├── layouts/
│   ├── main-layout.tsx            # App integration
│   └── marketing-layout.tsx       # Marketing integration
└── types/
    └── research.ts               # Type definitions
```

### State Management

```typescript
interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  isMinimized: boolean;
  input: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
```

## Component Structure

### FloatingChatButton

```typescript
export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Button onClick={() => setIsOpen(!isOpen)}>
        <Bot /> {/* Robot icon */}
      </Button>

      {/* Chat Widget */}
      {isOpen && <ResearchChatWidget />}
    </>
  );
}
```

### ResearchChatWidget

```typescript
export function ResearchChatWidget() {
  // Core states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Message handling
  const handleSend = async (message: string) => {
    // Add user message
    // Get AI response
    // Update chat
  };

  return (
    <Card>
      <Header />
      <MessageList />
      <QuickTopics />
      <InputArea />
    </Card>
  );
}
```

## Usage Guide

### Integration in Layouts

```typescript
// In main-layout.tsx or marketing-layout.tsx
import { FloatingChatButton } from "@/components/ui";

export function MainLayout({ children }) {
  return (
    <div>
      {children}
      <FloatingChatButton />
    </div>
  );
}
```

### Customizing Topics

```typescript
// Modify RESEARCH_PROMPTS in research-chat-widget.tsx
const RESEARCH_PROMPTS = [
  "Your custom topic 1",
  "Your custom topic 2",
  // ...
];
```

## API Integration

### Setting Up API Route

```typescript
// app/api/research/chat/route.ts
export async function POST(request: Request) {
  const { message } = await request.json();

  // Call AI service
  const response = await getAIResponse(message);

  return NextResponse.json(response);
}
```

### Service Layer

```typescript
// lib/services/research-service.ts
export class ResearchService {
  static async getChatResponse(message: string) {
    const response = await fetch("/api/research/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
    return response.json();
  }
}
```

## Styling & Customization

### Theme Variables

```css
:root {
  --chat-primary: #3b82f6; /* Blue 600 */
  --chat-bg: #0f172a; /* Slate 900 */
  --chat-text: #f8fafc; /* Slate 50 */
  --chat-border: #334155; /* Slate 700 */
}
```

### Widget Dimensions

```css
.research-widget {
  width: 384px; /* w-96 */
  height: 500px; /* h-[500px] */
  max-width: calc(100vw - 3rem);
  max-height: calc(100vh - 8rem);
}
```

### Message Bubbles

```css
.message {
  max-width: 90%;
  padding: 1rem;
  border-radius: 0.5rem;

  &.user {
    background: var(--chat-primary);
    margin-left: auto;
  }

  &.assistant {
    background: var(--chat-border);
  }
}
```

## Best Practices

### 1. Response Handling

- Show typing indicator during API calls
- Handle errors gracefully
- Provide fallback responses
- Maintain conversation context

### 2. Performance

- Debounce user input
- Optimize message rendering
- Lazy load components
- Cache common responses

### 3. Accessibility

- Proper ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

### 4. Mobile Support

- Responsive dimensions
- Touch-friendly targets
- Keyboard aware positioning
- Portrait/landscape handling

## Troubleshooting

### Common Issues

1. **Widget Not Showing**

   - Check z-index values
   - Verify layout integration
   - Check CSS conflicts

2. **API Response Delays**

   - Implement timeout handling
   - Show loading states
   - Provide feedback to users

3. **Style Conflicts**
   - Use scoped CSS
   - Check specificity
   - Verify class naming

### Error Handling

```typescript
try {
  const response = await ResearchService.getChatResponse(message);
  handleSuccess(response);
} catch (error) {
  // Show error message in chat
  addMessage({
    role: "assistant",
    content: "Sorry, I encountered an error. Please try again.",
    error: true,
  });
}
```

## Future Enhancements

### Planned Features

1. **Message History**

   - Session persistence
   - Chat history browsing
   - Conversation export

2. **Enhanced Responses**

   - Rich media support
   - Interactive components
   - Code snippets

3. **User Customization**

   - Theme preferences
   - Font size control
   - Layout options

4. **Integration Options**
   - Multiple AI providers
   - Custom knowledge bases
   - API customization

---

## Contributing

To contribute to the Research Widget:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This component is part of the StratiFi application and is subject to its licensing terms.
