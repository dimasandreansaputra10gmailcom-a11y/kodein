# Security Specification

## Data Invariants
1. `users`: A user document ID must match the authenticated user's uid.
2. `materials`: Only admins can create, update, or delete materials. Anyone can read.
3. `questions`: Only admins can create, update, or delete questions. Anyone can read.
4. `progress`: Only the owner (request.auth.uid == data.userId) can modify progress.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing (User)**: Create user doc for another UID. (Expected: Deny)
2. **Ghost Field (User)**: Create user with `isSuperAdmin: true`. (Expected: Deny)
3. **Escalation (User)**: Update `isAdmin` to `true` on own profile. (Expected: Deny)
4. **Invalid Type (User)**: Update `xp` to a string instead of number. (Expected: Deny)
5. **Unauthorized Write (Material)**: Non-admin trying to create a material. (Expected: Deny)
6. **Unauthorized Update (Material)**: Non-admin trying to update material content. (Expected: Deny)
7. **Invalid Schema (Material)**: Admin creating material without `stageId`. (Expected: Deny)
8. **Unauthorized Write (Question)**: Non-admin trying to create a question. (Expected: Deny)
9. **Invalid Type (Question)**: Admin creating question with `correctAnswer` as string instead of number. (Expected: Deny)
10. **Spoof Progress (Progress)**: User A updating Progress where `userId` is User B. (Expected: Deny)
11. **Modify CompletedAt (Progress)**: User updating `completedAt` to not equal `request.time`. (Expected: Deny)
12. **Missing required (Progress)**: Create Progress without `userId`. (Expected: Deny)

## Test Runner
Testing will be simulated via direct application interaction due to environment setup constraints, but rules will be built strictly around these invariants.
