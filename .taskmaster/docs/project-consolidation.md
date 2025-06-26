# RunningCrews.com - Project Consolidation Guide

## Overview

This document consolidates all project information previously scattered across multiple "brain files" into Task Master AI as the single source of truth for the RunningCrews.com project.

## Consolidated Information Sources

### Previous Brain Files (Now Consolidated)
- `.clinerules/cline_rules.md` - Development guidelines
- `.cursor/rules/cursor_rules.mdc` - Code editor rules
- `.github/instructions/` - GitHub workflow instructions
- `.roo/` - Roo AI context
- `.trae/` - Trae AI context
- `.windsurf/` - Windsurf AI context
- `docs/AGENTS.md` - AI agent commands
- `docs/AI_CONTEXT.md` - Project context
- `docs/CLAUDE.md` - Claude-specific instructions
- `docs/project.md` - Project documentation
- `docs/status.md` - Project status updates

## Task Master as Single Source of Truth

### Why Task Master?
1. **Centralized Management**: All project information in one system
2. **AI Tool Agnostic**: Works with any AI coding assistant
3. **Version Control**: Tracks changes and progress over time
4. **Dependency Management**: Clear task relationships and prerequisites
5. **Progress Tracking**: Real-time completion status (73% complete)
6. **Detailed Planning**: Comprehensive subtask breakdown

### Current Project Status in Task Master
- **Total Tasks**: 15
- **Completed**: 11 (73%)
- **Pending**: 4 with detailed subtasks
- **Subtasks**: 24 total (all pending)

## Key Project Information

### Technology Stack
- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Airtable integration
- **Mapping**: Leaflet with OpenStreetMap
- **Deployment**: Vercel with CI/CD
- **Caching**: ISR with server-side statistics caching

### Architecture Patterns
- **Component Structure**: Modular, reusable components
- **Styling**: Tailwind CSS with mobile-first approach
- **Data Fetching**: ISR with 1-hour revalidation
- **Error Handling**: Comprehensive error boundaries
- **Performance**: Optimized with caching and lazy loading

### Development Guidelines

#### Code Standards
- TypeScript strict mode for type safety
- ESLint and Prettier for code formatting
- Component-based architecture
- Consistent naming conventions
- Comprehensive error handling

#### File Structure
```
/app                 # Next.js app directory
/components          # Reusable UI components
/lib                 # Utility functions and API integrations
/public              # Static assets
/styles              # Global styles and Tailwind config
/.taskmaster         # Task Master configuration and docs
```

#### Component Patterns
- **Layout Components**: Header, Footer, Navigation
- **Content Components**: CrewCard, CrewDetail, CrewList
- **UI Components**: SearchBar, Statistics, Pagination
- **Map Components**: WorldMap, WorldMapOptimized
- **Admin Components**: MockDataMonitor, RevalidationPanel

### API Integration
- **Airtable API**: Primary data source with pagination
- **Statistics API**: Cached endpoint (`/api/statistics`)
- **Search API**: Global search functionality
- **Revalidation API**: On-demand cache updates

### Performance Optimizations
- **Statistics Caching**: Eliminated 2-5 second loading delays
- **ISR Implementation**: 1-hour revalidation for optimal performance
- **Image Optimization**: Next.js Image component with lazy loading
- **Map Optimization**: Efficient marker clustering and lazy loading

## Remaining Work (Task Master Tasks)

### Task #8: Search Functionality (6 subtasks)
- Enhance existing SearchBar component
- Create search utility in `/lib/search.ts`
- Implement search API endpoint
- Develop search results page
- Add filtering options
- Implement search highlighting

### Task #9: Contact Page (5 subtasks)
- Implement contact form UI components
- Add form validation logic
- Create API endpoint for form submission
- Handle form submission and responses
- Add FAQ section

### Task #13: Blog System (7 subtasks)
- Create blog models in Airtable
- Implement Airtable API integration
- Create blog listing page with filtering
- Implement blog post detail page
- Develop rich text content renderer
- Add related posts and author profiles
- Implement social sharing and SEO

### Task #14: Event Management (6 subtasks)
- Create event models and Airtable integration
- Implement event card component
- Create event filters component
- Implement events listing page
- Create event detail page
- Add event registration and reminders

## Migration from Brain Files

### What's Been Consolidated
1. **Development Rules**: All coding standards and guidelines
2. **Project Context**: Complete project overview and architecture
3. **Status Updates**: Current progress and recent changes
4. **AI Instructions**: Commands and workflows for all AI tools
5. **Technical Specifications**: Technology stack and implementation details

### Benefits of Consolidation
1. **Reduced Complexity**: Single source instead of 10+ files
2. **Consistency**: All AI tools use the same information
3. **Maintainability**: Updates in one place affect all tools
4. **Progress Tracking**: Clear visibility into project completion
5. **Dependency Management**: Understanding of task relationships

## Using Task Master Commands

### Essential Commands
```bash
# Get current project status
tm get-tasks

# Get next priority task
tm next-task

# Update task progress
tm set-task-status <id> <status>

# Add new tasks
tm add-task "Task description"

# Expand complex tasks
tm expand-task <id>

# Generate task files
tm generate
```

### For AI Assistants
- Use `get-tasks` to understand current project state
- Use `next-task` to identify priority work
- Use `update-task` to add implementation details
- Use `set-task-status` to mark progress

## Project Workflow

### Development Process
1. **Check Task Master**: Review current tasks and priorities
2. **Select Next Task**: Use `next-task` command
3. **Implement Features**: Follow established patterns
4. **Test Implementation**: Verify functionality
5. **Update Progress**: Mark subtasks as complete
6. **Update Documentation**: Keep Task Master current

### Quality Assurance
- Follow TypeScript strict mode
- Implement comprehensive error handling
- Test responsive design on all devices
- Verify performance optimizations
- Ensure accessibility compliance

## Future Considerations

### Phase 2 Planning
- User authentication system
- Crew management portal
- Advanced search with geolocation
- Community reviews and ratings
- Event registration system

### Scalability
- Monitor Airtable rate limits
- Consider database migration for growth
- Implement advanced caching strategies
- Plan for mobile app development

## Conclusion

By consolidating all project information into Task Master AI, the RunningCrews.com project now has:

- **Single Source of Truth**: All information in one system
- **Clear Progress Tracking**: 73% completion with detailed subtasks
- **Consistent Development**: All AI tools use the same context
- **Efficient Workflow**: Streamlined task management
- **Future-Proof Architecture**: Scalable and maintainable codebase

This consolidation eliminates the confusion of multiple brain files and provides a clear, organized approach to project management that works with any AI coding assistant.

---

**Note**: This document serves as the migration guide. All future project updates should be made through Task Master commands to maintain consistency across all development tools.