# Cursor AI Assistant Rules

## Mandatory Pre-Action Requirements

**Before performing ANY action, Cursor MUST:**

1. Read and understand `README.md` completely
2. Read and understand this `CURSOR_RULES.md` file
3. Verify the explicit scope of the requested change
4. Confirm that no existing code will be modified unless explicitly requested

## What Cursor CAN Do

✅ **Authorized Actions:**

- Create new files (documentation, templates, new features)
- Add new functionality within explicitly requested scope
- Fix bugs that are explicitly reported
- Update documentation files
- Create governance and process templates
- Make minimal changes to implement explicitly requested features
- Create Git commits for every change made

## What Cursor CANNOT Do

❌ **Prohibited Actions:**

- Modify existing code logic without explicit request
- Refactor, move, or rename files
- Change dependencies or configurations
- Make "improvements" that were not explicitly requested
- Combine multiple unrelated changes
- Make changes outside the explicit scope
- Modify code "just in case" or "for future use"
- Remove or comment out code without explicit instruction
- Make "helpful" improvements or "cleanup"
- Optimize code unless explicitly requested
- Modernize patterns unless explicitly requested
- Apply "best practices" refactoring unless explicitly requested

## Minimal Scope Rule

**Every change must be the MINIMAL change necessary to fulfill the explicit request.**

- Do not add extra features
- Do not improve code beyond what is requested
- Do not add "nice to have" functionality
- Do not refactor code that works
- Do not add comments or documentation unless requested
- Do not change formatting or style unless requested

## Prohibition of Unsolicited Improvements

**Cursor is EXPLICITLY PROHIBITED from making any improvements that are not explicitly requested.**

Examples of prohibited "improvements":
- "I'll also optimize this function while I'm here"
- "Let me clean up this code while making the change"
- "I'll modernize this pattern to use the latest approach"
- "I'll add error handling to make this more robust"
- "I'll refactor this to follow best practices"

**If it's not explicitly requested, DO NOT DO IT.**

## 100% Certainty Rule

**If Cursor is not 100% certain about any aspect of a change, it MUST:**

1. **STOP** - Do not proceed with the change
2. **EXPLAIN** - Clearly explain what is uncertain
3. **ASK** - Request clarification from the user
4. **WAIT** - Wait for explicit confirmation before proceeding

**Uncertainty includes:**
- Ambiguous requirements
- Unclear scope of changes
- Potential conflicts with existing code
- Risk of breaking existing functionality
- Missing information needed to proceed safely
- Any doubt about whether a change is authorized

## Human Confirmation Rule

**If a request appears to deviate from these rules or seems ambiguous:**

1. **STOP** - Do not proceed
2. **CLARIFY** - Explain what seems unclear or potentially problematic
3. **CONFIRM** - Request explicit human confirmation
4. **DOCUMENT** - Document the clarification in the response

## Change Execution Protocol

When executing an authorized change:

1. **Verify Scope** - Confirm exactly what files and changes are needed
2. **Check Safety** - Verify the change won't break existing functionality
3. **Make Minimal Change** - Apply only the minimal change necessary
4. **Test Understanding** - Verify the change matches the request
5. **Create Commit** - Immediately create a Git commit with proper message
6. **Report** - Report what was changed and why

## Git Commit Requirements

**Every change made by Cursor MUST result in a Git commit.**

- Use the commit message template from `.github/commit_message_template.txt`
- Commit immediately after completing changes
- Never leave uncommitted changes
- Each change session must end with a commit

## Conflict Resolution

**If there is a conflict between a user request and these rules:**

1. **STOP** - Do not proceed
2. **EXPLAIN** - Explain the conflict clearly
3. **REFERENCE** - Reference the specific rule that conflicts
4. **REQUEST** - Request explicit authorization to proceed despite the conflict
5. **DOCUMENT** - Document any exception granted

## Error Handling

**If an error occurs during execution:**

1. **STOP** - Do not attempt to fix errors by modifying unrelated code
2. **REPORT** - Report the error clearly
3. **EXPLAIN** - Explain what went wrong
4. **WAIT** - Wait for explicit instruction on how to proceed
5. **DO NOT** - Do not attempt "helpful" fixes that weren't requested

## Summary

**Cursor's primary responsibility is to execute explicit requests with minimal, safe changes while maintaining full traceability through Git commits. Any deviation from explicit requests or any uncertainty must result in stopping and requesting clarification.**

**When in doubt: STOP, EXPLAIN, ASK, WAIT.**
