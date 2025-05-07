# Threads Clone

A modern social media application built with Next.js 15, inspired by Threads. This project demonstrates the implementation of a full-featured social platform with user authentication, real-time updates, and responsive design.

## Features

- **User Authentication**: Secure login and registration using Clerk
- **Profile Management**: Create and edit user profiles
- **Thread Creation**: Post and interact with threads
- **Communities**: Join and participate in community discussions
- **Real-time Updates**: Instant notifications and content updates
- **Responsive Design**: Optimized for all device sizes

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **File Uploads**: UploadThing
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel

## Screenshots

![Home Page]![image](https://github.com/user-attachments/assets/a5f4ce6d-82f9-4092-9c5f-4d71fced6c40)

![Profile Page]![image](https://github.com/user-attachments/assets/5cf8f484-4e56-4180-8473-93e557de5eb8)

![Thread Detail]![image](https://github.com/user-attachments/assets/dbb93d86-4608-49b6-9150-8e5e0d7b33ba)

![Communities]![image](https://github.com/user-attachments/assets/bab8298b-5d5e-41e6-8617-8d9074a2aedb)


*Replace these placeholder images with actual screenshots of your application*

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- MongoDB database
- Clerk account for authentication
- UploadThing account for file uploads

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/threads-clone.git
   cd threads-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
   
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   
   # UploadThing
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components
- `lib/` - Utility functions and server actions
- `public/` - Static assets
- `styles/` - Global CSS and Tailwind configuration

## API Documentation

### Thread Actions

```typescript
// Create a new thread
createThread({ text, authorId, communityId, path })

// Fetch thread by ID
fetchThreadById(threadId)

// Add comment to a thread
addCommentToThread({ threadId, commentText, userId, path })

// Like or unlike a thread
likeOrUnlikeThread(threadId, userId, path)
```

### User Actions

```typescript
// Fetch user by ID
fetchUser(userId)

// Update user profile
updateUser({ userId, username, name, bio, image, path })

// Fetch users with pagination
fetchUsers({ userId, searchString, pageNumber, pageSize, sortBy })
```

### Community Actions

```typescript
// Create a community
createCommunity({ name, username, image, bio, createdById })

// Fetch community details
fetchCommunityDetails(id)

// Fetch communities with pagination
fetchCommunities({ pageNumber, pageSize, searchString, sortBy })
```

## Deployment

The easiest way to deploy this application is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the live demo: [threads-clone-demo.vercel.app](https://threads-clone-chi-roan.vercel.app/)

## Contributing

We welcome contributions to improve the Threads Clone project! Here's how you can contribute:

1. **Fork the Repository**: Create your own fork of the project
2. **Create a Branch**: Make your changes in a new branch
3. **Follow Coding Standards**:
   - Use TypeScript for type safety
   - Follow the existing code style
   - Write meaningful commit messages
4. **Test Your Changes**: Ensure your changes don't break existing functionality
5. **Submit a Pull Request**: Open a PR with a clear description of your changes

### Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update any relevant documentation
3. The PR will be merged once it's reviewed and approved

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework for production
- [Clerk](https://clerk.dev/) - Authentication and user management
- [MongoDB](https://www.mongodb.com/) - Database solution
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - UI component library
- [UploadThing](https://uploadthing.com/) - File upload solution
- [Vercel](https://vercel.com/) - Deployment platform
- [Lucide Icons](https://lucide.dev/) - Icon library

## License

This project is licensed under the MIT License - see the LICENSE file for details.

