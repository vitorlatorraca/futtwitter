# Best Practices Guide

## Git Best Practices

### Commit Strategy

1. **Small, Atomic Commits**
   - Each commit should represent a single, complete change
   - Commits should be small enough to understand at a glance
   - Each commit should leave the codebase in a functional state

2. **Descriptive Commit Messages**
   - Use the commit message template (`.github/commit_message_template.txt`)
   - Clearly explain WHY the change was made
   - List all files that were touched
   - Use conventional commit types: `feat`, `fix`, `chore`, `docs`, `refactor`, etc.

3. **One Problem = One Commit**
   - Never mix multiple unrelated changes in a single commit
   - Never mix bug fixes with new features
   - Never mix refactoring with feature additions

4. **Immediate Commits**
   - Commit changes immediately after completing them
   - Never leave uncommitted changes from AI assistants
   - Each change session should end with a commit

### Branch Strategy

1. **Feature Branches**
   - Create a branch for each feature or fix
   - Keep branches focused on a single purpose
   - Merge back to main after completion and review

2. **Branch Naming**
   - Use descriptive names: `feat/user-authentication`, `fix/login-bug`
   - Follow a consistent naming convention

### Pull Request Best Practices

1. **Use the PR Template**
   - Always fill out the pull request template (`.github/pull_request_template.md`)
   - Clearly describe what changed and why
   - List all affected files
   - Assess and document risk level

2. **Review Before Merge**
   - All PRs should be reviewed before merging
   - Reviewers should verify the change is minimal and scoped
   - Reviewers should check that no unauthorized changes were made

## Versioning Best Practices

### Semantic Versioning

- Follow semantic versioning principles (MAJOR.MINOR.PATCH)
- Increment version based on the type of change:
  - **MAJOR**: Breaking changes
  - **MINOR**: New features (backward compatible)
  - **PATCH**: Bug fixes (backward compatible)

### Changelog Maintenance

- Document all changes in a changelog
- Group changes by type (Added, Changed, Fixed, Removed)
- Include version numbers and dates

## Incremental Change Best Practices

### Minimal Change Principle

1. **Change Only What's Necessary**
   - Make the smallest change that solves the problem
   - Don't change code that works
   - Don't "improve" code that wasn't requested to be improved

2. **One Change at a Time**
   - Address one problem or feature per change
   - Complete one change before starting another
   - Test each change before moving to the next

3. **Incremental Testing**
   - Test each change as it's made
   - Verify the change works before proceeding
   - Don't accumulate multiple untested changes

### Change Documentation

1. **Document the Why**
   - Always explain why a change was made
   - Document the problem being solved
   - Reference any related issues or requests

2. **Document the What**
   - List all files that were modified
   - Describe what was changed in each file
   - Note any dependencies or side effects

## Prohibition of Silent Refactoring

### What is Silent Refactoring?

Silent refactoring is any change to code that:
- Was not explicitly requested
- Changes code structure without changing functionality
- "Improves" code without being asked to do so
- Modernizes patterns without explicit request

### Why It's Prohibited

1. **Risk of Breaking Changes**
   - Refactoring can introduce bugs
   - Changes to working code are inherently risky
   - Unnecessary changes increase the chance of problems

2. **Loss of Traceability**
   - Silent refactoring makes it hard to understand what changed
   - Git history becomes cluttered with "improvements"
   - Difficult to track the actual functional changes

3. **Violation of Trust**
   - Making unauthorized changes violates the principle of explicit control
   - Users expect only requested changes to be made
   - Unauthorized changes can break working systems

### Rules Against Silent Refactoring

- ❌ Never refactor code that wasn't explicitly requested to be refactored
- ❌ Never "clean up" code while making other changes
- ❌ Never modernize patterns unless explicitly requested
- ❌ Never optimize code unless explicitly requested
- ❌ Never change code structure "for better organization"

## Working with AI Safely

### Guidelines for AI-Assisted Development

1. **Explicit Instructions**
   - Always provide explicit, clear instructions
   - Specify exactly what should be changed
   - Define the scope of changes clearly

2. **Review AI Changes**
   - Review all AI-generated changes before committing
   - Verify that only requested changes were made
   - Check that no unauthorized "improvements" were added

3. **Use the Mandatory Prompt Prefix**
   - Always include the mandatory prompt prefix when requesting changes
   - This ensures AI assistants read the governance documents
   - This helps prevent unauthorized changes

4. **Incremental Requests**
   - Make small, incremental requests rather than large changes
   - Complete one change before requesting another
   - This reduces the risk of unintended changes

### AI Change Verification

Before accepting AI-generated changes:

- [ ] Verify the change matches the explicit request
- [ ] Check that no unauthorized changes were made
- [ ] Confirm that the change is minimal
- [ ] Verify that existing code wasn't modified unnecessarily
- [ ] Check that a proper Git commit was created

## "Don't Touch What Works" Rule

### Core Principle

**If code is working, don't change it unless explicitly requested.**

### Application

1. **Working Code is Sacred**
   - Don't modify code that's functioning correctly
   - Don't "improve" code that works
   - Don't refactor code that's not broken

2. **Explicit Requests Only**
   - Only change working code when explicitly asked
   - Don't assume improvements are wanted
   - Don't modernize code "for the future"

3. **Risk Assessment**
   - Changing working code always carries risk
   - The risk is rarely worth it unless explicitly requested
   - Stability is more valuable than "better" code

## "Less Change is Better Change" Rule

### Core Principle

**The best change is the smallest change that solves the problem.**

### Application

1. **Minimal Scope**
   - Make only the changes necessary to solve the problem
   - Don't add extra features "while you're at it"
   - Don't improve unrelated code

2. **Focused Changes**
   - Each change should have a single, clear purpose
   - Don't bundle multiple changes together
   - Complete one change before starting another

3. **Risk Minimization**
   - Smaller changes carry less risk
   - Easier to understand and review
   - Easier to test and verify
   - Easier to rollback if needed

### Benefits

- **Reduced Risk**: Smaller changes are less likely to break things
- **Better Traceability**: Easier to understand what changed and why
- **Easier Review**: Reviewers can focus on a single change
- **Faster Recovery**: Easier to identify and fix problems
- **Clearer History**: Git history shows clear, focused changes

## Summary

These best practices prioritize:

1. **Stability** - Don't break what works
2. **Traceability** - Clear history of all changes
3. **Minimalism** - Smallest change that solves the problem
4. **Explicitness** - Only make requested changes
5. **Safety** - Review and verify all changes

**Remember: The best code change is often no change at all. Only change what is explicitly requested, and make the smallest change necessary.**
