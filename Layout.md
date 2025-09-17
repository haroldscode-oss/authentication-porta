# Layout.md

## Functional Message Page Layout

This page provides a complete messaging interface with the following structure:

### Overall Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Back to Marketplace Button] (if from marketplace)          │
├─────────────────────┬───────────────────────────────────────┤
│                     │                                       │
│ CONVERSATIONS LIST  │            CHAT AREA                  │
│                     │                                       │
│ ┌─────────────────┐ │ ┌───────────────────────────────────┐ │
│ │ Search Bar      │ │ │ Chat Header (User Info)           │ │
│ └─────────────────┘ │ ├───────────────────────────────────┤ │
│                     │ │                                   │ │
│ ┌─────────────────┐ │ │                                   │ │
│ │ Conversation 1  │ │ │        Message History           │ │
│ │ ├ User Avatar   │ │ │                                   │ │
│ │ ├ Name          │ │ │                                   │ │
│ │ ├ Last Message  │ │ │                                   │ │
│ │ └ Time/Badge    │ │ │                                   │ │
│ └─────────────────┘ │ │                                   │ │
│                     │ ├───────────────────────────────────┤ │
│ ┌─────────────────┐ │ │ Message Input Area                │ │
│ │ Conversation 2  │ │ │ ┌─────────────────────────────────┐ │
│ │ ...             │ │ │ │ [📎] [Type message...] [😊] [➤] │ │
│ └─────────────────┘ │ │ └─────────────────────────────────┘ │ │
│                     │ └───────────────────────────────────┘ │
└─────────────────────┴───────────────────────────────────────┘
```

### Features

#### Conversations Sidebar (Left Panel)
- **Search Bar**: Filter conversations by user name
- **Conversation List**: 
  - User avatar with online status indicator
  - User name
  - Last message preview
  - Timestamp (relative time)
  - Unread message badge
  - Last seen status for offline users

#### Chat Area (Right Panel)
- **Chat Header**:
  - Selected user's avatar and online status
  - User name and last seen/online status
  - Action buttons (Phone, Video, More options)

- **Message History**:
  - Scrollable message list
  - Messages grouped by sender
  - Timestamp display
  - Smooth animations for new messages
  - Auto-scroll to latest message

- **Message Input**:
  - Text input with emoji support
  - Attachment button
  - Send button (disabled when empty)
  - Enter key to send
  - Character limit handling

#### Responsive Design
- **Desktop**: Side-by-side layout
- **Mobile**: Stack layout with navigation between conversations and chat
- **Back button**: Returns to conversation list on mobile

### Core Features

1. **Real-time Messaging Simulation**
   - Send and receive messages
   - Message persistence using Spark KV storage
   - Automatic message timestamps

2. **Conversation Management**
   - Multiple conversation support
   - Unread message tracking
   - Last message updates

3. **User Experience**
   - Smooth animations and transitions
   - Clean, modern white theme
   - Mobile-responsive design
   - Keyboard navigation support

4. **Data Persistence**
   - Messages stored in Spark KV
   - Conversations stored in Spark KV
   - State persists between sessions

### Technical Implementation

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion
- **Icons**: Lucide React icons
- **Storage**: Spark KV for persistence
- **Components**: Shadcn/ui components

### Navigation Flow

1. **From Marketplace**: Click "Messages" in header → Opens message page with back button
2. **Within Messages**: Click conversations to switch between chats
3. **Mobile**: Back button to return to conversation list, back to marketplace button to exit

The layout maintains the white theme with clean lines, subtle shadows, and smooth animations consistent with the rest of the application.